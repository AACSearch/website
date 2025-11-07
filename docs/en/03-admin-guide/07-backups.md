# Резервное копирование

> Полное руководство по backup и восстановлению данных в AACSearch Platform.

## Содержание

- [Автоматические Snapshot](#автоматические-snapshot)
- [Manual Backups](#manual-backups)
- [Backup Retention](#backup-retention)
- [Restore процедура](#restore-процедура)
- [Point-in-Time Recovery](#point-in-time-recovery)
- [Disaster Recovery Plan](#disaster-recovery-plan)
- [S3 Storage](#s3-storage)

---

## Автоматические Snapshot

### Snapshot Job

**Файл:** `/src/jobs/snapshotJob.ts`

**Расписание:** Каждый день в 1:00 AM

### Что включается в snapshot

1. **PostgreSQL Database**
   - Все таблицы
   - Индексы
   - Constraints
   - Functions

2. **Typesense Collections**
   - Export всех documents
   - Schemas
   - Aliases

3. **File Storage** (опционально)
   - Uploaded files
   - Media

### Структура snapshot

```
/backups/
└── snapshot_2025-11-02_1699234567/
    ├── database.sql.gz        # PostgreSQL dump
    ├── typesense/
    │   ├── symbols.jsonl      # Typesense export
    │   ├── pages.jsonl
    │   └── collections.jsonl
    └── metadata.json          # Snapshot info
```

### Конфигурация

```typescript
// Job configuration
const snapshotConfig = {
  includeTypesense: true,
  includeDatabase: true,
  destination: process.env.SNAPSHOT_DIR || '/backups',
  rotateOld: true,
  maxSnapshots: 7, // Keep last 7 days
}
```

### Запуск вручную

```bash
# CLI
npm run cli snapshot:create

# With options
npm run cli snapshot:create \
  --include-typesense \
  --include-database \
  --destination /custom/path
```

---

## Manual Backups

### Database Backup

#### PostgreSQL

```bash
# Full database dump
pg_dump -h localhost -U postgres -d aacsearch > backup.sql

# Compressed
pg_dump -h localhost -U postgres -d aacsearch | gzip > backup.sql.gz

# With schema only
pg_dump --schema-only -h localhost -U postgres -d aacsearch > schema.sql

# Specific tables
pg_dump -t users -t tenants -h localhost -U postgres -d aacsearch > partial.sql
```

#### Using environment variables

```bash
# From DATABASE_URI
export DATABASE_URI="postgresql://user:pass@host:5432/dbname"

# Extract components
export PGHOST=$(echo $DATABASE_URI | sed -n 's/.*@\(.*\):.*/\1/p')
export PGPORT=$(echo $DATABASE_URI | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
export PGUSER=$(echo $DATABASE_URI | sed -n 's/.*\/\/\(.*\):.*/\1/p')
export PGDATABASE=$(echo $DATABASE_URI | sed -n 's/.*\/\(.*\)/\1/p')

# Backup
pg_dump > backup.sql
```

### Typesense Backup

```bash
# Export collection to JSONL
curl "http://localhost:8108/collections/symbols/documents/export" \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_ADMIN_KEY}" \
  > symbols.jsonl
```

```typescript
// Programmatic export
import { typesenseClient } from '@/typesense/client'

async function exportCollection(collectionName: string): Promise<string> {
  const exportData = await typesenseClient
    .collections(collectionName)
    .documents()
    .export()

  return exportData
}

// Save to file
const data = await exportCollection('symbols')
fs.writeFileSync('symbols.jsonl', data)
```

---

## Backup Retention

### Retention Policy

**По умолчанию:**
- Daily backups: 7 дней
- Weekly backups: 4 недели
- Monthly backups: 12 месяцев

### Реализация

```typescript
async function rotateSnapshots(
  snapshotDir: string,
  maxSnapshots: number,
  logger: Logger
): Promise<void> {
  const snapshots = fs
    .readdirSync(snapshotDir)
    .filter(name => name.startsWith('snapshot_'))
    .map(name => ({
      name,
      path: path.join(snapshotDir, name),
      mtime: fs.statSync(path.join(snapshotDir, name)).mtime,
    }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())

  // Keep only maxSnapshots
  const toDelete = snapshots.slice(maxSnapshots)

  for (const snapshot of toDelete) {
    logger.info(`Deleting old snapshot: ${snapshot.name}`)
    fs.rmSync(snapshot.path, { recursive: true, force: true })
  }

  logger.info(`Retained ${maxSnapshots} snapshots, deleted ${toDelete.length}`)
}
```

### Конфигурация retention

```env
# .env
SNAPSHOT_RETENTION_DAYS=7
SNAPSHOT_RETENTION_WEEKS=4
SNAPSHOT_RETENTION_MONTHS=12
```

---

## Restore процедура

### Восстановление из snapshot

#### Шаг 1: Остановить приложение

```bash
# Docker
docker-compose down

# PM2
pm2 stop aacsearch

# Systemd
systemctl stop aacsearch
```

#### Шаг 2: Выбрать snapshot

```bash
# Список доступных snapshots
ls -lth /backups/

# Выбрать нужный
export SNAPSHOT_DIR=/backups/snapshot_2025-11-02_1699234567
```

#### Шаг 3: Восстановить базу данных

```bash
# Удалить текущую БД (ОСТОРОЖНО!)
dropdb aacsearch

# Создать новую
createdb aacsearch

# Восстановить из backup
gunzip < $SNAPSHOT_DIR/database.sql.gz | psql aacsearch

# Или без распаковки
psql aacsearch < $SNAPSHOT_DIR/database.sql
```

#### Шаг 4: Восстановить Typesense

```bash
# Удалить старые коллекции
curl -X DELETE "http://localhost:8108/collections/symbols" \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_ADMIN_KEY}"

# Создать коллекцию заново
# (schema будет создан автоматически при импорте)

# Импортировать данные
curl -X POST "http://localhost:8108/collections/symbols/documents/import" \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_ADMIN_KEY}" \
  -H "Content-Type: text/plain" \
  --data-binary @$SNAPSHOT_DIR/typesense/symbols.jsonl
```

#### Шаг 5: Проверить целостность

```bash
# Проверка БД
psql aacsearch -c "SELECT COUNT(*) FROM users;"
psql aacsearch -c "SELECT COUNT(*) FROM tenants;"

# Проверка Typesense
curl "http://localhost:8108/collections/symbols" \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_ADMIN_KEY}"
```

#### Шаг 6: Запустить приложение

```bash
# Docker
docker-compose up -d

# PM2
pm2 start aacsearch

# Systemd
systemctl start aacsearch
```

#### Шаг 7: Проверить работоспособность

```bash
# Health check
curl http://localhost:3000/api/health

# Login test
curl -X POST http://localhost:3000/api/auth/login \
  -d '{"email":"admin@example.com","password":"password"}'
```

---

## Point-in-Time Recovery

### PostgreSQL WAL (Write-Ahead Logging)

```sql
-- Включить WAL archiving
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'cp %p /backups/wal/%f';

-- Restart PostgreSQL
-- sudo systemctl restart postgresql
```

### Восстановление на конкретный момент времени

```bash
# 1. Восстановить base backup
psql aacsearch < base_backup.sql

# 2. Настроить recovery
cat > recovery.conf << EOF
restore_command = 'cp /backups/wal/%f %p'
recovery_target_time = '2025-11-02 14:30:00'
EOF

# 3. Запустить PostgreSQL
# Он применит WAL до указанного времени
```

### Automated PITR

```typescript
async function performPITR(targetTime: Date): Promise<void> {
  // 1. Остановить приложение
  await stopApplication()

  // 2. Найти ближайший базовый backup
  const baseBackup = await findNearestBackup(targetTime)

  // 3. Восстановить base backup
  await restoreBaseBackup(baseBackup)

  // 4. Применить WAL до targetTime
  await applyWALLogs(baseBackup.timestamp, targetTime)

  // 5. Проверить целостность
  await verifyDatabaseIntegrity()

  // 6. Запустить приложение
  await startApplication()
}
```

---

## Disaster Recovery Plan

### Сценарии катастроф

**1. Database corruption**
- Причина: Disk failure, bug
- Восстановление: Last snapshot (< 1 день данных)
- RTO: 30 минут
- RPO: 24 часа

**2. Ransomware**
- Причина: Malware, security breach
- Восстановление: Snapshot + security cleanup
- RTO: 2 часа
- RPO: 24 часа

**3. Data center outage**
- Причина: Power, network, fire
- Восстановление: Failover to secondary region
- RTO: 15 минут
- RPO: 5 минут

**4. Human error (DROP TABLE)**
- Причина: Administrator mistake
- Восстановление: PITR to before error
- RTO: 1 час
- RPO: До момента ошибки

### DR Checklist

**До катастрофы:**
- [ ] Регулярные backups (daily)
- [ ] Off-site backup storage (S3)
- [ ] Тестирование restore (monthly)
- [ ] Документированная процедура
- [ ] Контакты команды
- [ ] Monitoring и алерты

**Во время катастрофы:**
- [ ] Assess damage
- [ ] Notify stakeholders
- [ ] Execute recovery plan
- [ ] Document actions
- [ ] Update status page

**После катастрофы:**
- [ ] Post-mortem анализ
- [ ] Улучшение процессов
- [ ] Update DR plan
- [ ] Training команды

---

## S3 Storage

### Настройка S3 для backups

```typescript
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
})

async function uploadBackupToS3(
  localPath: string,
  s3Key: string
): Promise<void> {
  const fileStream = fs.createReadStream(localPath)

  await s3.upload({
    Bucket: 'aacsearch-backups',
    Key: s3Key,
    Body: fileStream,
    ServerSideEncryption: 'AES256',
    StorageClass: 'STANDARD_IA', // Infrequent Access
  }).promise()

  console.log(`Uploaded backup to S3: ${s3Key}`)
}
```

### Lifecycle policy

```json
{
  "Rules": [
    {
      "Id": "backup-lifecycle",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "GLACIER"
        },
        {
          "Days": 90,
          "StorageClass": "DEEP_ARCHIVE"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    }
  ]
}
```

### Download from S3

```typescript
async function downloadBackupFromS3(
  s3Key: string,
  localPath: string
): Promise<void> {
  const params = {
    Bucket: 'aacsearch-backups',
    Key: s3Key,
  }

  const fileStream = fs.createWriteStream(localPath)

  s3.getObject(params)
    .createReadStream()
    .pipe(fileStream)

  await new Promise((resolve, reject) => {
    fileStream.on('finish', resolve)
    fileStream.on('error', reject)
  })

  console.log(`Downloaded backup from S3: ${s3Key}`)
}
```

### Restore from S3

```bash
# List available backups
aws s3 ls s3://aacsearch-backups/snapshots/

# Download specific snapshot
aws s3 cp s3://aacsearch-backups/snapshots/snapshot_2025-11-02.tar.gz \
  /tmp/snapshot.tar.gz

# Extract
tar -xzf /tmp/snapshot.tar.gz -C /backups/

# Restore
npm run cli restore --snapshot /backups/snapshot_2025-11-02
```

---

## Best Practices

### Backup Strategy

✅ **Рекомендуется:**

1. **3-2-1 Rule**
   - 3 копии данных
   - 2 разных типа storage
   - 1 off-site копия

2. **Automated daily backups**
   - Каждый день в 1:00 AM
   - Retention: 7 дней

3. **Test restore monthly**
   - Проверять что backup работает
   - Измерять RTO/RPO

4. **Monitor backup success**
   - Alerts при failed backups
   - Dashboard с backup stats

5. **Encrypt backups**
   - At rest (S3 encryption)
   - In transit (TLS)

6. **Document procedures**
   - Restore playbook
   - Contact list
   - DR plan

### Monitoring Backups

```typescript
// Check last backup time
async function checkBackupHealth(): Promise<void> {
  const lastBackup = await getLatestSnapshot()

  const hoursSinceBackup = 
    (Date.now() - lastBackup.createdAt.getTime()) / 3600000

  if (hoursSinceBackup > 25) {
    await sendAlert({
      type: 'backup_missing',
      message: `No backup in ${hoursSinceBackup} hours`,
      severity: 'critical',
    })
  }
}

// Run every hour
schedule.every('hour').do(checkBackupHealth)
```

### Testing Backups

```typescript
// Monthly restore test
async function testBackupRestore(): Promise<void> {
  const testDB = 'aacsearch_restore_test'

  try {
    // 1. Create test database
    await createTestDatabase(testDB)

    // 2. Restore latest backup
    const latest = await getLatestSnapshot()
    await restoreSnapshot(latest, testDB)

    // 3. Verify data
    const verified = await verifyData(testDB)

    if (!verified) {
      throw new Error('Data verification failed')
    }

    console.log('✅ Backup restore test PASSED')

    // 4. Cleanup
    await dropTestDatabase(testDB)
  } catch (error) {
    console.error('❌ Backup restore test FAILED:', error)
    await sendAlert({
      type: 'backup_test_failed',
      message: error.message,
      severity: 'critical',
    })
  }
}

// Schedule monthly
schedule.every('month').on(1).at('03:00').do(testBackupRestore)
```

---

## Troubleshooting

### Backup не создается

**Проблема:** Job fails

**Диагностика:**
```bash
# Check job logs
npm run cli logs --filter snapshot

# Check disk space
df -h /backups

# Check permissions
ls -la /backups
```

**Решение:**
```bash
# Free up space
npm run cli snapshot:rotate --max 3

# Fix permissions
sudo chown -R app:app /backups
```

---

### Restore fails

**Проблема:** Database restore error

**Диагностика:**
```bash
# Check snapshot integrity
gunzip -t backup.sql.gz

# Check PostgreSQL logs
tail -f /var/log/postgresql/postgresql.log
```

**Решение:**
```bash
# Try older snapshot
npm run cli restore --snapshot /backups/snapshot_2025-11-01

# Or restore specific tables
pg_restore --table=users backup.sql
```

---

**Версия:** 1.0.0  
**Дата обновления:** 2025-11-02  
**Конец раздела "Руководство администратора"**
