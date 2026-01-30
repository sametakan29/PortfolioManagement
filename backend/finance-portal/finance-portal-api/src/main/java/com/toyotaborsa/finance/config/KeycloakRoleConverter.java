package com.toyotaborsa.finance.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Keycloak JWT Token'dan Rol Çıkarıcı (Role Converter)
 * 
 * Keycloak'tan gelen JWT token'daki rolleri Spring Security'nin
 * GrantedAuthority formatına dönüştürür.
 * 
 * İki tür rol desteklenir:(ileride başka uygulamalarda eklenebilir)
 * 1. Realm Roles: Tüm uygulamalar için geçerli (user, admin vb.)
 * 2. Resource Roles: Sadece bu uygulama için geçerli (client-specific)
 */
public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
    // JWT token'da realm rollerinin bulunduğu claim adı
    private static final String REALM_ACCESS_CLAIM = "realm_access";
    // JWT token'da client-specific rollerinin bulunduğu claim adı
    private static final String RESOURCE_ACCESS_CLAIM = "resource_access";
    // Rollerin içinde bulunduğu array'in adı
    private static final String ROLES_CLAIM = "roles";
    // Spring Security roller bu prefix ile başlamalı
    private static final String ROLE_PREFIX = "ROLE_";

    /**
     * JWT token'dan tüm rolleri çıkart ve GrantedAuthority'ye çevir
     * 
     * Realm rolleri + Resource rolleri = Tüm Yetkililer
     */
    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        // Tüm uygulamalar için geçerli rolleri al
        authorities.addAll(extractRealmRoles(jwt));

        // Bu uygulama için özel rolleri al
        authorities.addAll(extractResourceRoles(jwt));

        return authorities;
    }

    /**
     * Realm Rollerini Çıkart
     * 
     * JWT yapısı:
     * { "realm_access": { "roles": ["user", "admin"] } }
     * 
     * Sonuç: [ROLE_USER, ROLE_ADMIN]
     */
    private Collection<GrantedAuthority> extractRealmRoles(Jwt jwt) {
        // realm_access claim'ini Map olarak al
        Map<String, Object> realmAccess = jwt.getClaimAsMap(REALM_ACCESS_CLAIM);
        if (realmAccess == null || realmAccess.isEmpty()) {
            return Collections.emptyList();
        }

        // roles array'ini çıkart
        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) realmAccess.get(ROLES_CLAIM);
        if (roles == null || roles.isEmpty()) {
            return Collections.emptyList();
        }

        // Her rolü ROLE_ prefix'i ile dönüştür
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(ROLE_PREFIX + role.toUpperCase()))
                .collect(Collectors.toList());
    }

    /**
     * Client-Specific (Resource) Rollerini Çıkart
     * 
     * JWT yapısı:
     * {
     * "resource_access": {
     * "finance-portal": { "roles": ["portfolio_manager", "analyst"] },
     * "other-client": { "roles": ["viewer"] }
     * }
     * }
     * 
     * Sonuç: [ROLE_PORTFOLIO_MANAGER, ROLE_ANALYST, ROLE_VIEWER]
     * (Sadece finance-portal client'ının rolleri alınır)
     */
    private Collection<GrantedAuthority> extractResourceRoles(Jwt jwt) {
        // resource_access claim'ini al
        Map<String, Object> resourceAccess = jwt.getClaimAsMap(RESOURCE_ACCESS_CLAIM);
        if (resourceAccess == null || resourceAccess.isEmpty()) {
            return Collections.emptyList();
        }

        // Her client'ın rollerini işle
        return resourceAccess.values().stream()
                // Sadece Map olan değerleri filtrele (resource_access sadece Map içerir)
                .filter(resource -> resource instanceof Map)
                // Her Map'i açıp roles array'ini bul
                .flatMap(resource -> {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> resourceMap = (Map<String, Object>) resource;
                    @SuppressWarnings("unchecked")
                    List<String> roles = (List<String>) resourceMap.get(ROLES_CLAIM);
                    if (roles == null || roles.isEmpty()) {
                        return Stream.empty();
                    }
                    return roles.stream();
                })
                // Her rolü ROLE_ prefix'i ile dönüştür
                .map(role -> new SimpleGrantedAuthority(ROLE_PREFIX + role.toUpperCase()))
                .collect(Collectors.toList());
    }
}
