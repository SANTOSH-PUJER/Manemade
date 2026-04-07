package manemade.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class ManeMadeSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    public ManeMadeSecurityConfig(@org.springframework.context.annotation.Lazy JwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .securityContext(context -> context.securityContextRepository(new org.springframework.security.web.context.HttpSessionSecurityContextRepository()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/user/register", "/api/user/login", "/api/user/generate-otp", "/api/user/verify-otp", "/api/user/reset-password", "/api/analytics/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/categories/**", "/api/items/**").permitAll()
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "ADMINISTRATOR")
                .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/categories/**", "/api/items/**").hasAnyRole("ADMIN", "ADMINISTRATOR")
                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/categories/**", "/api/items/**").hasAnyRole("ADMIN", "ADMINISTRATOR")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/categories/**", "/api/items/**").hasAnyRole("ADMIN", "ADMINISTRATOR")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .logout(logout -> logout
                .logoutUrl("/api/user/logout")
                .logoutSuccessHandler((req, res, auth) -> res.setStatus(200))
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            );
            
        return http.build();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOrigins(java.util.List.of("http://localhost:5173", "http://localhost:5174"));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type", "Cache-Control", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(java.util.List.of("Authorization"));
        
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}