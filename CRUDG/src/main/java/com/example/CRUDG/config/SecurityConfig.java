package com.example.CRUDG.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.CRUDG.security.JwtFilter;





@Configuration
@EnableWebSecurity

public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;


    
   

    // 🔹 Permitir acceso libre a todos los endpoints
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // desactiva CSRF (útil para pruebas con Postman)
            .authorizeHttpRequests(auth -> auth
            //endpoinds publicos
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/patients/register").permitAll()
                //edpoinds protegisdos por rol
                .requestMatchers("/api/v1/admin/**").permitAll()//hasRole("Admin")
                .requestMatchers("/api/v1/doctor/**").permitAll()//hasAnyRole("Admin")
                .requestMatchers("/api/v1/patient/**").permitAll()
                .requestMatchers("/api/v1/patients/**").permitAll()//hasAnyRole("Admin","Doctor")
                .anyRequest().authenticated() // permite todo sin autenticación
            )


            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
            // Registramos el filtro JWT antes del filtro de autenticación por username/password
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); 

            
    

        return http.build();
    }
    // 🔹 Bean para codificar contraseñas (esto ya lo tenías)
    @Bean
    public PasswordEncoder passwordEncoder() {
    return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }


}

