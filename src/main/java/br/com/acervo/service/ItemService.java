package br.com.acervo.service;

import br.com.acervo.dto.ItemRequestDTO;
import br.com.acervo.dto.ItemResponseDTO;
import br.com.acervo.exception.BusinessException;
import br.com.acervo.exception.NotFoundException;
import br.com.acervo.mapper.ItemMapper;
import br.com.acervo.model.Item;
import br.com.acervo.model.TipoMidia;
import br.com.acervo.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository repository;

    public ItemResponseDTO create(ItemRequestDTO dto) {
        validateConsole(dto.getTipoMidia(), dto.getConsole());
        Item entity = ItemMapper.toEntity(dto);
        Item saved = repository.save(entity);
        return ItemMapper.toDTO(saved);
    }

    public ItemResponseDTO update(Long id, ItemRequestDTO dto) {
        Item item = repository.findById(id).orElseThrow(() -> new NotFoundException("Item não encontrado"));
        if (dto.getTipoMidia() != null) {
            validateConsole(dto.getTipoMidia(), dto.getConsole());
        } else if (item.getTipoMidia() == TipoMidia.JOGO) {
            // if existing type is JOGO and console removed in update
            if (dto.getConsole() == null || dto.getConsole().isBlank()) {
                throw new BusinessException("console é obrigatório para itens do tipo JOGO");
            }
        }
        ItemMapper.updateEntityFromDTO(dto, item);
        Item saved = repository.save(item);
        return ItemMapper.toDTO(saved);
    }

    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new NotFoundException("Item não encontrado"));
        repository.deleteById(id);
    }

    public Page<ItemResponseDTO> list(String categoria, Pageable pageable) {
        Page<Item> page;
        if (categoria != null && !categoria.isBlank()) {
            page = repository.findByCategoria(categoria, pageable);
        } else {
            page = repository.findAll(pageable);
        }
        return page.map(ItemMapper::toDTO);
    }

    public ItemResponseDTO emprestar(Long id) {
        Item item = repository.findById(id).orElseThrow(() -> new NotFoundException("Item não encontrado"));
        if (item.getDataRetirada() != null || item.getDataDevolucao() != null) {
            throw new BusinessException("Item já está emprestado");
        }
        LocalDate now = LocalDate.now();
        item.setDataRetirada(now);
        item.setDataDevolucao(now.plusMonths(1));
        Item saved = repository.save(item);
        return ItemMapper.toDTO(saved);
    }

    public ItemResponseDTO devolver(Long id) {
        Item item = repository.findById(id).orElseThrow(() -> new NotFoundException("Item não encontrado"));
        item.setDataRetirada(null);
        item.setDataDevolucao(null);
        Item saved = repository.save(item);
        return ItemMapper.toDTO(saved);
    }

    private void validateConsole(TipoMidia tipo, String console) {
        if (tipo == TipoMidia.JOGO) {
            if (console == null || console.isBlank()) {
                throw new BusinessException("console é obrigatório para itens do tipo JOGO");
            }
        }
    }
}
