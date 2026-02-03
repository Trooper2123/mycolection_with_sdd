package br.com.acervo.controller;

import br.com.acervo.dto.ItemRequestDTO;
import br.com.acervo.dto.ItemResponseDTO;
import br.com.acervo.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/itens")
public class ItemController {

    @Autowired
    private ItemService service;

    @PostMapping
    public ResponseEntity<ItemResponseDTO> create(@Valid @RequestBody ItemRequestDTO dto) {
        ItemResponseDTO resp = service.create(dto);
        return ResponseEntity.ok(resp);
    }

    @GetMapping
    public ResponseEntity<Page<ItemResponseDTO>> list(@RequestParam(required = false) String categoria,
                                                      @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(service.list(categoria, pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ItemRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/emprestar")
    public ResponseEntity<ItemResponseDTO> emprestar(@PathVariable Long id) {
        return ResponseEntity.ok(service.emprestar(id));
    }

    @PostMapping("/{id}/devolver")
    public ResponseEntity<ItemResponseDTO> devolver(@PathVariable Long id) {
        return ResponseEntity.ok(service.devolver(id));
    }
}
