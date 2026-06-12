package br.com.acervo.bff.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Wrapper de paginação genérico para o BFF.
 * Espelha a estrutura Page do Spring Data retornada pelo core-api.
 */
@Getter
@Setter
@NoArgsConstructor
public class PageBffResponse<T> {

    private List<T> content;
    private long totalElements;
    private int totalPages;
    private int size;
    private int number;
}
