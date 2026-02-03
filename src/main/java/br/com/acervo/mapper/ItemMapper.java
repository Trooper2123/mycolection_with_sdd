package br.com.acervo.mapper;

import br.com.acervo.dto.ItemRequestDTO;
import br.com.acervo.dto.ItemResponseDTO;
import br.com.acervo.model.Item;

import java.util.ArrayList;
import java.util.List;

public class ItemMapper {

    public static Item toEntity(ItemRequestDTO dto) {
        Item it = new Item();
        it.setNome(dto.getNome());
        it.setTipoMidia(dto.getTipoMidia());
        it.setCategorias(dto.getCategorias());
        it.setDescricao(dto.getDescricao());
        it.setTags(dto.getTags());
        it.setConsole(dto.getConsole());
        return it;
    }

    public static void updateEntityFromDTO(ItemRequestDTO dto, Item entity) {
        if (dto.getNome() != null) entity.setNome(dto.getNome());
        if (dto.getTipoMidia() != null) entity.setTipoMidia(dto.getTipoMidia());
        if (dto.getCategorias() != null) entity.setCategorias(dto.getCategorias());
        if (dto.getDescricao() != null) entity.setDescricao(dto.getDescricao());
        if (dto.getTags() != null) entity.setTags(dto.getTags());
        if (dto.getConsole() != null) entity.setConsole(dto.getConsole());
    }

    public static ItemResponseDTO toDTO(Item entity) {
        ItemResponseDTO dto = new ItemResponseDTO();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        dto.setTipoMidia(entity.getTipoMidia());
        dto.setCategorias(entity.getCategorias());
        dto.setDescricao(entity.getDescricao());
        dto.setTags(entity.getTags());
        dto.setConsole(entity.getConsole());
        dto.setDataRetirada(entity.getDataRetirada());
        dto.setDataDevolucao(entity.getDataDevolucao());
        return dto;
    }

    public static List<ItemResponseDTO> toDTOList(List<Item> items) {
        List<ItemResponseDTO> list = new ArrayList<>();
        for (Item it : items) list.add(toDTO(it));
        return list;
    }
}
