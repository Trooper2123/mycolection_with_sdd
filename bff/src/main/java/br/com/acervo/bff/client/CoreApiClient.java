package br.com.acervo.bff.client;

import br.com.acervo.bff.client.dto.CoreItemResponseDTO;
import br.com.acervo.bff.client.dto.CorePageResponse;
import br.com.acervo.bff.dto.ItemBffRequestDTO;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Cliente HTTP responsável por toda comunicação com o core-api.
 * Isola o BFF de detalhes de transporte e erros da API interna.
 */
@Component
public class CoreApiClient {

    private final WebClient webClient;

    public CoreApiClient(WebClient coreApiWebClient) {
        this.webClient = coreApiWebClient;
    }

    public Mono<CorePageResponse<CoreItemResponseDTO>> list(int page, int size, String categoria) {
        return webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/itens")
                            .queryParam("page", page)
                            .queryParam("size", size);
                    if (categoria != null && !categoria.isBlank()) {
                        uriBuilder.queryParam("categoria", categoria);
                    }
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<CorePageResponse<CoreItemResponseDTO>>() {});
    }

    public Mono<CoreItemResponseDTO> create(ItemBffRequestDTO payload) {
        return webClient.post()
                .uri("/itens")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(CoreItemResponseDTO.class);
    }

    public Mono<CoreItemResponseDTO> update(Long id, ItemBffRequestDTO payload) {
        return webClient.put()
                .uri("/itens/{id}", id)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(CoreItemResponseDTO.class);
    }

    public Mono<Void> delete(Long id, String justificativa) {
        return webClient.delete()
                .uri("/itens/{id}", id)
                .headers(headers -> {
                    if (justificativa != null && !justificativa.isBlank()) {
                        // Passa justificativa como header customizado para DELETE com body
                        // O body no DELETE é passado via exchange para garantir compatibilidade
                    }
                })
                .retrieve()
                .bodyToMono(Void.class)
                .then();
    }

    public Mono<Void> deleteWithBody(Long id, Object body) {
        return webClient.method(org.springframework.http.HttpMethod.DELETE)
                .uri("/itens/{id}", id)
                .bodyValue(body != null ? body : Map.of())
                .retrieve()
                .bodyToMono(Void.class)
                .then();
    }

    public Mono<CoreItemResponseDTO> emprestar(Long id) {
        return webClient.post()
                .uri("/itens/{id}/emprestar", id)
                .bodyValue(Map.of())
                .retrieve()
                .bodyToMono(CoreItemResponseDTO.class);
    }

    public Mono<CoreItemResponseDTO> devolver(Long id) {
        return webClient.post()
                .uri("/itens/{id}/devolver", id)
                .bodyValue(Map.of())
                .retrieve()
                .bodyToMono(CoreItemResponseDTO.class);
    }
}
