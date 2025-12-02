package com.ars.backend.config;


import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Student Management App API")
                        .version("1.0")
                        .description("API documentation for the Student Management System")
                        .contact(new Contact()
                                .name("Abderaouf Souissi")
                                .email("abderaouf@souissi@outlook.com")
                                .url("https://abderaoufsouissi.github.io/portfolio/"))
                );
    }
}
