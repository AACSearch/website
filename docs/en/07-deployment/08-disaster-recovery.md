# Disaster Recovery

Comprehensive disaster recovery (DR) plan для AACSearch Platform с procedures для восстановления после различных типов сбоев.

## Содержание

- [Введение](#введение)
- [DR Strategy](#dr-strategy)
- [Backup Strategy](#backup-strategy)
- [Database Backup и Recovery](#database-backup-и-recovery)
- [Search Index Backup и Recovery](#search-index-backup-и-recovery)
- [Configuration Backup](#configuration-backup)
- [Full System Recovery](#full-system-recovery)
- [High Availability Architecture](#high-availability-architecture)
- [Multi-Region Deployment](#multi-region-deployment)
- [Failover Procedures](#failover-procedures)
- [RTO и RPO Targets](#rto-и-rpo-targets)
- [Incident Response Plan](#incident-response-plan)
- [DR Testing](#dr-testing)
- [Business Continuity](#business-continuity)

---

## Введение

Disaster Recovery обеспечивает способность восстановить систему после катастрофических событий:

- 🔥 Data center failure
- 💥 Hardware failure
- 🐛 Software bugs/corruptions
- 👤 Human errors
- 🌊 Natural disasters
- 🔒 Security breaches

### DR Principles

**1. Backup Everything**:
- Database
- Search indices
- Configuration
- Application code
- User-uploaded files

**2. Test Regularly**:
- Monthly DR drills
- Verify backup integrity
- Practice recovery procedures
- Update documentation

**3. Automate**:
- Automated backups
- Automated testing
- Automated failover (where possible)

**4. Document**:
- Step-by-step procedures
- Contact information
- Access credentials
- Recovery time estimates

---

## DR Strategy

### Recovery Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Production Environment (Primary)               │
│                     US-East-1                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   App    │  │ Database │  │  Search  │                  │
│  │  Cluster │  │ Primary  │  │ Cluster  │                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
└───────┼─────────────┼─────────────┼────────────────────────┘
        │             │             │
        │         Continuous        │
        │         Replication       │
        │             │             │
        ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backup Storage (S3)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Database   │  │    Search    │  │   Config     │      │
│  │   Snapshots  │  │   Snapshots  │  │   Backups    │      │
│  │  (Daily +    │  │   (Daily)    │  │   (Hourly)   │      │
│  │   PITR)      │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
        │             │             │
        │         On Disaster       │
        │             │             │
        ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│          Disaster Recovery Environment (Secondary)          │
│                     US-West-2                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   App    │  │ Database │  │  Search  │                  │
│  │  Cluster │  │ Standby  │  │ Cluster  │                  │
│  │ (Standby)│  │ (Standby)│  │ (Standby)│                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### DR Tiers

**Tier 1: Critical (RTO: 1 hour, RPO: 15 minutes)**:
- Database
- Authentication service
- Core API

**Tier 2: Important (RTO: 4 hours, RPO: 1 hour)**:
- Search engine
- File storage
- Background jobs

**Tier 3: Standard (RTO: 24 hours, RPO: 24 hours)**:
- Analytics
- Reporting
- Admin tools

---

## Backup Strategy

### Automated Backup Schedule

```yaml
# Backup schedule
database:
  full_backup: Daily at 02:00 UTC
  incremental: Every 6 hours
  pitr: Continuous (WAL archiving)
  retention: 30 days
  storage: S3 Glacier Deep Archive (after 90 days)

search_indices:
  snapshot: Daily at 03:00 UTC
  retention: 14 days
  storage: S3 Standard-IA

redis:
  snapshot: Daily at 04:00 UTC (RDB)
  aof: Continuous
  retention: 7 days
  storage: S3 Standard

configuration:
  backup: Hourly (Git commits)
  retention: Unlimited
  storage: GitHub

application_data:
  user_uploads: Real-time sync to S3
  retention: Unlimited
  storage: S3 Standard
```

### Backup Verification

Automated integrity checks:

```bash
#!/bin/bash
# backup-verify.sh

set -e

BACKUP_DATE=$(date +%Y%m%d)
S3_BUCKET="s3://aacsearch-backups"

# Verify database backup
echo "Verifying database backup..."
aws s3 ls "${S3_BUCKET}/database/${BACKUP_DATE}/" || {
  echo "ERROR: Database backup not found"
  exit 1
}

# Download and test database backup
aws s3 cp "${S3_BUCKET}/database/${BACKUP_DATE}/aacsearch.sql.gz" /tmp/
gunzip -t /tmp/aacsearch.sql.gz || {
  echo "ERROR: Database backup corrupted"
  exit 1
}

# Verify search backup
echo "Verifying search index backup..."
aws s3 ls "${S3_BUCKET}/typesense/${BACKUP_DATE}/" || {
  echo "ERROR: Search backup not found"
  exit 1
}

# Test restore to temporary environment
echo "Testing restore to staging..."
./restore-to-staging.sh "${BACKUP_DATE}"

echo "Backup verification complete!"
```

---

## Database Backup и Recovery

### PostgreSQL Continuous Backup

**1. WAL Archiving Configuration**:

```sql
-- postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'aws s3 cp %p s3://aacsearch-backups/wal/%f'
archive_timeout = 300  -- 5 minutes
```

**2. Full Backup Script**:

```bash
#!/bin/bash
# backup-database.sh

set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
S3_BUCKET="s3://aacsearch-backups/database"

echo "Starting database backup: ${DATE}"

# Create backup directory
mkdir -p "${BACKUP_DIR}/${DATE}"

# Base backup with pg_basebackup
pg_basebackup \
  -h postgres-primary.internal \
  -U replicator \
  -D "${BACKUP_DIR}/${DATE}" \
  -Ft \
  -z \
  -P \
  -X stream \
  -l "backup_${DATE}"

# Upload to S3
aws s3 sync "${BACKUP_DIR}/${DATE}" "${S3_BUCKET}/${DATE}/" \
  --storage-class STANDARD_IA

# Create restore script
cat > "${BACKUP_DIR}/${DATE}/restore.sh" <<EOF
#!/bin/bash
# Restore script for backup ${DATE}

set -e

BACKUP_PATH="${S3_BUCKET}/${DATE}"

# Download backup
aws s3 sync "\${BACKUP_PATH}" /tmp/restore/

# Extract backup
cd /var/lib/postgresql/data
tar -xzf /tmp/restore/base.tar.gz

# Create recovery.conf
cat > recovery.conf <<EOC
restore_command = 'aws s3 cp s3://aacsearch-backups/wal/%f %p'
recovery_target_time = '$(date -u +"%Y-%m-%d %H:%M:%S %Z")'
EOC

# Start PostgreSQL
pg_ctl start
EOF

chmod +x "${BACKUP_DIR}/${DATE}/restore.sh"

# Cleanup old backups (keep 30 days)
find "${BACKUP_DIR}" -type d -mtime +30 -exec rm -rf {} \;

# Verify backup
echo "Verifying backup..."
aws s3 ls "${S3_BUCKET}/${DATE}/" || {
  echo "ERROR: Backup verification failed"
  exit 1
}

echo "Backup completed: ${DATE}"

# Send notification
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-Type: application/json' \
  -d "{\"text\": \"Database backup completed: ${DATE}\"}"
```

**3. Point-in-Time Recovery (PITR)**:

```bash
#!/bin/bash
# restore-pitr.sh

set -e

TARGET_TIME=$1  # e.g., "2025-01-15 14:30:00"

if [ -z "$TARGET_TIME" ]; then
  echo "Usage: $0 'YYYY-MM-DD HH:MM:SS'"
  exit 1
fi

echo "Starting Point-in-Time Recovery to: ${TARGET_TIME}"

# Stop PostgreSQL
systemctl stop postgresql

# Backup current data
mv /var/lib/postgresql/data /var/lib/postgresql/data.old

# Get latest base backup
LATEST_BACKUP=$(aws s3 ls s3://aacsearch-backups/database/ | sort | tail -n1 | awk '{print $2}')
echo "Using base backup: ${LATEST_BACKUP}"

# Download and extract
aws s3 sync "s3://aacsearch-backups/database/${LATEST_BACKUP}" /tmp/restore/
mkdir -p /var/lib/postgresql/data
cd /var/lib/postgresql/data
tar -xzf /tmp/restore/base.tar.gz

# Create recovery.signal file (PostgreSQL 12+)
touch recovery.signal

# Configure recovery
cat > postgresql.auto.conf <<EOF
restore_command = 'aws s3 cp s3://aacsearch-backups/wal/%f %p'
recovery_target_time = '${TARGET_TIME}'
recovery_target_action = 'promote'
EOF

# Start PostgreSQL (will recover to target time)
systemctl start postgresql

# Wait for recovery
echo "Waiting for recovery to complete..."
until pg_isready -h localhost; do
  sleep 2
done

echo "Recovery completed! Database restored to ${TARGET_TIME}"
```

### Database Recovery Testing

Monthly automated testing:

```bash
#!/bin/bash
# test-database-recovery.sh

set -e

echo "Starting DR test for database..."

# 1. Create test environment
kubectl create namespace dr-test

# 2. Restore latest backup to test namespace
LATEST_BACKUP=$(aws s3 ls s3://aacsearch-backups/database/ | sort | tail -n1 | awk '{print $2}')

# 3. Deploy PostgreSQL in test namespace
helm install postgres-test bitnami/postgresql \
  --namespace dr-test \
  --set auth.postgresPassword=test \
  --wait

# 4. Restore backup
kubectl exec -n dr-test postgres-test-0 -- bash -c "
  aws s3 cp s3://aacsearch-backups/database/${LATEST_BACKUP}/base.tar.gz /tmp/
  cd /var/lib/postgresql/data
  tar -xzf /tmp/base.tar.gz
"

# 5. Verify data
kubectl exec -n dr-test postgres-test-0 -- psql -U postgres -c "
  SELECT COUNT(*) FROM tenants;
  SELECT COUNT(*) FROM collections;
  SELECT COUNT(*) FROM documents;
"

# 6. Run integrity checks
kubectl exec -n dr-test postgres-test-0 -- psql -U postgres -c "
  SELECT table_name, pg_size_pretty(pg_total_relation_size(quote_ident(table_name)))
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;
"

# 7. Cleanup
kubectl delete namespace dr-test

echo "DR test completed successfully!"

# Send report
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-Type: application/json' \
  -d "{
    \"text\": \"Database DR test completed\",
    \"attachments\": [{
      \"color\": \"good\",
      \"fields\": [
        {\"title\": \"Backup Date\", \"value\": \"${LATEST_BACKUP}\", \"short\": true},
        {\"title\": \"Status\", \"value\": \"Success\", \"short\": true}
      ]
    }]
  }"
```

---

## Search Index Backup и Recovery

### Typesense Snapshot

**1. Create Snapshot**:

```bash
#!/bin/bash
# backup-typesense.sh

set -e

DATE=$(date +%Y%m%d_%H%M%S)
SNAPSHOT_DIR="/backups/typesense/${DATE}"
S3_BUCKET="s3://aacsearch-backups/typesense"

echo "Creating Typesense snapshot: ${DATE}"

# Create snapshot via Typesense API
curl -X POST \
  "http://typesense:8108/operations/snapshot?snapshot_path=${SNAPSHOT_DIR}" \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}"

# Wait for snapshot to complete
sleep 10

# Upload to S3
aws s3 sync "${SNAPSHOT_DIR}" "${S3_BUCKET}/${DATE}/" \
  --storage-class STANDARD_IA

# Verify
aws s3 ls "${S3_BUCKET}/${DATE}/" || {
  echo "ERROR: Snapshot upload failed"
  exit 1
}

echo "Snapshot completed: ${DATE}"

# Cleanup old snapshots (keep 14 days)
find /backups/typesense -type d -mtime +14 -exec rm -rf {} \;
```

**2. Restore Snapshot**:

```bash
#!/bin/bash
# restore-typesense.sh

set -e

SNAPSHOT_DATE=$1

if [ -z "$SNAPSHOT_DATE" ]; then
  echo "Usage: $0 YYYYMMDD_HHMMSS"
  exit 1
fi

echo "Restoring Typesense from snapshot: ${SNAPSHOT_DATE}"

# Download snapshot from S3
RESTORE_DIR="/tmp/typesense-restore/${SNAPSHOT_DATE}"
aws s3 sync "s3://aacsearch-backups/typesense/${SNAPSHOT_DATE}/" "${RESTORE_DIR}/"

# Stop Typesense
kubectl scale statefulset typesense -n aacsearch-production --replicas=0

# Copy snapshot to data directory
for i in 0 1 2 3 4; do
  kubectl exec -n aacsearch-production typesense-${i} -- rm -rf /data/*
  kubectl cp "${RESTORE_DIR}/" aacsearch-production/typesense-${i}:/data/
done

# Start Typesense
kubectl scale statefulset typesense -n aacsearch-production --replicas=5

# Wait for cluster to be healthy
echo "Waiting for Typesense cluster..."
until curl -f http://typesense:8108/health; do
  sleep 5
done

echo "Restore completed!"
```

### Reindexing from Database

Если snapshots недоступны, reindex from database:

```typescript
// src/scripts/reindex-all.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { typesense } from '@/lib/typesense'

async function reindexAll() {
  const payload = await getPayload({ config })

  console.log('Starting full reindex...')

  // Get all tenants
  const tenants = await payload.find({
    collection: 'tenants',
    limit: 10000,
  })

  for (const tenant of tenants.docs) {
    console.log(`Reindexing tenant: ${tenant.id}`)

    // Get all collections for tenant
    const collections = await payload.find({
      collection: 'collections',
      where: {
        tenant_id: { equals: tenant.id },
      },
      limit: 1000,
    })

    for (const collection of collections.docs) {
      console.log(`  Reindexing collection: ${collection.name}`)

      // Get all documents
      const documents = await payload.find({
        collection: 'documents',
        where: {
          tenant_id: { equals: tenant.id },
          collection_id: { equals: collection.id },
        },
        limit: 100000,
      })

      // Create or update collection in Typesense
      const collectionName = `tenant_${tenant.id}_collection_${collection.id}`

      try {
        await typesense.collections(collectionName).retrieve()
        // Collection exists, delete it
        await typesense.collections(collectionName).delete()
      } catch (error) {
        // Collection doesn't exist
      }

      // Create collection
      await typesense.collections().create({
        name: collectionName,
        fields: [
          { name: 'id', type: 'string' },
          { name: 'title', type: 'string' },
          { name: 'content', type: 'string' },
          { name: 'created_at', type: 'int64', sort: true },
        ],
      })

      // Import documents
      await typesense
        .collections(collectionName)
        .documents()
        .import(documents.docs, { action: 'create' })

      console.log(`  Indexed ${documents.docs.length} documents`)
    }
  }

  console.log('Reindex completed!')
}

reindexAll().catch(console.error)
```

```bash
# Run reindex
kubectl exec -n aacsearch-production aacsearch-app-0 -- \
  node dist/scripts/reindex-all.js
```

---

## Configuration Backup

### GitOps Approach

Все конфигурации в Git:

```bash
# Configuration repository structure
aacsearch-config/
├── kubernetes/
│   ├── base/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── configmap.yaml
│   ├── overlays/
│   │   ├── production/
│   │   └── staging/
├── terraform/
│   ├── aws/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── gcp/
├── helm/
│   ├── values-production.yaml
│   └── values-staging.yaml
└── secrets/
    ├── sealed-secrets-production.yaml
    └── sealed-secrets-staging.yaml
```

### Automated Configuration Backup

```bash
#!/bin/bash
# backup-config.sh

set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/config/${DATE}"
S3_BUCKET="s3://aacsearch-backups/config"

mkdir -p "${BACKUP_DIR}"

# Export Kubernetes resources
kubectl get all -n aacsearch-production -o yaml > "${BACKUP_DIR}/k8s-resources.yaml"
kubectl get configmap -n aacsearch-production -o yaml > "${BACKUP_DIR}/configmaps.yaml"
kubectl get secret -n aacsearch-production -o yaml > "${BACKUP_DIR}/secrets.yaml"

# Backup environment variables
kubectl exec -n aacsearch-production aacsearch-app-0 -- env > "${BACKUP_DIR}/env.txt"

# Upload to S3
aws s3 sync "${BACKUP_DIR}" "${S3_BUCKET}/${DATE}/"

# Also commit to Git
cd /path/to/aacsearch-config
git add .
git commit -m "Config backup: ${DATE}"
git push

echo "Configuration backup completed"
```

---

## Full System Recovery

### Complete Recovery Procedure

**1. Prerequisites**:

```bash
# Ensure you have:
# - AWS/GCP credentials
# - kubectl configured
# - Helm installed
# - Backup S3 bucket access
# - DNS access

# Set variables
BACKUP_DATE="20250115_020000"
NAMESPACE="aacsearch-production"
```

**2. Restore Infrastructure**:

```bash
# Apply Terraform configuration
cd terraform/aws
terraform init
terraform plan
terraform apply -auto-approve

# Wait for infrastructure
sleep 60
```

**3. Restore Kubernetes Resources**:

```bash
# Create namespace
kubectl create namespace ${NAMESPACE}

# Apply base resources
kubectl apply -k kubernetes/overlays/production/

# Wait for pods
kubectl wait --for=condition=ready pod -l app=aacsearch -n ${NAMESPACE} --timeout=300s
```

**4. Restore Database**:

```bash
# Download backup
aws s3 sync "s3://aacsearch-backups/database/${BACKUP_DATE}/" /tmp/db-restore/

# Restore to PostgreSQL
kubectl exec -n ${NAMESPACE} postgres-0 -- bash -c "
  cd /var/lib/postgresql/data
  tar -xzf /tmp/db-restore/base.tar.gz
  cat > recovery.signal
  cat > postgresql.auto.conf <<EOF
restore_command = 'aws s3 cp s3://aacsearch-backups/wal/%f %p'
recovery_target_time = '$(date -u +"%Y-%m-%d %H:%M:%S")'
EOF
"

# Restart PostgreSQL
kubectl rollout restart statefulset postgres -n ${NAMESPACE}

# Wait for database
until kubectl exec -n ${NAMESPACE} postgres-0 -- pg_isready; do
  sleep 5
done
```

**5. Restore Search Indices**:

```bash
# Download snapshot
aws s3 sync "s3://aacsearch-backups/typesense/${BACKUP_DATE}/" /tmp/search-restore/

# Copy to Typesense pods
for i in 0 1 2 3 4; do
  kubectl cp /tmp/search-restore/ ${NAMESPACE}/typesense-${i}:/data/
done

# Restart Typesense
kubectl rollout restart statefulset typesense -n ${NAMESPACE}
```

**6. Restore Application**:

```bash
# Deploy application
kubectl apply -f kubernetes/overlays/production/deployment.yaml

# Wait for rollout
kubectl rollout status deployment aacsearch-app -n ${NAMESPACE}
```

**7. Update DNS**:

```bash
# Get LoadBalancer IP
LB_IP=$(kubectl get service aacsearch-app -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

# Update DNS (example with Route53)
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch "{
    \"Changes\": [{
      \"Action\": \"UPSERT\",
      \"ResourceRecordSet\": {
        \"Name\": \"aacsearch.com\",
        \"Type\": \"A\",
        \"TTL\": 300,
        \"ResourceRecords\": [{\"Value\": \"${LB_IP}\"}]
      }
    }]
  }"
```

**8. Verify**:

```bash
# Health check
curl https://aacsearch.com/health/live

# Test API
curl https://aacsearch.com/api/health

# Check logs
kubectl logs -n ${NAMESPACE} -l app=aacsearch --tail=100

# Run smoke tests
npm run test:smoke
```

### Estimated Recovery Times

```
Step 1: Infrastructure (Terraform)     : 15-20 minutes
Step 2: Kubernetes Resources           : 5-10 minutes
Step 3: Database Restore               : 30-60 minutes
Step 4: Search Index Restore           : 15-30 minutes
Step 5: Application Deployment         : 5-10 minutes
Step 6: DNS Propagation                : 5-15 minutes
Step 7: Verification                   : 10-15 minutes

Total RTO: 1.5-2.5 hours
```

---

## High Availability Architecture

### Multi-AZ Deployment

```
┌────────────────────────────────────────────────────────────┐
│                    AWS Region: US-East-1                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐ │
│  │  AZ-1 (us-east-1a)  │  AZ-2 (us-east-1b)  │  AZ-3    │ │
│  │                  │  │                  │  │ (us-east-1c)│
│  │  ┌────────┐      │  │  ┌────────┐      │  │ ┌────────┐│
│  │  │ App    │      │  │  │ App    │      │  │ │ App    ││
│  │  │ Pods   │      │  │  │ Pods   │      │  │ │ Pods   ││
│  │  │ (4)    │      │  │  │ (4)    │      │  │ │ (4)    ││
│  │  └────────┘      │  │  └────────┘      │  │ └────────┘│
│  │                  │  │                  │  │            │
│  │  ┌────────┐      │  │  ┌────────┐      │  │ ┌────────┐│
│  │  │Database│      │  │  │Database│      │  │ │Database││
│  │  │Primary │──────┼──┼─▶│Replica │      │  │ │Replica ││
│  │  └────────┘      │  │  └────────┘      │  │ └────────┘│
│  └──────────────────┘  └──────────────────┘  └──────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Pod Anti-Affinity

```yaml
spec:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchExpressions:
              - key: app
                operator: In
                values:
                  - aacsearch
          topologyKey: topology.kubernetes.io/zone
```

---

## Multi-Region Deployment

### Active-Passive Configuration

```
┌─────────────────────────────────────────────────────────────┐
│              Route53 Health Check + Failover                │
│                    aacsearch.com                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┴───────────────┐
       │                               │
       │ Primary                       │ Secondary (Standby)
       │ (Active)                      │ (Passive)
       ▼                               ▼
┌──────────────────┐           ┌──────────────────┐
│  US-East-1       │           │  US-West-2       │
│  Full Cluster    │──Sync────▶│  Minimal Cluster │
│  12 App Pods     │           │  2 App Pods      │
│  DB Primary      │           │  DB Standby      │
│  Search Cluster  │           │  Search Standby  │
└──────────────────┘           └──────────────────┘
```

### Route53 Failover

```json
{
  "HostedZoneId": "Z1234567890ABC",
  "ChangeBatch": {
    "Changes": [
      {
        "Action": "UPSERT",
        "ResourceRecordSet": {
          "Name": "aacsearch.com",
          "Type": "A",
          "SetIdentifier": "Primary",
          "Failover": "PRIMARY",
          "AliasTarget": {
            "HostedZoneId": "Z1111111111111",
            "DNSName": "primary-lb.us-east-1.elb.amazonaws.com",
            "EvaluateTargetHealth": true
          },
          "HealthCheckId": "health-check-primary"
        }
      },
      {
        "Action": "UPSERT",
        "ResourceRecordSet": {
          "Name": "aacsearch.com",
          "Type": "A",
          "SetIdentifier": "Secondary",
          "Failover": "SECONDARY",
          "AliasTarget": {
            "HostedZoneId": "Z2222222222222",
            "DNSName": "secondary-lb.us-west-2.elb.amazonaws.com",
            "EvaluateTargetHealth": true
          }
        }
      }
    ]
  }
}
```

---

## Failover Procedures

### Automated Failover

```bash
#!/bin/bash
# auto-failover.sh

set -e

PRIMARY_REGION="us-east-1"
SECONDARY_REGION="us-west-2"
HEALTH_CHECK_URL="https://aacsearch.com/health/live"

echo "Checking primary region health..."

# Health check
if ! curl -f -m 10 "${HEALTH_CHECK_URL}"; then
  echo "PRIMARY REGION UNHEALTHY - Initiating failover!"

  # 1. Promote secondary database to primary
  aws rds promote-read-replica \
    --db-instance-identifier aacsearch-secondary \
    --region ${SECONDARY_REGION}

  # 2. Scale up secondary app cluster
  kubectl config use-context arn:aws:eks:${SECONDARY_REGION}:account:cluster/aacsearch
  kubectl scale deployment aacsearch-app -n aacsearch-production --replicas=12

  # 3. Update Route53 to failover
  aws route53 change-resource-record-sets \
    --hosted-zone-id Z1234567890ABC \
    --change-batch file://failover-dns.json

  # 4. Notify team
  curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
    -H 'Content-Type: application/json' \
    -d '{
      "text": "EMERGENCY: Failover to secondary region initiated",
      "attachments": [{
        "color": "danger",
        "fields": [
          {"title": "From", "value": "'"${PRIMARY_REGION}"'", "short": true},
          {"title": "To", "value": "'"${SECONDARY_REGION}"'", "short": true}
        ]
      }]
    }'

  # 5. Page on-call
  curl -X POST https://events.pagerduty.com/v2/enqueue \
    -H 'Content-Type: application/json' \
    -d '{
      "routing_key": "YOUR_INTEGRATION_KEY",
      "event_action": "trigger",
      "payload": {
        "summary": "Automatic failover to secondary region",
        "severity": "critical",
        "source": "auto-failover.sh"
      }
    }'

  echo "Failover completed!"
else
  echo "Primary region healthy"
fi
```

---

## RTO и RPO Targets

### Recovery Time Objective (RTO)

Maximum tolerable downtime:

```
Disaster Type                  RTO Target    Actual RTO
─────────────────────────────────────────────────────────
Single Pod Failure             < 1 minute    30 seconds
Node Failure                   < 5 minutes   2 minutes
AZ Failure                     < 15 minutes  10 minutes
Region Failure                 < 1 hour      45 minutes
Complete Data Loss             < 4 hours     2-3 hours
```

### Recovery Point Objective (RPO)

Maximum tolerable data loss:

```
Data Type                      RPO Target    Actual RPO
─────────────────────────────────────────────────────────
Database                       15 minutes    5 minutes (PITR)
Search Indices                 1 hour        Daily snapshots
Configuration                  5 minutes     Git commits
User Uploads                   0 (real-time) S3 sync
Logs                           1 hour        Streaming to Loki
```

---

## Incident Response Plan

### Severity Levels

**P1 - Critical**:
- Complete service outage
- Data breach
- Response: Immediate (< 15 minutes)
- Escalation: Automatic page to on-call

**P2 - High**:
- Partial service degradation
- Performance issues affecting > 50% users
- Response: < 1 hour
- Escalation: Slack notification

**P3 - Medium**:
- Minor service degradation
- Single component failure
- Response: < 4 hours
- Escalation: Email notification

**P4 - Low**:
- Cosmetic issues
- Non-critical bugs
- Response: Next business day

### Incident Response Steps

**1. Detect** (Automated monitoring):
```yaml
- Alert triggers in Prometheus
- AlertManager routes to PagerDuty
- On-call engineer paged
```

**2. Acknowledge** (< 5 minutes):
```bash
# Acknowledge in PagerDuty
- Review alert details
- Check dashboards
- Initial assessment
```

**3. Investigate** (< 15 minutes):
```bash
# Gather information
kubectl get pods -n aacsearch-production
kubectl logs -n aacsearch-production -l app=aacsearch --tail=500
kubectl describe pod <pod-name> -n aacsearch-production

# Check metrics
- Grafana dashboards
- Application logs in Loki
- Traces in Jaeger
```

**4. Mitigate** (< 30 minutes):
```bash
# Quick fixes
- Scale up pods if resource constrained
- Restart failing pods
- Rollback recent deployment
- Enable backup systems
```

**5. Resolve** (< 2 hours):
```bash
# Permanent fix
- Deploy fix
- Verify resolution
- Monitor for stability
```

**6. Post-mortem** (Within 24 hours):
```markdown
# Incident Post-mortem Template

## Incident Summary
- Date/Time:
- Duration:
- Severity:
- Impact:

## Timeline
- HH:MM - Event 1
- HH:MM - Event 2

## Root Cause
[Detailed analysis]

## Resolution
[How it was fixed]

## Action Items
- [ ] Action 1 (Owner: @person, Due: date)
- [ ] Action 2 (Owner: @person, Due: date)

## Lessons Learned
[What we learned]
```

---

## DR Testing

### Monthly DR Drill

```bash
#!/bin/bash
# dr-drill.sh

set -e

echo "=== DR DRILL STARTED ==="
echo "Date: $(date)"

# 1. Simulate failure
echo "Step 1: Simulating primary region failure..."
kubectl drain node-1 node-2 node-3 -n aacsearch-production --ignore-daemonsets

# 2. Trigger failover
echo "Step 2: Triggering automated failover..."
./auto-failover.sh

# 3. Verify secondary region
echo "Step 3: Verifying secondary region..."
sleep 60
curl -f https://aacsearch.com/health/live || {
  echo "ERROR: Health check failed"
  exit 1
}

# 4. Run smoke tests
echo "Step 4: Running smoke tests..."
npm run test:smoke

# 5. Restore primary region
echo "Step 5: Restoring primary region..."
kubectl uncordon node-1 node-2 node-3 -n aacsearch-production

# 6. Failback
echo "Step 6: Failing back to primary..."
./failback.sh

# 7. Generate report
echo "Step 7: Generating report..."
cat > dr-drill-report-$(date +%Y%m%d).md <<EOF
# DR Drill Report

Date: $(date)
Duration: XX minutes

## Results
- [x] Automated failover: Success
- [x] Secondary region operational: Success
- [x] Smoke tests: Passed
- [x] Failback: Success

## Observations
- Failover completed in XX minutes (target: 60 minutes)
- No data loss detected
- All services operational

## Action Items
- [ ] Update runbook with new findings
- [ ] Optimize failover script

Next drill: $(date -d "+1 month" +%Y-%m-%d)
EOF

echo "=== DR DRILL COMPLETED ==="
```

---

## Business Continuity

### Business Impact Analysis

```
Critical Functions              Max Downtime    Dependencies
──────────────────────────────────────────────────────────────
User Authentication             1 hour          Database, Cache
API Access                      1 hour          Database, Search
Search Functionality            4 hours         Search Engine
Admin Panel                     24 hours        Database
Analytics Dashboard             24 hours        Database
Billing                         4 hours         Database, Stripe
```

### Communication Plan

**Internal**:
- Slack #incidents channel
- Email distribution list
- Status page updates

**External**:
- Status page (status.aacsearch.com)
- Email notifications to affected users
- Twitter updates

**Template**:
```
Subject: Service Disruption - AACSearch Platform

We are currently experiencing a service disruption affecting [SERVICES].

Status: [INVESTIGATING/IDENTIFIED/MONITORING/RESOLVED]
Impact: [DESCRIPTION]
ETA: [TIME]

We will provide updates every 30 minutes.

Updates: https://status.aacsearch.com/incidents/123
```

---

**Recovery Complete**: Ваша система теперь защищена от disasters с comprehensive backup и recovery procedures!
