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
 * Spring Security Konfigürasyonu - OAuth2 + Keycloak
 * 
 * Sorumluluklar:
 * 1. JWT token validasyonu (Keycloak'tan gelen tokenları kontrol et)
 * 2. Rol yönetimi (realm_access ve resource_access rolleri)
 * 3. Endpoint güvenliği (hangi endpoint'lere kimin erişebileceği)
 * 4. CORS konfigürasyonu (frontend erişimi izin ver)
 * 5. Stateless oturum (her istek bağımsız - JWT bazlı)
 */
@Configuration
@EnableWebSecurity
// Method-level security: @PreAuthorize, @Secured vb. annotations çalışsın
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    /**
     * Güvenlik Filtre Zinciri Konfigürasyonu
     * 
     * Yapı:
     * 1. CORS izinleri kontrol et
     * 2. CSRF devre dışı (JWT stateless'tir)
     * 3. Hangi endpoint'ler public, hangisi protected?
     * 4. JWT token validasyonu
     * 5. Stateless oturum yönetimi
     * 
     * Public Endpoints (kimlik doğrulama gerekmiyor):
     * - /actuator/health, /actuator/info → Health check
     * - /api/public/** → Genel API
     * - /api/news/** → Haber (herkese açık)
     * - /api/forex/** → Döviz (herkese açık)
     * - /api/stocks/**, /api/bonds/**, /api/viop/**, /api/funds/** → Dev için açık
     * 
     * Diğer tüm endpoint'ler kimlik doğrulama gerektirir
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CORS kurallarını uygula (frontend erişimi için)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // CSRF devre dışı (JWT kullanan API'lerde gerekli değil)
                .csrf(csrf -> csrf.disable())
                // Endpoint yetkilendirmesi
                .authorizeHttpRequests(auth -> auth
                        // Health check endpoint'leri herkese açık
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        // Public API endpoint'leri
                        .requestMatchers("/api/public/**").permitAll()
                        // Haber endpoint'leri (herkese açık)
                        .requestMatchers("/api/news/**").permitAll()
                        // Döviz endpoint'leri (TCMB API - herkese açık)
                        .requestMatchers("/api/forex/**").permitAll()
                        // Hisse verileri (dev/test için açık)
                        .requestMatchers("/api/stocks/**").permitAll()
                        // Tahvil verileri (dev/test için açık)
                        .requestMatchers("/api/bonds/**").permitAll()
                        // VIOP verileri (dev/test için açık)
                        .requestMatchers("/api/viop/**").permitAll()
                        // Fon verileri (dev/test için açık)
                        .requestMatchers("/api/funds/**").permitAll()
                        // Diğer tüm request'ler: Kimlik doğrulama ZORUNLU
                        .anyRequest().authenticated())
                // OAuth2 Resource Server: Keycloak'tan gelen JWT token'ı kontrol et
                .oauth2ResourceServer(oauth2 -> oauth2
                        // JWT token'ı parse et ve validasyon yap
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
                // Oturum yönetimi: Stateless (her request bağımsız)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    /**
     * JWT Token'ı Spring Security Authorities'ne Çevir
     * 
     * Keycloak'tan gelen JWT token içindeki rolleri Spring Security'nin
     * anladığı GrantedAuthority formatına dönüştür
     * 
     * Örnek:
     * JWT: { "realm_access": { "roles": ["user", "admin"] } }
     * ↓
     * Spring Security: [ROLE_USER, ROLE_ADMIN]
     * 
     * Geliştirme: KeycloakRoleConverter sınıfına bakın (realm + resource rolleri)
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        // Default converter (realm_access.roles'dan okur)
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("realm_access.roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        // Custom converter (Keycloak'ın realm + resource rolleri)
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());

        return jwtAuthenticationConverter;
    }

    /**
     * CORS (Cross-Origin Resource Sharing) Konfigürasyonu
     * 
     * Ne işe yarar?
     * Frontend (React/Vite) tarayıcıdan API'ya istek gönderir
     * Tarayıcı şu kontrol eder: "Bu origin'den gelen istek kabul edilebilir mi?"
     * 
     * İzin Verilen:
     * - Origins: localhost:5173, localhost:4173, localhost:3000, *.toyotaborsa.com
     * - Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
     * - Headers: Tüm başlıklar (*)
     * - Credentials: true (Cookie/Auth header gönderilsin)
     * - Max Age: 3600 saniye (preflight cache süresi)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Hangi sitelerden gelen request'leri kabul et?
        // NOT: Production'da localhost'u sil ve sadece gerçek domain'i bırak
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:5173", // Vite/React dev sunucu (default portu)
                "http://localhost:4173", // Vite production preview portu
                "http://localhost:3000", // Create React App default portu
                "https://*.toyotaborsa.com")); // Production domain'i

        // İzin verilen HTTP metotları
        configuration.setAllowedMethods(Arrays.asList(
                "GET", // Veri çekme
                "POST", // Veri oluşturma
                "PUT", // Veri güncelleme (tamamı)
                "DELETE", // Veri silme
                "PATCH", // Veri güncelleme (kısmi)
                "OPTIONS" // CORS preflight request
        ));

        // İzin verilen request başlıkları (tüm başlıklara izin ver)
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Frontend'in okuyabileceği response başlıkları
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization", // JWT token
                "Content-Type" // Yanıt tipi
        ));

        // Cookie veya Authorization header ile istek yapılabilsin
        configuration.setAllowCredentials(true);

        // Browser'ın CORS preflight sonucunu 1 saat cache'lemesin
        configuration.setMaxAge(3600L);

        // CORS kurallarını apply et
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Bu kurallar /api/** path'inde geçerli
        source.registerCorsConfiguration("/api/**", configuration);

        return source;
    }
}
