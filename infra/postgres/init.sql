-- PostgreSQL Init Script for Finance Portal
-- Bu script sadece Docker container başlatılırken çalışır.
-- Tablo oluşturma işlemleri Flyway tarafından yönetilir.

-- 1. Keycloak Database Kurulumu
CREATE DATABASE keycloak;
GRANT ALL PRIVILEGES ON DATABASE keycloak TO finance_user;

-- 2. Finance Portal Database Yapılandırması
\c finance_portal;

-- Schema erişim izinleri
GRANT ALL ON SCHEMA public TO finance_user;

-- Default privileges: Flyway tarafından oluşturulacak tüm tablolar için
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO finance_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO finance_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO finance_user;

-- 3. Flyway için gerekli izinler
-- Flyway'in schema_version/flyway_schema_history tablosunu oluşturabilmesi için
GRANT CREATE ON SCHEMA public TO finance_user;

-- Not: Tablo oluşturma işlemleri Flyway migration dosyaları tarafından yapılır