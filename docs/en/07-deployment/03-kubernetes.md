# Kubernetes Deployment

Полное руководство по enterprise развертыванию AACSearch Platform на Kubernetes.

## Содержание

- [Введение](#введение)
- [Архитектура Kubernetes](#архитектура-kubernetes)
- [Prerequisites](#prerequisites)
- [Namespace Organization](#namespace-organization)
- [ConfigMap](#configmap)
- [Secrets](#secrets)
- [Deployment - Application](#deployment---application)
- [StatefulSet - PostgreSQL](#statefulset---postgresql)
- [StatefulSet - Typesense](#statefulset---typesense)
- [StatefulSet - Redis](#statefulset---redis)
- [Services](#services)
- [Ingress](#ingress)
- [PersistentVolumes](#persistentvolumes)
- [HorizontalPodAutoscaler](#horizontalpodautoscaler)
- [VerticalPodAutoscaler](#verticalpodautoscaler)
- [PodDisruptionBudget](#poddisruptionbudget)
- [NetworkPolicy](#networkpolicy)
- [ServiceAccount и RBAC](#serviceaccount-и-rbac)
- [Helm Charts](#helm-charts)
- [Operators](#operators)
- [GitOps с ArgoCD](#gitops-с-argocd)
- [Monitoring Integration](#monitoring-integration)
- [Troubleshooting](#troubleshooting)

---

## Введение

Kubernetes deployment предоставляет:
- ✅ High Availability из коробки
- ✅ Автоматическое масштабирование (HPA, VPA)
- ✅ Self-healing и автоматический restart failed pods
- ✅ Rolling updates без downtime
- ✅ Service discovery и load balancing
- ✅ Declarative configuration (Infrastructure as Code)
- ✅ Multi-cloud portability

### Преимущества для AACSearch

- **Multi-tenancy**: Изоляция через namespaces
- **Scalability**: Auto-scaling для обработки пиковых нагрузок
- **Reliability**: Automatic failover и restart
- **Security**: Network policies, RBAC, secrets management
- **Observability**: Встроенная интеграция с Prometheus, Grafana

---

## Архитектура Kubernetes

### Cluster Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                      Kubernetes Cluster                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │               Ingress Controller (NGINX)                  │  │
│  │              External LoadBalancer (443)                  │  │
│  └──────────────────────────┬────────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │         Namespace: aacsearch-production                   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │        Deployment: aacsearch-app                    │  │  │
│  │  │        Replicas: 4 (auto-scaling 4-12)              │  │  │
│  │  │        ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │  │  │
│  │  │        │Pod 1│ │Pod 2│ │Pod 3│ │Pod 4│              │  │  │
│  │  │        └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘              │  │  │
│  │  └───────────┼──────┼──────┼──────┼───────────────────┘  │  │
│  │              │      │      │      │                       │  │
│  │              └──────┴──────┴──────┘                       │  │
│  │                      │                                    │  │
│  │  ┌───────────────────┼────────────────────┬──────────┐   │  │
│  │  │                   │                    │          │   │  │
│  │  │  ┌────────────────▼───────┐  ┌─────────▼──────┐  │   │  │
│  │  │  │ StatefulSet: postgres  │  │ StatefulSet:   │  │   │  │
│  │  │  │ Replicas: 3            │  │ redis-cluster  │  │   │  │
│  │  │  │ ┌────┐ ┌────┐ ┌────┐   │  │ Replicas: 6    │  │   │  │
│  │  │  │ │Prim││Rep1││Rep2│   │  │ (3M + 3R)      │  │   │  │
│  │  │  │ └────┘ └────┘ └────┘   │  └────────────────┘  │   │  │
│  │  │  │  PVC: 500GB each       │   PVC: 50GB each    │   │  │
│  │  │  └────────────────────────┘                      │   │  │
│  │  │                                                   │   │  │
│  │  │  ┌────────────────────────────────────────────┐  │   │  │
│  │  │  │ StatefulSet: typesense-cluster            │  │   │  │
│  │  │  │ Replicas: 5                               │  │   │  │
│  │  │  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐        │  │   │  │
│  │  │  │ │N1  │ │N2  │ │N3  │ │N4  │ │N5  │        │  │   │  │
│  │  │  │ └────┘ └────┘ └────┘ └────┘ └────┘        │  │   │  │
│  │  │  │  PVC: 100GB each                           │  │   │  │
│  │  │  └────────────────────────────────────────────┘  │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │          Namespace: monitoring                            │  │
│  │  ┌──────────┐  ┌─────────┐  ┌──────┐  ┌────────────┐     │  │
│  │  │Prometheus│  │ Grafana │  │ Loki │  │AlertManager│     │  │
│  │  └──────────┘  └─────────┘  └──────┘  └────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Node Pools

Для оптимальной производительности рекомендуется 3 node pools:

**1. Application Pool** (общее назначение):
- Node count: 3-6 (auto-scaling)
- Instance type: `n2-standard-8` (GCP) или `c6i.2xlarge` (AWS)
- CPU: 8 cores
- RAM: 32 GB
- Workloads: Application pods

**2. Database Pool** (memory-optimized):
- Node count: 3 (fixed)
- Instance type: `n2-highmem-8` (GCP) или `r6i.2xlarge` (AWS)
- CPU: 8 cores
- RAM: 64 GB
- Workloads: PostgreSQL, Redis

**3. Search Pool** (CPU-optimized):
- Node count: 3-5 (auto-scaling)
- Instance type: `c2-standard-8` (GCP) или `c6i.2xlarge` (AWS)
- CPU: 8 cores
- RAM: 32 GB
- Workloads: Typesense

---

## Prerequisites

### Требования к Cluster

- **Kubernetes Version**: 1.28+ (recommended 1.29+)
- **CNI Plugin**: Calico или Cilium (для Network Policies)
- **Storage Class**: SSD-based (gp3 на AWS, pd-ssd на GCP)
- **Ingress Controller**: nginx-ingress
- **Cert Manager**: для автоматических SSL certificates
- **Metrics Server**: для HPA

### Установка kubectl

```bash
# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# macOS
brew install kubectl

# Verify
kubectl version --client
```

### Установка Helm

```bash
# Linux/macOS
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify
helm version
```

### Подключение к Cluster

**AWS EKS**:
```bash
aws eks update-kubeconfig --region us-east-1 --name aacsearch-cluster
```

**GCP GKE**:
```bash
gcloud container clusters get-credentials aacsearch-cluster --region us-central1
```

**Azure AKS**:
```bash
az aks get-credentials --resource-group aacsearch-rg --name aacsearch-cluster
```

**Verify connection**:
```bash
kubectl cluster-info
kubectl get nodes
```

---

## Namespace Organization

### Создание Namespaces

```yaml
# namespaces.yaml
---
apiVersion: v1
kind: Namespace
metadata:
  name: aacsearch-production
  labels:
    name: aacsearch-production
    environment: production
    managed-by: argocd

---
apiVersion: v1
kind: Namespace
metadata:
  name: aacsearch-staging
  labels:
    name: aacsearch-staging
    environment: staging
    managed-by: argocd

---
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
  labels:
    name: monitoring
    managed-by: helm
```

```bash
kubectl apply -f namespaces.yaml
```

### Resource Quotas

Ограничение ресурсов per namespace:

```yaml
# resource-quota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: aacsearch-production-quota
  namespace: aacsearch-production
spec:
  hard:
    # Compute resources
    requests.cpu: "50"
    requests.memory: 100Gi
    limits.cpu: "100"
    limits.memory: 200Gi

    # Storage
    requests.storage: 2Ti
    persistentvolumeclaims: "20"

    # Objects
    pods: "100"
    services: "20"
    configmaps: "30"
    secrets: "30"

    # Load Balancers
    services.loadbalancers: "3"
```

```bash
kubectl apply -f resource-quota.yaml
```

### LimitRange

Default resource limits для pods:

```yaml
# limit-range.yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: aacsearch-limits
  namespace: aacsearch-production
spec:
  limits:
    # Container limits
    - type: Container
      default:
        cpu: 1
        memory: 1Gi
      defaultRequest:
        cpu: 100m
        memory: 128Mi
      max:
        cpu: 4
        memory: 8Gi
      min:
        cpu: 50m
        memory: 64Mi

    # Pod limits
    - type: Pod
      max:
        cpu: 8
        memory: 16Gi
      min:
        cpu: 100m
        memory: 128Mi

    # PVC limits
    - type: PersistentVolumeClaim
      max:
        storage: 1Ti
      min:
        storage: 1Gi
```

```bash
kubectl apply -f limit-range.yaml
```

---

## ConfigMap

Конфигурация приложения (non-sensitive data):

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: aacsearch-config
  namespace: aacsearch-production
  labels:
    app: aacsearch
    environment: production
data:
  # Server configuration
  NODE_ENV: "production"
  PORT: "3000"
  HOSTNAME: "0.0.0.0"

  # Next.js configuration
  NEXT_TELEMETRY_DISABLED: "1"
  NEXT_PUBLIC_SERVER_URL: "https://aacsearch.com"

  # Database configuration
  POSTGRES_DB: "aacsearch"
  POSTGRES_USER: "aacsearch"
  DATABASE_POOL_MIN: "2"
  DATABASE_POOL_MAX: "50"
  DATABASE_IDLE_TIMEOUT: "30000"
  DATABASE_CONNECTION_TIMEOUT: "10000"

  # Redis configuration
  REDIS_HOST: "redis-cluster"
  REDIS_PORT: "6379"
  REDIS_DB: "0"
  REDIS_KEY_PREFIX: "aacsearch:"
  REDIS_MAX_RETRIES: "3"
  REDIS_RETRY_DELAY: "1000"

  # Typesense configuration
  TYPESENSE_HOST: "typesense"
  TYPESENSE_PORT: "8108"
  TYPESENSE_PROTOCOL: "http"
  TYPESENSE_CONNECTION_TIMEOUT: "5000"
  TYPESENSE_NUM_RETRIES: "3"

  # Cache configuration
  CACHE_TTL_DEFAULT: "3600"
  CACHE_TTL_SEARCH: "300"
  CACHE_TTL_USER: "86400"

  # Rate limiting
  RATE_LIMIT_WINDOW: "60000"
  RATE_LIMIT_MAX_REQUESTS: "100"

  # Logging
  LOG_LEVEL: "info"
  LOG_FORMAT: "json"

  # Features
  ENABLE_ANALYTICS: "true"
  ENABLE_AI_EMBEDDINGS: "true"
  ENABLE_WEBHOOKS: "true"

  # Stripe configuration (public keys only)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_live_..."

  # CORS
  CORS_ORIGINS: "https://aacsearch.com,https://www.aacsearch.com,https://app.aacsearch.com"
```

```bash
kubectl apply -f configmap.yaml
```

### ConfigMap для Application Config Files

```yaml
# configmap-app-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: aacsearch-app-config
  namespace: aacsearch-production
data:
  next.config.js: |
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      reactStrictMode: true,
      swcMinify: true,
      output: 'standalone',
      compress: true,
      poweredByHeader: false,
      images: {
        domains: ['aacsearch.com', 'cdn.aacsearch.com'],
        formats: ['image/avif', 'image/webp'],
      },
      experimental: {
        serverActions: true,
      },
    }
    module.exports = nextConfig

  payload.config.ts: |
    import { buildConfig } from 'payload/config'
    import { postgresAdapter } from '@payloadcms/db-postgres'
    import { lexicalEditor } from '@payloadcms/richtext-lexical'

    export default buildConfig({
      serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
      secret: process.env.PAYLOAD_SECRET!,
      db: postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URI,
        },
      }),
      editor: lexicalEditor({}),
      collections: [],
      globals: [],
      typescript: {
        outputFile: 'payload-types.ts',
      },
      telemetry: false,
    })
```

---

## Secrets

Sensitive data (passwords, API keys):

```yaml
# secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: aacsearch-secrets
  namespace: aacsearch-production
  labels:
    app: aacsearch
    environment: production
type: Opaque
stringData:
  # Database credentials
  POSTGRES_PASSWORD: "CHANGE_ME_STRONG_PASSWORD"
  DATABASE_URI: "postgresql://aacsearch:CHANGE_ME_STRONG_PASSWORD@postgres:5432/aacsearch"

  # Payload CMS
  PAYLOAD_SECRET: "CHANGE_ME_32_CHAR_SECRET_KEY_HERE"

  # Redis password
  REDIS_PASSWORD: "CHANGE_ME_REDIS_PASSWORD"

  # Typesense API key
  TYPESENSE_API_KEY: "CHANGE_ME_TYPESENSE_API_KEY"

  # Stripe keys (secret)
  STRIPE_SECRET_KEY: "sk_live_..."
  STRIPE_WEBHOOK_SECRET: "whsec_..."

  # AI API keys
  OPENAI_API_KEY: "sk-..."
  HUGGINGFACE_API_KEY: "hf_..."

  # JWT secret
  JWT_SECRET: "CHANGE_ME_JWT_SECRET_KEY"

  # Session secret
  SESSION_SECRET: "CHANGE_ME_SESSION_SECRET"

  # Encryption key для sensitive data
  ENCRYPTION_KEY: "CHANGE_ME_32_BYTE_ENCRYPTION_KEY"
```

**ВАЖНО**: Не храните secrets в Git! Используйте:

### Создание secrets из командной строки

```bash
# Из literals
kubectl create secret generic aacsearch-secrets \
  --namespace=aacsearch-production \
  --from-literal=POSTGRES_PASSWORD='your-password' \
  --from-literal=PAYLOAD_SECRET='your-secret' \
  --dry-run=client -o yaml | kubectl apply -f -

# Из файлов
kubectl create secret generic aacsearch-tls \
  --namespace=aacsearch-production \
  --from-file=tls.crt=./certs/tls.crt \
  --from-file=tls.key=./certs/tls.key
```

### Sealed Secrets (рекомендуется для GitOps)

Установка Sealed Secrets Controller:

```bash
# Install controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Install kubeseal CLI
brew install kubeseal  # macOS
# или
wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/kubeseal-linux-amd64
sudo install -m 755 kubeseal-linux-amd64 /usr/local/bin/kubeseal
```

Шифрование secrets:

```bash
# Encrypt secret
kubectl create secret generic aacsearch-secrets \
  --namespace=aacsearch-production \
  --from-literal=POSTGRES_PASSWORD='your-password' \
  --dry-run=client -o yaml | \
  kubeseal -o yaml > sealed-secrets.yaml

# Apply encrypted secret
kubectl apply -f sealed-secrets.yaml
```

### External Secrets Operator

Интеграция с AWS Secrets Manager, GCP Secret Manager, Vault:

```yaml
# external-secret.yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: aacsearch-secrets
  namespace: aacsearch-production
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: aacsearch-secrets
    creationPolicy: Owner
  data:
    - secretKey: POSTGRES_PASSWORD
      remoteRef:
        key: aacsearch/production/postgres
        property: password

    - secretKey: PAYLOAD_SECRET
      remoteRef:
        key: aacsearch/production/payload
        property: secret
```

---

## Deployment - Application

Deployment для stateless application:

```yaml
# deployment-app.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aacsearch-app
  namespace: aacsearch-production
  labels:
    app: aacsearch
    component: application
    environment: production
spec:
  # Replicas - управляется HPA
  replicas: 4

  # Selector для pods
  selector:
    matchLabels:
      app: aacsearch
      component: application

  # Strategy для rolling updates
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2        # Можно создать 2 extra pods
      maxUnavailable: 0  # Минимум 4 pods всегда running

  # Min ready время перед считывания pod ready
  minReadySeconds: 10

  # History limit для rollback
  revisionHistoryLimit: 10

  # Pod template
  template:
    metadata:
      labels:
        app: aacsearch
        component: application
        version: v1.0.0
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "9090"
        prometheus.io/path: "/metrics"

    spec:
      # ServiceAccount для RBAC
      serviceAccountName: aacsearch-app

      # Security context
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
        seccompProfile:
          type: RuntimeDefault

      # Affinity - распределение pods по nodes
      affinity:
        # Pod anti-affinity - не размещать pods на одном node
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - aacsearch
                topologyKey: kubernetes.io/hostname

        # Node affinity - предпочитать application pool
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              preference:
                matchExpressions:
                  - key: node-pool
                    operator: In
                    values:
                      - application

      # Init containers
      initContainers:
        # Wait for database
        - name: wait-for-postgres
          image: postgres:16-alpine
          command:
            - sh
            - -c
            - |
              until pg_isready -h postgres -p 5432 -U aacsearch; do
                echo "Waiting for postgres..."
                sleep 2
              done
          env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: aacsearch-secrets
                  key: POSTGRES_PASSWORD

        # Wait for Redis
        - name: wait-for-redis
          image: redis:7-alpine
          command:
            - sh
            - -c
            - |
              until redis-cli -h redis-cluster -p 6379 -a "${REDIS_PASSWORD}" ping; do
                echo "Waiting for redis..."
                sleep 2
              done
          env:
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: aacsearch-secrets
                  key: REDIS_PASSWORD

        # Wait for Typesense
        - name: wait-for-typesense
          image: curlimages/curl:latest
          command:
            - sh
            - -c
            - |
              until curl -f http://typesense:8108/health; do
                echo "Waiting for typesense..."
                sleep 2
              done

      # Main container
      containers:
        - name: app
          image: aacsearch:1.0.0
          imagePullPolicy: Always

          # Ports
          ports:
            - name: http
              containerPort: 3000
              protocol: TCP
            - name: metrics
              containerPort: 9090
              protocol: TCP

          # Environment variables из ConfigMap
          envFrom:
            - configMapRef:
                name: aacsearch-config
            - secretRef:
                name: aacsearch-secrets

          # Additional environment variables
          env:
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: POD_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
            - name: POD_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP

          # Resource limits
          resources:
            requests:
              cpu: 500m
              memory: 1Gi
            limits:
              cpu: 2000m
              memory: 2Gi

          # Liveness probe - перезапуск если не healthy
          livenessProbe:
            httpGet:
              path: /health/live
              port: http
              httpHeaders:
                - name: X-Health-Check
                  value: liveness
            initialDelaySeconds: 60
            periodSeconds: 10
            timeoutSeconds: 5
            successThreshold: 1
            failureThreshold: 3

          # Readiness probe - не отправлять traffic если не ready
          readinessProbe:
            httpGet:
              path: /health/ready
              port: http
              httpHeaders:
                - name: X-Health-Check
                  value: readiness
            initialDelaySeconds: 30
            periodSeconds: 5
            timeoutSeconds: 3
            successThreshold: 1
            failureThreshold: 3

          # Startup probe - для slow-starting apps
          startupProbe:
            httpGet:
              path: /health/startup
              port: http
            initialDelaySeconds: 0
            periodSeconds: 10
            timeoutSeconds: 3
            successThreshold: 1
            failureThreshold: 30  # 5 минут на startup

          # Security context
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: false
            runAsNonRoot: true
            runAsUser: 1001
            capabilities:
              drop:
                - ALL

          # Volume mounts
          volumeMounts:
            - name: tmp
              mountPath: /tmp
            - name: cache
              mountPath: /app/.next/cache

      # Volumes
      volumes:
        - name: tmp
          emptyDir: {}
        - name: cache
          emptyDir:
            sizeLimit: 1Gi

      # Tolerations - для scheduled nodes
      tolerations:
        - key: application
          operator: Equal
          value: "true"
          effect: NoSchedule

      # DNS policy
      dnsPolicy: ClusterFirst

      # Restart policy
      restartPolicy: Always

      # Termination grace period
      terminationGracePeriodSeconds: 30
```

```bash
kubectl apply -f deployment-app.yaml
```

### Проверка Deployment

```bash
# Status
kubectl get deployment -n aacsearch-production

# Pods
kubectl get pods -n aacsearch-production -l app=aacsearch

# Logs
kubectl logs -n aacsearch-production -l app=aacsearch --tail=100

# Describe
kubectl describe deployment -n aacsearch-production aacsearch-app
```

---

## StatefulSet - PostgreSQL

StatefulSet для stateful приложения с persistent storage:

```yaml
# statefulset-postgres.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: aacsearch-production
  labels:
    app: postgres
    component: database
spec:
  serviceName: postgres-headless
  replicas: 3  # 1 primary + 2 replicas

  selector:
    matchLabels:
      app: postgres
      component: database

  # Update strategy
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 0

  # Pod management policy
  podManagementPolicy: OrderedReady

  template:
    metadata:
      labels:
        app: postgres
        component: database

    spec:
      serviceAccountName: postgres

      securityContext:
        fsGroup: 999
        runAsUser: 999
        runAsNonRoot: true

      # Affinity - размещать на database nodes
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: node-pool
                    operator: In
                    values:
                      - database

        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: app
                    operator: In
                    values:
                      - postgres
              topologyKey: kubernetes.io/hostname

      containers:
        - name: postgres
          image: postgres:16-alpine

          ports:
            - name: postgres
              containerPort: 5432
              protocol: TCP

          env:
            - name: POSTGRES_DB
              value: "aacsearch"
            - name: POSTGRES_USER
              value: "aacsearch"
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: aacsearch-secrets
                  key: POSTGRES_PASSWORD
            - name: PGDATA
              value: /var/lib/postgresql/data/pgdata
            - name: POD_IP
              valueFrom:
                fieldRef:
                  fieldPath: status.podIP

          # PostgreSQL configuration
          args:
            - -c
            - max_connections=500
            - -c
            - shared_buffers=8GB
            - -c
            - effective_cache_size=24GB
            - -c
            - maintenance_work_mem=2GB
            - -c
            - checkpoint_completion_target=0.9
            - -c
            - wal_buffers=16MB
            - -c
            - default_statistics_target=100
            - -c
            - random_page_cost=1.1
            - -c
            - effective_io_concurrency=200
            - -c
            - work_mem=16MB
            - -c
            - min_wal_size=2GB
            - -c
            - max_wal_size=8GB
            - -c
            - max_worker_processes=8
            - -c
            - max_parallel_workers_per_gather=4
            - -c
            - max_parallel_workers=8
            - -c
            - wal_level=replica
            - -c
            - max_wal_senders=5
            - -c
            - wal_keep_size=1GB
            - -c
            - hot_standby=on

          resources:
            requests:
              cpu: 2000m
              memory: 8Gi
            limits:
              cpu: 4000m
              memory: 16Gi

          livenessProbe:
            exec:
              command:
                - /bin/sh
                - -c
                - pg_isready -U ${POSTGRES_USER}
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3

          readinessProbe:
            exec:
              command:
                - /bin/sh
                - -c
                - pg_isready -U ${POSTGRES_USER}
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3

          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
            - name: postgres-config
              mountPath: /etc/postgresql
            - name: postgres-init
              mountPath: /docker-entrypoint-initdb.d

      volumes:
        - name: postgres-config
          configMap:
            name: postgres-config
        - name: postgres-init
          configMap:
            name: postgres-init-scripts

  # Volume claim templates
  volumeClaimTemplates:
    - metadata:
        name: postgres-data
        labels:
          app: postgres
          component: database
      spec:
        accessModes:
          - ReadWriteOnce
        storageClassName: fast-ssd
        resources:
          requests:
            storage: 500Gi
```

### PostgreSQL ConfigMap

```yaml
# configmap-postgres.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-config
  namespace: aacsearch-production
data:
  postgresql.conf: |
    # Connection settings
    listen_addresses = '*'
    max_connections = 500
    superuser_reserved_connections = 3

    # Memory settings
    shared_buffers = 8GB
    effective_cache_size = 24GB
    maintenance_work_mem = 2GB
    work_mem = 16MB

    # WAL settings
    wal_level = replica
    max_wal_senders = 5
    wal_keep_size = 1GB
    max_wal_size = 8GB
    min_wal_size = 2GB
    wal_buffers = 16MB

    # Checkpoint settings
    checkpoint_timeout = 15min
    checkpoint_completion_target = 0.9

    # Query tuning
    default_statistics_target = 100
    random_page_cost = 1.1
    effective_io_concurrency = 200

    # Parallel query
    max_worker_processes = 8
    max_parallel_workers_per_gather = 4
    max_parallel_workers = 8

    # Logging
    log_destination = 'stderr'
    logging_collector = on
    log_directory = 'log'
    log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
    log_rotation_age = 1d
    log_rotation_size = 100MB
    log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
    log_timezone = 'UTC'

    # Replication
    hot_standby = on
    hot_standby_feedback = on
    max_standby_streaming_delay = 30s

  pg_hba.conf: |
    # TYPE  DATABASE        USER            ADDRESS                 METHOD
    local   all             all                                     trust
    host    all             all             127.0.0.1/32            scram-sha-256
    host    all             all             ::1/128                 scram-sha-256
    host    all             all             10.0.0.0/8              scram-sha-256
    host    replication     all             10.0.0.0/8              scram-sha-256

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-init-scripts
  namespace: aacsearch-production
data:
  01-init-extensions.sql: |
    -- Install required extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    CREATE EXTENSION IF NOT EXISTS "btree_gin";
    CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

  02-init-indexes.sql: |
    -- Create essential indexes
    -- (будут созданы после первой миграции Payload)
```

```bash
kubectl apply -f configmap-postgres.yaml
kubectl apply -f statefulset-postgres.yaml
```

---

## StatefulSet - Typesense

```yaml
# statefulset-typesense.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: typesense
  namespace: aacsearch-production
  labels:
    app: typesense
    component: search
spec:
  serviceName: typesense-headless
  replicas: 5

  selector:
    matchLabels:
      app: typesense
      component: search

  updateStrategy:
    type: RollingUpdate

  template:
    metadata:
      labels:
        app: typesense
        component: search

    spec:
      serviceAccountName: typesense

      affinity:
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              preference:
                matchExpressions:
                  - key: node-pool
                    operator: In
                    values:
                      - search

        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: app
                    operator: In
                    values:
                      - typesense
              topologyKey: kubernetes.io/hostname

      containers:
        - name: typesense
          image: typesense/typesense:27.1

          ports:
            - name: http
              containerPort: 8108
              protocol: TCP
            - name: peering
              containerPort: 8107
              protocol: TCP

          env:
            - name: TYPESENSE_DATA_DIR
              value: /data
            - name: TYPESENSE_API_KEY
              valueFrom:
                secretKeyRef:
                  name: aacsearch-secrets
                  key: TYPESENSE_API_KEY
            - name: TYPESENSE_ENABLE_CORS
              value: "true"
            - name: TYPESENSE_THREAD_POOL_SIZE
              value: "8"
            - name: TYPESENSE_NUM_COLLECTIONS_PARALLEL_LOAD
              value: "2"
            - name: TYPESENSE_NODES
              value: "typesense-0.typesense-headless:8107,typesense-1.typesense-headless:8107,typesense-2.typesense-headless:8107,typesense-3.typesense-headless:8107,typesense-4.typesense-headless:8107"
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: TYPESENSE_PEERING_ADDRESS
              value: "$(POD_NAME).typesense-headless:8107"

          resources:
            requests:
              cpu: 1000m
              memory: 4Gi
            limits:
              cpu: 2000m
              memory: 8Gi

          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3

          readinessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3

          volumeMounts:
            - name: typesense-data
              mountPath: /data

  volumeClaimTemplates:
    - metadata:
        name: typesense-data
      spec:
        accessModes:
          - ReadWriteOnce
        storageClassName: fast-ssd
        resources:
          requests:
            storage: 100Gi
```

```bash
kubectl apply -f statefulset-typesense.yaml
```

---

## StatefulSet - Redis

Redis Cluster с 6 nodes (3 masters + 3 replicas):

```yaml
# statefulset-redis.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-cluster
  namespace: aacsearch-production
  labels:
    app: redis
    component: cache
spec:
  serviceName: redis-cluster-headless
  replicas: 6

  selector:
    matchLabels:
      app: redis
      component: cache

  template:
    metadata:
      labels:
        app: redis
        component: cache

    spec:
      serviceAccountName: redis

      affinity:
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              preference:
                matchExpressions:
                  - key: node-pool
                    operator: In
                    values:
                      - database

        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: app
                    operator: In
                    values:
                      - redis
              topologyKey: kubernetes.io/hostname

      containers:
        - name: redis
          image: redis:7-alpine

          command:
            - redis-server
          args:
            - /etc/redis/redis.conf
            - --cluster-enabled
            - "yes"
            - --cluster-config-file
            - /data/nodes.conf
            - --cluster-node-timeout
            - "5000"
            - --appendonly
            - "yes"
            - --requirepass
            - $(REDIS_PASSWORD)
            - --masterauth
            - $(REDIS_PASSWORD)

          ports:
            - name: redis
              containerPort: 6379
              protocol: TCP
            - name: cluster-bus
              containerPort: 16379
              protocol: TCP

          env:
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: aacsearch-secrets
                  key: REDIS_PASSWORD

          resources:
            requests:
              cpu: 500m
              memory: 2Gi
            limits:
              cpu: 1000m
              memory: 4Gi

          livenessProbe:
            exec:
              command:
                - sh
                - -c
                - redis-cli -a "${REDIS_PASSWORD}" ping
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3

          readinessProbe:
            exec:
              command:
                - sh
                - -c
                - redis-cli -a "${REDIS_PASSWORD}" ping
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3

          volumeMounts:
            - name: redis-data
              mountPath: /data
            - name: redis-config
              mountPath: /etc/redis

      volumes:
        - name: redis-config
          configMap:
            name: redis-config

  volumeClaimTemplates:
    - metadata:
        name: redis-data
      spec:
        accessModes:
          - ReadWriteOnce
        storageClassName: fast-ssd
        resources:
          requests:
            storage: 50Gi
```

### Redis ConfigMap

```yaml
# configmap-redis.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-config
  namespace: aacsearch-production
data:
  redis.conf: |
    # Network
    bind 0.0.0.0
    port 6379
    tcp-backlog 511
    timeout 0
    tcp-keepalive 300

    # Cluster
    cluster-enabled yes
    cluster-node-timeout 5000
    cluster-replica-validity-factor 0
    cluster-migration-barrier 1
    cluster-require-full-coverage no

    # Memory
    maxmemory 3gb
    maxmemory-policy allkeys-lru
    maxmemory-samples 5

    # Persistence
    appendonly yes
    appendfilename "appendonly.aof"
    appendfsync everysec
    no-appendfsync-on-rewrite no
    auto-aof-rewrite-percentage 100
    auto-aof-rewrite-min-size 64mb

    save 900 1
    save 300 10
    save 60 10000

    # Performance
    lazyfree-lazy-eviction yes
    lazyfree-lazy-expire yes
    lazyfree-lazy-server-del yes
    replica-lazy-flush yes

    # Logging
    loglevel notice
    logfile ""
```

### Redis Cluster Initialization Job

```yaml
# job-redis-cluster-init.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: redis-cluster-init
  namespace: aacsearch-production
spec:
  template:
    spec:
      restartPolicy: OnFailure
      containers:
        - name: redis-cli
          image: redis:7-alpine
          command:
            - sh
            - -c
            - |
              # Wait for all pods to be ready
              sleep 30

              # Create cluster
              redis-cli --cluster create \
                redis-cluster-0.redis-cluster-headless:6379 \
                redis-cluster-1.redis-cluster-headless:6379 \
                redis-cluster-2.redis-cluster-headless:6379 \
                redis-cluster-3.redis-cluster-headless:6379 \
                redis-cluster-4.redis-cluster-headless:6379 \
                redis-cluster-5.redis-cluster-headless:6379 \
                --cluster-replicas 1 \
                --cluster-yes \
                -a "${REDIS_PASSWORD}"
          env:
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: aacsearch-secrets
                  key: REDIS_PASSWORD
```

```bash
kubectl apply -f configmap-redis.yaml
kubectl apply -f statefulset-redis.yaml
# После запуска всех pods:
kubectl apply -f job-redis-cluster-init.yaml
```

---

## Services

### Service для Application

```yaml
# service-app.yaml
apiVersion: v1
kind: Service
metadata:
  name: aacsearch-app
  namespace: aacsearch-production
  labels:
    app: aacsearch
    component: application
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
spec:
  type: ClusterIP
  selector:
    app: aacsearch
    component: application
  ports:
    - name: http
      port: 80
      targetPort: 3000
      protocol: TCP
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800  # 3 hours
```

### Headless Service для StatefulSets

```yaml
# service-postgres-headless.yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-headless
  namespace: aacsearch-production
  labels:
    app: postgres
    component: database
spec:
  type: ClusterIP
  clusterIP: None  # Headless service
  selector:
    app: postgres
    component: database
  ports:
    - name: postgres
      port: 5432
      targetPort: 5432
      protocol: TCP

---
# service-postgres.yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: aacsearch-production
  labels:
    app: postgres
    component: database
spec:
  type: ClusterIP
  selector:
    app: postgres
    component: database
  ports:
    - name: postgres
      port: 5432
      targetPort: 5432
      protocol: TCP

---
# service-typesense-headless.yaml
apiVersion: v1
kind: Service
metadata:
  name: typesense-headless
  namespace: aacsearch-production
  labels:
    app: typesense
    component: search
spec:
  type: ClusterIP
  clusterIP: None
  selector:
    app: typesense
    component: search
  ports:
    - name: http
      port: 8108
      targetPort: 8108
      protocol: TCP
    - name: peering
      port: 8107
      targetPort: 8107
      protocol: TCP

---
# service-typesense.yaml
apiVersion: v1
kind: Service
metadata:
  name: typesense
  namespace: aacsearch-production
  labels:
    app: typesense
    component: search
spec:
  type: ClusterIP
  selector:
    app: typesense
    component: search
  ports:
    - name: http
      port: 8108
      targetPort: 8108
      protocol: TCP

---
# service-redis-headless.yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-cluster-headless
  namespace: aacsearch-production
  labels:
    app: redis
    component: cache
spec:
  type: ClusterIP
  clusterIP: None
  selector:
    app: redis
    component: cache
  ports:
    - name: redis
      port: 6379
      targetPort: 6379
      protocol: TCP
    - name: cluster-bus
      port: 16379
      targetPort: 16379
      protocol: TCP

---
# service-redis.yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-cluster
  namespace: aacsearch-production
  labels:
    app: redis
    component: cache
spec:
  type: ClusterIP
  selector:
    app: redis
    component: cache
  ports:
    - name: redis
      port: 6379
      targetPort: 6379
      protocol: TCP
```

```bash
kubectl apply -f service-app.yaml
kubectl apply -f service-postgres-headless.yaml
kubectl apply -f service-typesense-headless.yaml
kubectl apply -f service-redis-headless.yaml
```

---

## Ingress

NGINX Ingress с SSL termination:

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aacsearch-ingress
  namespace: aacsearch-production
  labels:
    app: aacsearch
  annotations:
    # NGINX ingress annotations
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod

    # SSL configuration
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/ssl-protocols: "TLSv1.2 TLSv1.3"
    nginx.ingress.kubernetes.io/ssl-ciphers: "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384"

    # Performance
    nginx.ingress.kubernetes.io/enable-http2: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "100m"
    nginx.ingress.kubernetes.io/proxy-buffer-size: "8k"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "30"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "30"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "30"

    # Rate limiting
    nginx.ingress.kubernetes.io/limit-rps: "100"
    nginx.ingress.kubernetes.io/limit-connections: "100"

    # CORS
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "https://aacsearch.com,https://www.aacsearch.com"
    nginx.ingress.kubernetes.io/cors-allow-methods: "GET, POST, PUT, DELETE, OPTIONS"
    nginx.ingress.kubernetes.io/cors-allow-headers: "DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"

    # Security headers
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "X-Frame-Options: SAMEORIGIN";
      more_set_headers "X-Content-Type-Options: nosniff";
      more_set_headers "X-XSS-Protection: 1; mode=block";
      more_set_headers "Referrer-Policy: strict-origin-when-cross-origin";
      more_set_headers "Strict-Transport-Security: max-age=31536000; includeSubDomains";

    # Caching для static assets
    nginx.ingress.kubernetes.io/server-snippet: |
      location /_next/static/ {
        expires 365d;
        add_header Cache-Control "public, immutable";
      }

spec:
  tls:
    - hosts:
        - aacsearch.com
        - www.aacsearch.com
      secretName: aacsearch-tls

  rules:
    # Main domain
    - host: aacsearch.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: aacsearch-app
                port:
                  number: 80

    # www redirect
    - host: www.aacsearch.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: aacsearch-app
                port:
                  number: 80
```

### ClusterIssuer для cert-manager

```yaml
# cluster-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@aacsearch.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx

---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: admin@aacsearch.com
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
      - http01:
          ingress:
            class: nginx
```

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Apply ClusterIssuer
kubectl apply -f cluster-issuer.yaml

# Apply Ingress
kubectl apply -f ingress.yaml

# Check certificate
kubectl get certificate -n aacsearch-production
kubectl describe certificate aacsearch-tls -n aacsearch-production
```

---

## PersistentVolumes

### StorageClass

```yaml
# storageclass.yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
  labels:
    storage-tier: fast
provisioner: kubernetes.io/aws-ebs  # AWS
# provisioner: kubernetes.io/gce-pd  # GCP
# provisioner: kubernetes.io/azure-disk  # Azure
parameters:
  type: gp3  # AWS
  # type: pd-ssd  # GCP
  # storageaccounttype: Premium_LRS  # Azure
  fsType: ext4
  iops: "10000"
  throughput: "500"
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
reclaimPolicy: Retain
```

```bash
kubectl apply -f storageclass.yaml
```

Volumes автоматически создаются через `volumeClaimTemplates` в StatefulSets.

---

## HorizontalPodAutoscaler

Auto-scaling на основе CPU и memory:

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: aacsearch-app-hpa
  namespace: aacsearch-production
  labels:
    app: aacsearch
    component: application
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: aacsearch-app

  minReplicas: 4
  maxReplicas: 12

  # Scaling behavior
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300  # 5 минут перед scale down
      policies:
        - type: Pods
          value: 1
          periodSeconds: 60  # Удаляем максимум 1 pod в минуту
        - type: Percent
          value: 10
          periodSeconds: 60  # Или 10% pods в минуту
      selectPolicy: Min  # Выбираем более консервативную политику

    scaleUp:
      stabilizationWindowSeconds: 0  # Scale up немедленно
      policies:
        - type: Pods
          value: 2
          periodSeconds: 60  # Добавляем максимум 2 pods в минуту
        - type: Percent
          value: 50
          periodSeconds: 60  # Или 50% pods в минуту
      selectPolicy: Max  # Выбираем более агрессивную политику

  # Metrics
  metrics:
    # CPU utilization
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70

    # Memory utilization
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80

    # Custom metrics (requires metrics-server + custom metrics API)
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "1000"
```

```bash
# Install metrics-server (если не установлен)
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Apply HPA
kubectl apply -f hpa.yaml

# Check HPA status
kubectl get hpa -n aacsearch-production
kubectl describe hpa aacsearch-app-hpa -n aacsearch-production

# Watch scaling events
kubectl get hpa -n aacsearch-production -w
```

---

## VerticalPodAutoscaler

Автоматическая настройка resource requests/limits:

```yaml
# vpa.yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: aacsearch-app-vpa
  namespace: aacsearch-production
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: aacsearch-app

  updatePolicy:
    updateMode: "Auto"  # Auto, Recreate, Initial, Off

  resourcePolicy:
    containerPolicies:
      - containerName: app
        minAllowed:
          cpu: 100m
          memory: 128Mi
        maxAllowed:
          cpu: 4000m
          memory: 8Gi
        controlledResources:
          - cpu
          - memory
        mode: Auto
```

```bash
# Install VPA (если не установлен)
git clone https://github.com/kubernetes/autoscaler.git
cd autoscaler/vertical-pod-autoscaler
./hack/vpa-up.sh

# Apply VPA
kubectl apply -f vpa.yaml

# Check recommendations
kubectl get vpa -n aacsearch-production
kubectl describe vpa aacsearch-app-vpa -n aacsearch-production
```

---

## PodDisruptionBudget

Обеспечение availability во время updates:

```yaml
# pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: aacsearch-app-pdb
  namespace: aacsearch-production
  labels:
    app: aacsearch
    component: application
spec:
  minAvailable: 3  # Минимум 3 pods всегда running
  # или: maxUnavailable: 1  # Максимум 1 pod может быть unavailable

  selector:
    matchLabels:
      app: aacsearch
      component: application

---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: postgres-pdb
  namespace: aacsearch-production
spec:
  maxUnavailable: 1
  selector:
    matchLabels:
      app: postgres
      component: database

---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: typesense-pdb
  namespace: aacsearch-production
spec:
  minAvailable: 3  # Quorum requirement
  selector:
    matchLabels:
      app: typesense
      component: search

---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: redis-pdb
  namespace: aacsearch-production
spec:
  maxUnavailable: 1
  selector:
    matchLabels:
      app: redis
      component: cache
```

```bash
kubectl apply -f pdb.yaml
```

---

## NetworkPolicy

Изоляция сетевого трафика:

```yaml
# networkpolicy.yaml
# Default deny all ingress
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: aacsearch-production
spec:
  podSelector: {}
  policyTypes:
    - Ingress

---
# Allow ingress to app from ingress controller
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-to-app
  namespace: aacsearch-production
spec:
  podSelector:
    matchLabels:
      app: aacsearch
      component: application
  policyTypes:
    - Ingress
  ingress:
    # From ingress controller
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
        - podSelector:
            matchLabels:
              app.kubernetes.io/name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3000

---
# Allow app to access database
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app-to-postgres
  namespace: aacsearch-production
spec:
  podSelector:
    matchLabels:
      app: postgres
      component: database
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: aacsearch
              component: application
      ports:
        - protocol: TCP
          port: 5432

---
# Allow app to access Redis
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app-to-redis
  namespace: aacsearch-production
spec:
  podSelector:
    matchLabels:
      app: redis
      component: cache
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: aacsearch
              component: application
      ports:
        - protocol: TCP
          port: 6379
        - protocol: TCP
          port: 16379

---
# Allow app to access Typesense
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app-to-typesense
  namespace: aacsearch-production
spec:
  podSelector:
    matchLabels:
      app: typesense
      component: search
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: aacsearch
              component: application
      ports:
        - protocol: TCP
          port: 8108

---
# Allow Typesense peering
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-typesense-peering
  namespace: aacsearch-production
spec:
  podSelector:
    matchLabels:
      app: typesense
      component: search
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: typesense
              component: search
      ports:
        - protocol: TCP
          port: 8107

---
# Allow egress для app (external APIs)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app-egress
  namespace: aacsearch-production
spec:
  podSelector:
    matchLabels:
      app: aacsearch
      component: application
  policyTypes:
    - Egress
  egress:
    # DNS
    - to:
        - namespaceSelector:
            matchLabels:
              name: kube-system
        - podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53

    # External HTTPS (Stripe, OpenAI, etc.)
    - to:
        - podSelector: {}
      ports:
        - protocol: TCP
          port: 443

    # Internal services
    - to:
        - podSelector:
            matchLabels:
              app: postgres
      ports:
        - protocol: TCP
          port: 5432

    - to:
        - podSelector:
            matchLabels:
              app: redis
      ports:
        - protocol: TCP
          port: 6379

    - to:
        - podSelector:
            matchLabels:
              app: typesense
      ports:
        - protocol: TCP
          port: 8108
```

```bash
kubectl apply -f networkpolicy.yaml

# Test network connectivity
kubectl run -it --rm debug --image=busybox --restart=Never -n aacsearch-production -- sh
# From inside pod:
# wget -qO- http://aacsearch-app
# nc -zv postgres 5432
```

---

## ServiceAccount и RBAC

```yaml
# rbac.yaml
# ServiceAccount для app
apiVersion: v1
kind: ServiceAccount
metadata:
  name: aacsearch-app
  namespace: aacsearch-production
  labels:
    app: aacsearch

---
# Role для app
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: aacsearch-app-role
  namespace: aacsearch-production
rules:
  # Read ConfigMaps
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "list", "watch"]

  # Read Secrets
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get", "list"]

  # Read Services (для service discovery)
  - apiGroups: [""]
    resources: ["services"]
    verbs: ["get", "list"]

---
# RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: aacsearch-app-rolebinding
  namespace: aacsearch-production
subjects:
  - kind: ServiceAccount
    name: aacsearch-app
    namespace: aacsearch-production
roleRef:
  kind: Role
  name: aacsearch-app-role
  apiGroup: rbac.authorization.k8s.io

---
# ServiceAccount для PostgreSQL
apiVersion: v1
kind: ServiceAccount
metadata:
  name: postgres
  namespace: aacsearch-production

---
# ServiceAccount для Redis
apiVersion: v1
kind: ServiceAccount
metadata:
  name: redis
  namespace: aacsearch-production

---
# ServiceAccount для Typesense
apiVersion: v1
kind: ServiceAccount
metadata:
  name: typesense
  namespace: aacsearch-production
```

```bash
kubectl apply -f rbac.yaml
```

---

## Helm Charts

Создание Helm chart для упрощенного deployment:

### Chart Structure

```
aacsearch-chart/
├── Chart.yaml
├── values.yaml
├── values-production.yaml
├── values-staging.yaml
├── templates/
│   ├── _helpers.tpl
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── deployment-app.yaml
│   ├── statefulset-postgres.yaml
│   ├── statefulset-redis.yaml
│   ├── statefulset-typesense.yaml
│   ├── service-app.yaml
│   ├── service-postgres.yaml
│   ├── service-redis.yaml
│   ├── service-typesense.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   ├── pdb.yaml
│   ├── networkpolicy.yaml
│   └── rbac.yaml
└── charts/
    ├── postgresql/
    └── redis/
```

### Chart.yaml

```yaml
apiVersion: v2
name: aacsearch
description: AACSearch Platform - Multi-tenant SaaS Search Platform
type: application
version: 1.0.0
appVersion: "1.0.0"
keywords:
  - search
  - saas
  - multi-tenant
  - payloadcms
  - typesense
home: https://aacsearch.com
sources:
  - https://github.com/yourorg/aacsearch-platform
maintainers:
  - name: AACSearch Team
    email: devops@aacsearch.com
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: "https://charts.bitnami.com/bitnami"
    condition: postgresql.enabled
  - name: redis
    version: "17.x.x"
    repository: "https://charts.bitnami.com/bitnami"
    condition: redis.enabled
```

### values.yaml

```yaml
# Default values для AACSearch Chart
global:
  environment: production
  domain: aacsearch.com

# Application configuration
app:
  name: aacsearch
  replicaCount: 4

  image:
    repository: aacsearch
    tag: "1.0.0"
    pullPolicy: Always

  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 2000m
      memory: 2Gi

  autoscaling:
    enabled: true
    minReplicas: 4
    maxReplicas: 12
    targetCPUUtilizationPercentage: 70
    targetMemoryUtilizationPercentage: 80

  service:
    type: ClusterIP
    port: 80
    targetPort: 3000

  ingress:
    enabled: true
    className: nginx
    annotations:
      cert-manager.io/cluster-issuer: letsencrypt-prod
    tls:
      enabled: true
      secretName: aacsearch-tls
    hosts:
      - host: aacsearch.com
        paths:
          - path: /
            pathType: Prefix

# PostgreSQL configuration
postgresql:
  enabled: true
  auth:
    username: aacsearch
    password: "CHANGE_ME"
    database: aacsearch
  primary:
    persistence:
      enabled: true
      size: 500Gi
      storageClass: fast-ssd
    resources:
      requests:
        cpu: 2000m
        memory: 8Gi
      limits:
        cpu: 4000m
        memory: 16Gi

# Redis configuration
redis:
  enabled: true
  architecture: replication
  auth:
    enabled: true
    password: "CHANGE_ME"
  master:
    persistence:
      enabled: true
      size: 50Gi
      storageClass: fast-ssd
    resources:
      requests:
        cpu: 500m
        memory: 2Gi
      limits:
        cpu: 1000m
        memory: 4Gi
  replica:
    replicaCount: 2

# Typesense configuration
typesense:
  enabled: true
  replicaCount: 5
  image:
    repository: typesense/typesense
    tag: "27.1"

  persistence:
    enabled: true
    size: 100Gi
    storageClass: fast-ssd

  resources:
    requests:
      cpu: 1000m
      memory: 4Gi
    limits:
      cpu: 2000m
      memory: 8Gi

# Monitoring
monitoring:
  enabled: true
  prometheus:
    enabled: true
  grafana:
    enabled: true
```

### Установка через Helm

```bash
# Add repository
helm repo add aacsearch https://charts.aacsearch.com
helm repo update

# Install с default values
helm install aacsearch aacsearch/aacsearch \
  --namespace aacsearch-production \
  --create-namespace

# Install с custom values
helm install aacsearch aacsearch/aacsearch \
  --namespace aacsearch-production \
  --create-namespace \
  --values values-production.yaml

# Upgrade
helm upgrade aacsearch aacsearch/aacsearch \
  --namespace aacsearch-production \
  --values values-production.yaml

# Rollback
helm rollback aacsearch 1 -n aacsearch-production

# Uninstall
helm uninstall aacsearch -n aacsearch-production
```

---

## Operators

### PostgreSQL Operator (Zalando)

```bash
# Install operator
kubectl apply -k github.com/zalando/postgres-operator/manifests

# Create PostgreSQL cluster
kubectl apply -f - <<EOF
apiVersion: "acid.zalan.do/v1"
kind: postgresql
metadata:
  name: aacsearch-postgres
  namespace: aacsearch-production
spec:
  teamId: "aacsearch"
  volume:
    size: 500Gi
    storageClass: fast-ssd
  numberOfInstances: 3
  users:
    aacsearch:
      - superuser
      - createdb
  databases:
    aacsearch: aacsearch
  postgresql:
    version: "16"
    parameters:
      shared_buffers: "8GB"
      max_connections: "500"
      effective_cache_size: "24GB"
  resources:
    requests:
      cpu: 2000m
      memory: 8Gi
    limits:
      cpu: 4000m
      memory: 16Gi
EOF
```

---

## GitOps с ArgoCD

### Install ArgoCD

```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port forward
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Login via CLI
argocd login localhost:8080
```

### ArgoCD Application

```yaml
# argocd-application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: aacsearch-production
  namespace: argocd
spec:
  project: default

  source:
    repoURL: https://github.com/yourorg/aacsearch-platform.git
    targetRevision: main
    path: k8s/overlays/production

    # Или Helm chart:
    # chart: aacsearch
    # helm:
    #   valueFiles:
    #     - values-production.yaml

  destination:
    server: https://kubernetes.default.svc
    namespace: aacsearch-production

  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false

    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
      - PruneLast=true

    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

```bash
kubectl apply -f argocd-application.yaml
```

---

## Monitoring Integration

Смотрите детальную документацию в [07-monitoring.md](07-monitoring.md).

Краткая установка Prometheus + Grafana:

```bash
# Add Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install kube-prometheus-stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set grafana.enabled=true \
  --set grafana.adminPassword=admin

# Port forward Grafana
kubectl port-forward svc/prometheus-grafana -n monitoring 3000:80
```

---

## Troubleshooting

### Common Issues

**Pods не запускаются**:
```bash
kubectl get pods -n aacsearch-production
kubectl describe pod <pod-name> -n aacsearch-production
kubectl logs <pod-name> -n aacsearch-production
```

**ImagePullBackOff**:
```bash
# Check image pull secrets
kubectl get secrets -n aacsearch-production
kubectl describe pod <pod-name> -n aacsearch-production | grep -A 5 Events
```

**CrashLoopBackOff**:
```bash
# Check logs
kubectl logs <pod-name> -n aacsearch-production --previous
kubectl logs <pod-name> -n aacsearch-production --tail=100
```

**Service not accessible**:
```bash
# Check service
kubectl get svc -n aacsearch-production
kubectl describe svc aacsearch-app -n aacsearch-production

# Check endpoints
kubectl get endpoints -n aacsearch-production

# Test connectivity
kubectl run -it --rm debug --image=busybox -n aacsearch-production -- sh
# wget -qO- http://aacsearch-app
```

**PVC not binding**:
```bash
# Check PVCs
kubectl get pvc -n aacsearch-production
kubectl describe pvc <pvc-name> -n aacsearch-production

# Check storage class
kubectl get storageclass
```

**High memory/CPU**:
```bash
# Check resource usage
kubectl top pods -n aacsearch-production
kubectl top nodes

# Check limits
kubectl describe pod <pod-name> -n aacsearch-production | grep -A 5 Limits
```

### Useful Commands

```bash
# Get all resources
kubectl get all -n aacsearch-production

# Watch pods
kubectl get pods -n aacsearch-production -w

# Exec into pod
kubectl exec -it <pod-name> -n aacsearch-production -- /bin/sh

# Copy files
kubectl cp <pod-name>:/path/to/file ./local-file -n aacsearch-production

# Port forward
kubectl port-forward <pod-name> 3000:3000 -n aacsearch-production

# Get events
kubectl get events -n aacsearch-production --sort-by='.lastTimestamp'

# Describe all resources
kubectl describe all -n aacsearch-production
```

---

**Следующие шаги**:
- Для стратегий масштабирования, смотрите [05-scaling.md](05-scaling.md)
- Для настройки мониторинга, смотрите [07-monitoring.md](07-monitoring.md)
- Для disaster recovery, смотрите [08-disaster-recovery.md](08-disaster-recovery.md)
