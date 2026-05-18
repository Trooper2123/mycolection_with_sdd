package br.com.acervo.dto;

import br.com.acervo.model.TipoMidia;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Dados retornados de um item do acervo")
public class ItemResponseDTO {
    @Schema(description = "Identificador do item", example = "1")
    private Long id;
    @Schema(description = "Nome do item", example = "The Witcher 3")
    private String nome;
    @Schema(description = "Tipo da midia", example = "JOGO")
    private TipoMidia tipoMidia;
    @Schema(description = "Categorias do item", example = "[\"RPG\", \"Fantasia\"]")
    private List<String> categorias;
    @Schema(description = "Descricao livre do item", example = "Edicao completa com DLCs")
    private String descricao;
    @Schema(description = "Tags para busca", example = "rpg, aventura, mundo aberto")
    private String tags;
    @Schema(description = "Console/plataforma quando aplicavel", example = "PS5")
    private String console;
    @Schema(description = "Data da retirada quando emprestado", example = "2026-04-23")
    private LocalDate dataRetirada;
    @Schema(description = "Data prevista ou real de devolucao", example = "2026-05-23")
    private LocalDate dataDevolucao;
    @Schema(description = "Indica se o item foi marcado como perdido", example = "false")
    private Boolean perdido;
    @Schema(description = "Justificativa de perda, quando aplicavel", example = "Item nao foi devolvido pelo responsavel")
    private String justificativaPerda;
}

