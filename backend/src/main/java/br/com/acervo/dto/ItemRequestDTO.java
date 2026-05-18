package br.com.acervo.dto;

import br.com.acervo.model.TipoMidia;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Dados para criacao ou atualizacao de um item")
public class ItemRequestDTO {

    @NotBlank(message = "nome é obrigatório")
    @Schema(description = "Nome do item", example = "The Witcher 3")
    private String nome;

    @NotNull(message = "tipoMidia é obrigatório")
    @Schema(description = "Tipo da midia", example = "JOGO")
    private TipoMidia tipoMidia;

    @NotEmpty(message = "categorias é obrigatório")
    @Schema(description = "Categorias do item", example = "[\"RPG\", \"Fantasia\"]")
    private List<String> categorias;

    @Schema(description = "Descricao livre do item", example = "Edicao completa com DLCs")
    private String descricao;

    @Schema(description = "Tags para busca", example = "rpg, aventura, mundo aberto")
    private String tags;

    @Schema(description = "Console/plataforma quando aplicavel", example = "PS5")
    private String console;
}
