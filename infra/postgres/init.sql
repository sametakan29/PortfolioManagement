-- Create keycloak database for Keycloak to use
CREATE DATABASE keycloak;
GRANT ALL PRIVILEGES ON DATABASE keycloak TO finance_user;

-- Create initial schema for finance portal (Flyway will manage the rest)
\c finance_portal;

-- Grant schema access
GRANT ALL ON SCHEMA public TO finance_user;
