package br.com.acervo.bff.controller;

import br.com.acervo.bff.dto.ItemBffRequestDTO;
import br.com.acervo.bff.dto.ItemBffResponseDTO;
import br.com.acervo.bff.dto.PageBffResponse;
import br.com.acervo.bff.service.ItemBffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

/**
 * Controller BFF — único ponto de entrada do frontend Angular.
 * Todos os endpoints ficam sob o prefixo /bff para diferenciar da API core.
 */
@RestController
@RequestMapping("/bff/itens")
@Tag(name = "BFF - Itens", description = "Endpoints do BFF para a interface Angular")
public class ItemBffController {

    private final ItemBffService service;

    public ItemBffController(ItemBffService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listar itens (BFF)", description = "Retorna lista paginada com dados enriquecidos (statusEmprestimo, labelTipoMidia)")
    public Mono<ResponseEntity<PageBffResponse<ItemBffResponseDTO>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String categoria) {
        return service.list(page, size, categoria)
                .map(ResponseEntity::ok);
    }

    @PostMapping
    @Operation(summary = "Criar item (BFF)", description = "Cadastra um novo item no acervo via BFF")
    public Mono<ResponseEntity<ItemBffResponseDTO>> create(@Valid @RequestBody ItemBffRequestDTO payload) {
        return service.create(payload)
                .map(ResponseEntity::ok);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar item (BFF)", description = "Atualiza dados de um item via BFF")
    public Mono<ResponseEntity<ItemBffResponseDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody ItemBffRequestDTO payload) {
        return service.update(id, payload)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover item (BFF)", description = "Remove ou marca como perdido um item via BFF")
    public Mono<ResponseEntity<Void>> delete(
            @PathVariable Long id,
            @RequestBody(required = false) DeleteBody body) {
        String justificativa = body != null ? body.justificativa() : null;
        return service.delete(id, justificativa)
                .thenReturn(ResponseEntity.<Void>noContent().build());
    }

    @PostMapping("/{id}/emprestar")
    @Operation(summary = "Emprestar item (BFF)", description = "Registra empréstimo de um item via BFF")
    public Mono<ResponseEntity<ItemBffResponseDTO>> emprestar(@PathVariable Long id) {
        return service.emprestar(id)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/{id}/devolver")
    @Operation(summary = "Devolver item (BFF)", description = "Registra devolução de um item via BFF")
    public Mono<ResponseEntity<ItemBffResponseDTO>> devolver(@PathVariable Long id) {
        return service.devolver(id)
                .map(ResponseEntity::ok);
    }

    /** Record auxiliar para receber o corpo opcional do DELETE. */
    record DeleteBody(String justificativa) {}
}
