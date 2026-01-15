package com.toyotaborsa.finance.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security configuration for OAuth2 Resource Server with Keycloak
 * integration.
 * Configures JWT token validation, role mapping, and CORS settings.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    /**
     * Configures the security filter chain with OAuth2 resource server settings.
     * - Public endpoints: /actuator/health, /api/public/**
     * - Protected endpoints: All others require authentication
     * - JWT-based authentication via Keycloak
     * - Stateless session management
     * - CORS enabled for frontend access
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/news/**").permitAll() // News endpoints public
                        .requestMatchers("/api/forex/**").permitAll() // Forex endpoints public (TCMB API)
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    /**
     * Converts JWT tokens from Keycloak into Spring Security authorities.
     * Maps Keycloak realm roles and resource roles to Spring Security granted
     * authorities.
     * Roles are prefixed with ROLE_ for compatibility with Spring Security
     * annotations.
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("realm_access.roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());

        return jwtAuthenticationConverter;
    }

    /**
     * CORS configuration to allow frontend applications to access the API.
     * Allows requests from localhost dev servers (React/Vite) and production
     * domains.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // İzin verilen siteler (Originler)
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:5173", // Genelde Vite/React portu
                "http://localhost:4173", // Front portunu değiştirebilirsin!!!
                "http://localhost:3000",
                "https://*.toyotaborsa.com"));// Canlı ortam domaini
        // İzin verilen HTTP metotları
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        // İzin verilen başlıklar (Header)
        configuration.setAllowedHeaders(Arrays.asList("*"));// Tüm başlıklara izin ver
        // Tarayıcının okumasına izin verilen özel başlıklar
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        // Cookie veya Auth header gönderimine izin ver
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Bu kurallar hangi URL'lerde geçerli olsun?
        source.registerCorsConfiguration("/api/**", configuration);

        return source;
    }
}
