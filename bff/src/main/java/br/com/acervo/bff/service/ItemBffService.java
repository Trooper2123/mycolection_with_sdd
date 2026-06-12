package br.com.acervo.bff.service;

import br.com.acervo.bff.client.CoreApiClient;
import br.com.acervo.bff.client.dto.CoreItemResponseDTO;
import br.com.acervo.bff.client.dto.CorePageResponse;
import br.com.acervo.bff.dto.ItemBffRequestDTO;
import br.com.acervo.bff.dto.ItemBffResponseDTO;
import br.com.acervo.bff.dto.PageBffResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Camada de serviço do BFF.
 * Responsável por orquestrar chamadas ao CoreApiClient e aplicar
 * a lógica de adaptação/enriquecimento dos dados para o frontend.
 */
@Service
public class ItemBffService {

    private final CoreApiClient coreApiClient;

    public ItemBffService(CoreApiClient coreApiClient) {
        this.coreApiClient = coreApiClient;
    }

    public Mono<PageBffResponse<ItemBffResponseDTO>> list(int page, int size, String categoria) {
        return coreApiClient.list(page, size, categoria)
                .map(this::toPageBffResponse);
    }

    public Mono<ItemBffResponseDTO> create(ItemBffRequestDTO payload) {
        return coreApiClient.create(payload)
                .map(this::enrich);
    }

    public Mono<ItemBffResponseDTO> update(Long id, ItemBffRequestDTO payload) {
        return coreApiClient.update(id, payload)
                .map(this::enrich);
    }

    public Mono<Void> delete(Long id, String justificativa) {
        if (justificativa != null && !justificativa.isBlank()) {
            return coreApiClient.deleteWithBody(id, Map.of("justificativa", justificativa.trim()));
        }
        return coreApiClient.deleteWithBody(id, null);
    }

    public Mono<ItemBffResponseDTO> emprestar(Long id) {
        return coreApiClient.emprestar(id)
                .map(this::enrich);
    }

    public Mono<ItemBffResponseDTO> devolver(Long id) {
        return coreApiClient.devolver(id)
                .map(this::enrich);
    }

    // ─── Mapeamento e enriquecimento ───────────────────────────────────────────

    private PageBffResponse<ItemBffResponseDTO> toPageBffResponse(CorePageResponse<CoreItemResponseDTO> corePage) {
        PageBffResponse<ItemBffResponseDTO> page = new PageBffResponse<>();
        page.setContent(
                corePage.getContent().stream()
                        .map(this::enrich)
                        .collect(Collectors.toList())
        );
        page.setTotalElements(corePage.getTotalElements());
        page.setTotalPages(corePage.getTotalPages());
        page.setSize(corePage.getSize());
        page.setNumber(corePage.getNumber());
        return page;
    }

    /**
     * Transforma um CoreItemResponseDTO no DTO enriquecido do BFF,
     * adicionando os campos derivados de apresentação.
     */
    private ItemBffResponseDTO enrich(CoreItemResponseDTO core) {
        ItemBffResponseDTO dto = new ItemBffResponseDTO();

        dto.setId(core.getId());
        dto.setNome(core.getNome());
        dto.setTipoMidia(core.getTipoMidia());
        dto.setCategorias(core.getCategorias());
        dto.setDescricao(core.getDescricao());
        dto.setTags(core.getTags());
        dto.setConsole(core.getConsole());
        dto.setDataRetirada(core.getDataRetirada());
        dto.setDataDevolucao(core.getDataDevolucao());
        dto.setPerdido(core.getPerdido());
        dto.setJustificativaPerda(core.getJustificativaPerda());

        // Campos derivados — lógica de apresentação movida para o BFF
        dto.setStatusEmprestimo(resolveStatus(core));
        dto.setLabelTipoMidia(resolveLabelTipoMidia(core.getTipoMidia()));

        return dto;
    }

    /**
     * Determina o status legível de empréstimo com base nos campos do item.
     */
    private String resolveStatus(CoreItemResponseDTO core) {
        if (Boolean.TRUE.equals(core.getPerdido())) {
            return "Perdido";
        }
        if (core.getDataRetirada() != null || core.getDataDevolucao() != null) {
            return "Emprestado";
        }
        return "Disponível";
    }

    /**
     * Converte o enum TipoMidia em label humanizado em português.
     */
    private String resolveLabelTipoMidia(String tipoMidia) {
        if (tipoMidia == null) return "";
        return switch (tipoMidia) {
            case "LIVRO"     -> "Livro";
            case "QUADRINHO" -> "Quadrinho";
            case "MANGA"     -> "Mangá";
            case "JOGO"      -> "Jogo";
            default          -> tipoMidia;
        };
    }
}
