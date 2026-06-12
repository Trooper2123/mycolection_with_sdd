package br.com.acervo.bff.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Contrato de entrada do BFF para criação/atualização de item.
 * Espelha o ItemRequestDTO do core-api.
 */
@Getter
@Setter
@NoArgsConstructor
public class ItemBffRequestDTO {

    @NotBlank(message = "nome é obrigatório")
    private String nome;

    @NotNull(message = "tipoMidia é obrigatório")
    private String tipoMidia;

    @NotEmpty(message = "categorias é obrigatório")
    private List<String> categorias;

    private String descricao;

    private String tags;

    private String console;
}
