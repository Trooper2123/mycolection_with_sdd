package br.com.acervo.service;

import br.com.acervo.dto.ItemRequestDTO;
import br.com.acervo.exception.BusinessException;
import br.com.acervo.model.Item;
import br.com.acervo.model.TipoMidia;
import br.com.acervo.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
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

    @Test
    void deleteBorrowedItemWithoutJustificationShouldFail() {
        Item item = new Item();
        item.setId(10L);
        item.setDataRetirada(LocalDate.now());
        item.setDataDevolucao(LocalDate.now().plusDays(30));

        when(repo.findById(10L)).thenReturn(Optional.of(item));

        BusinessException ex = assertThrows(BusinessException.class, () -> service.delete(10L, null));
        assertEquals("justificativa é obrigatória para marcar item emprestado como perdido", ex.getMessage());
        verify(repo, never()).deleteById(anyLong());
        verify(repo, never()).save(any());
    }

    @Test
    void deleteBorrowedItemShouldMarkAsLostWhenJustified() {
        Item item = new Item();
        item.setId(11L);
        item.setDataRetirada(LocalDate.now());
        item.setDataDevolucao(LocalDate.now().plusDays(30));
        item.setPerdido(false);

        when(repo.findById(11L)).thenReturn(Optional.of(item));

        service.delete(11L, "Nao foi devolvido pelo responsavel");

        verify(repo, never()).deleteById(11L);
        ArgumentCaptor<Item> captor = ArgumentCaptor.forClass(Item.class);
        verify(repo, times(1)).save(captor.capture());

        Item salvo = captor.getValue();
        assertTrue(Boolean.TRUE.equals(salvo.getPerdido()));
        assertEquals("Nao foi devolvido pelo responsavel", salvo.getJustificativaPerda());
        assertNull(salvo.getDataRetirada());
        assertNull(salvo.getDataDevolucao());
    }

    @Test
    void deleteAvailableItemShouldDeleteNormally() {
        Item item = new Item();
        item.setId(12L);
        item.setDataRetirada(null);
        item.setDataDevolucao(null);

        when(repo.findById(12L)).thenReturn(Optional.of(item));

        service.delete(12L, null);

        verify(repo, times(1)).deleteById(12L);
        verify(repo, never()).save(any());
    }

    @Test
    void emprestarLostItemShouldFail() {
        Item item = new Item();
        item.setId(13L);
        item.setPerdido(true);

        when(repo.findById(13L)).thenReturn(Optional.of(item));

        BusinessException ex = assertThrows(BusinessException.class, () -> service.emprestar(13L));
        assertEquals("Item marcado como perdido não pode ser emprestado", ex.getMessage());
        verify(repo, never()).save(any());
    }
}
