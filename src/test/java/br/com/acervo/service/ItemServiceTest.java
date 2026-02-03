package br.com.acervo.service;

import br.com.acervo.dto.ItemRequestDTO;
import br.com.acervo.exception.BusinessException;
import br.com.acervo.model.Item;
import br.com.acervo.model.TipoMidia;
import br.com.acervo.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ItemServiceTest {

    private ItemRepository repo;
    private ItemService service;

    @BeforeEach
    void setup() {
        repo = mock(ItemRepository.class);
        service = new ItemService();
        // inject via reflection
        var field = org.springframework.test.util.ReflectionTestUtils.getField(service, "repository");
        if (field == null) {
            org.springframework.test.util.ReflectionTestUtils.setField(service, "repository", repo);
        }
    }

    @Test
    void createGameWithoutConsoleShouldFail() {
        ItemRequestDTO dto = new ItemRequestDTO();
        dto.setNome("Zelda");
        dto.setTipoMidia(TipoMidia.JOGO);
        dto.setCategorias(List.of("Aventura"));

        BusinessException ex = assertThrows(BusinessException.class, () -> service.create(dto));
        assertEquals("console é obrigatório para itens do tipo JOGO", ex.getMessage());
    }

    @Test
    void createAndLoanFlow() {
        ItemRequestDTO dto = new ItemRequestDTO();
        dto.setNome("Zelda");
        dto.setTipoMidia(TipoMidia.JOGO);
        dto.setCategorias(List.of("Aventura"));
        dto.setConsole("Switch");

        Item saved = new Item();
        saved.setId(1L);
        saved.setNome(dto.getNome());
        saved.setTipoMidia(dto.getTipoMidia());
        saved.setCategorias(dto.getCategorias());
        saved.setConsole(dto.getConsole());

        when(repo.save(any())).thenReturn(saved);

        var resp = service.create(dto);
        assertEquals(1L, resp.getId());

        when(repo.findById(1L)).thenReturn(Optional.of(saved));
        var emprestado = service.emprestar(1L);
        assertNotNull(emprestado.getDataRetirada());
        assertNotNull(emprestado.getDataDevolucao());
        LocalDate expected = emprestado.getDataRetirada().plusMonths(1);
        assertEquals(expected, emprestado.getDataDevolucao());

        when(repo.findById(1L)).thenReturn(Optional.of(saved));
        var devolvido = service.devolver(1L);
        assertNull(devolvido.getDataRetirada());
        assertNull(devolvido.getDataDevolucao());
    }

    @Test
    void listWithCategoryUsesRepository() {
        when(repo.findByCategoria(eq("Fantasia"), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(new Item())));
        var page = service.list("Fantasia", PageRequest.of(0, 10));
        assertEquals(1, page.getTotalElements());
        verify(repo, times(1)).findByCategoria(eq("Fantasia"), any(PageRequest.class));
    }
}
