# Finance Portal - Container Architecture

## Technical Requirements Evaluation ✅

### ✅ Container-Based Architecture
All application components run in Docker containers with proper isolation and resource management.

### ✅ Docker Images
Created Dockerfiles for all application components:
- **Backend API**: Multi-stage build (Maven + Temurin JRE 21)
- **Log Consumer**: Separate multi-stage build
- **Frontend**: Multi-stage build (Node 20 build + Nginx Alpine runtime)
- **Infrastructure**: Using official images (PostgreSQL, Kafka, OpenSearch, Keycloak, etc.)

### ✅ Docker Compose Orchestration
Complete orchestration setup with 12 services on shared network `toyotaborsa-network`:
- Service dependencies properly configured
- Health checks and restart policies
- Volume management for data persistence
- Port mappings for external access

### ✅ Separate Containers (All Components Isolated)

#### **Backend Containers (2)**
1. **backend** (Port 8081)
   - Spring Boot 3.2 + Java 21
   - OAuth2 Resource Server (Keycloak integration)
   - REST API with security
   - Logs to Kafka

2. **log-consumer** (Port 8082)
   - Kafka consumer service
   - Reads logs from Kafka
   - Indexes to OpenSearch

#### **Frontend Container (1)**
3. **frontend** (Port 80)
   - React 18 + TypeScript + Vite
   - Material UI components
   - Nginx web server
   - Reverse proxy to backend

#### **Database Containers (2)**
4. **postgres** (Port 5432)
   - PostgreSQL 16
   - Shared by backend and Keycloak

5. **opensearch** (Port 9200)
   - OpenSearch 2.17.0
   - Log storage and search

#### **Log/Monitoring Containers (5)**
6. **kafka** (Port 9092)
   - Confluent Kafka 7.5.0
   - Message broker for logs

7. **zookeeper** (Port 2181)
   - Kafka coordination

8. **opensearch-dashboards** (Port 5601)
   - Log visualization UI

9. **otel-collector** (Ports 4317, 4318)
   - OpenTelemetry Collector
   - Trace/metric collection

10. **keycloak** (Port 8080)
    - Identity & Access Management
    - OAuth2/OIDC provider

#### **Supporting Containers (2)**
11. **ldap** (Ports 389, 636)
    - OpenLDAP server
    - User directory for Keycloak

12. **Total: 12 separate containers**

## Container Communication Flow
```
Frontend (Nginx:80) 
    ↓ /api proxy
Backend (Spring:8081) 
    ↓ JWT validation
Keycloak (8080) ← LDAP (389)
    ↓ logs
Kafka (9092) 
    ↓ consume
Log-Consumer (8082) 
    ↓ index
OpenSearch (9200) ← OpenSearch Dashboards (5601)
    ↓ traces
OTel Collector (4317/4318) → OpenSearch
```

## Deployment Commands
```bash
# Start all containers
docker compose up -d

# Build and start with fresh images
docker compose up -d --build

# View logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f log-consumer

# Stop all containers
docker compose down

# Stop and remove volumes
docker compose down -v
```

## Access Points
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8081
- **Keycloak**: http://localhost:8080
- **OpenSearch Dashboards**: http://localhost:5601
- **PostgreSQL**: localhost:5432
