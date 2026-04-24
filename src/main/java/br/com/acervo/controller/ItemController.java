package br.com.acervo.controller;

import br.com.acervo.dto.ItemRequestDTO;
import br.com.acervo.dto.ItemResponseDTO;
import br.com.acervo.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/itens")
@Tag(name = "Itens", description = "Operacoes de cadastro e controle de emprestimos")
public class ItemController {

    @Autowired
    private ItemService service;

    @PostMapping
    @Operation(summary = "Criar item", description = "Cadastra um novo item no acervo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item criado com sucesso",
                    content = @Content(schema = @Schema(implementation = ItemResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados invalidos")
    })
    public ResponseEntity<ItemResponseDTO> create(@Valid @RequestBody ItemRequestDTO dto) {
        ItemResponseDTO resp = service.create(dto);
        return ResponseEntity.ok(resp);
    }

    @GetMapping
    @Operation(summary = "Listar itens", description = "Lista itens com filtro opcional por categoria e paginacao")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Itens listados com sucesso")
    })
    public ResponseEntity<Page<ItemResponseDTO>> list(@RequestParam(required = false) String categoria,
                                                      @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(service.list(categoria, pageable));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar item", description = "Atualiza os dados de um item existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = ItemResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Item nao encontrado"),
            @ApiResponse(responseCode = "400", description = "Dados invalidos")
    })
    public ResponseEntity<ItemResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ItemRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover item", description = "Remove um item do acervo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Item removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Item nao encontrado")
    })
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/emprestar")
    @Operation(summary = "Emprestar item", description = "Marca um item como emprestado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item emprestado com sucesso",
                    content = @Content(schema = @Schema(implementation = ItemResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Item nao encontrado"),
            @ApiResponse(responseCode = "400", description = "Regra de negocio violada")
    })
    public ResponseEntity<ItemResponseDTO> emprestar(@PathVariable Long id) {
        return ResponseEntity.ok(service.emprestar(id));
    }

    @PostMapping("/{id}/devolver")
    @Operation(summary = "Devolver item", description = "Registra a devolucao de um item emprestado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item devolvido com sucesso",
                    content = @Content(schema = @Schema(implementation = ItemResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Item nao encontrado"),
            @ApiResponse(responseCode = "400", description = "Regra de negocio violada")
    })
    public ResponseEntity<ItemResponseDTO> devolver(@PathVariable Long id) {
        return ResponseEntity.ok(service.devolver(id));
    }
}
