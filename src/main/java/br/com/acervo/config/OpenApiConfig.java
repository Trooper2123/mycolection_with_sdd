package br.com.acervo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MyCollection API")
                        .description("API para gerenciamento de itens do acervo pessoal.")
                        .version("v1.0")
                        .contact(new Contact()
                                .name("Equipe MyCollection")
                                .email("suporte@mycollection.local"))
                        .license(new License()
                                .name("Uso interno")
                                .url("https://example.com/license")));
    }
}
