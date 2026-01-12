package com.toyotaborsa.finance.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Extracts roles from Keycloak JWT tokens and converts them to Spring Security
 * GrantedAuthorities.
 * Handles both realm_access roles and resource_access (client-specific) roles.
 */
public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
    private static final String REALM_ACCESS_CLAIM = "realm_access";
    private static final String RESOURCE_ACCESS_CLAIM = "resource_access";
    private static final String ROLES_CLAIM = "roles";
    private static final String ROLE_PREFIX = "ROLE_";

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        // Extract realm roles
        authorities.addAll(extractRealmRoles(jwt));

        // Extract resource (client) roles
        authorities.addAll(extractResourceRoles(jwt));

        return authorities;
    }

    /**
     * Extracts roles from the realm_access claim in the JWT token.
     * Example: { "realm_access": { "roles": ["user", "admin"] } }
     */
    private Collection<GrantedAuthority> extractRealmRoles(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaimAsMap(REALM_ACCESS_CLAIM);
        if (realmAccess == null || realmAccess.isEmpty()) {
            return Collections.emptyList();
        }

        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) realmAccess.get(ROLES_CLAIM);
        if (roles == null || roles.isEmpty()) {
            return Collections.emptyList();
        }

        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(ROLE_PREFIX + role.toUpperCase()))
                .collect(Collectors.toList());
    }

    /**
     * Extracts roles from the resource_access claim (client-specific roles).
     * Example: { "resource_access": { "finance-portal": { "roles":
     * ["portfolio_manager"] } } }
     */
    private Collection<GrantedAuthority> extractResourceRoles(Jwt jwt) {
        Map<String, Object> resourceAccess = jwt.getClaimAsMap(RESOURCE_ACCESS_CLAIM);
        if (resourceAccess == null || resourceAccess.isEmpty()) {
            return Collections.emptyList();
        }

        return resourceAccess.values().stream()
                .filter(resource -> resource instanceof Map)
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
                .map(role -> new SimpleGrantedAuthority(ROLE_PREFIX + role.toUpperCase()))
                .collect(Collectors.toList());
    }
}
