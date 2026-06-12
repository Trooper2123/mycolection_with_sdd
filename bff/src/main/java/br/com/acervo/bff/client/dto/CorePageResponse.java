package br.com.acervo.bff.client.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * DTO interno para representar uma página retornada pelo core-api.
 */
@Getter
@Setter
@NoArgsConstructor
public class CorePageResponse<T> {

    private List<T> content;
    private long totalElements;
    private int totalPages;
    private int size;
    private int number;
}
