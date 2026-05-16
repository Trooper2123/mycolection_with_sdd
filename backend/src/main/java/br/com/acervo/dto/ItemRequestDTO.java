package br.com.acervo.dto;

import br.com.acervo.model.TipoMidia;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

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

    // getters and setters

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public TipoMidia getTipoMidia() {
        return tipoMidia;
    }

    public void setTipoMidia(TipoMidia tipoMidia) {
        this.tipoMidia = tipoMidia;
    }

    public List<String> getCategorias() {
        return categorias;
    }

    public void setCategorias(List<String> categorias) {
        this.categorias = categorias;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getConsole() {
        return console;
    }

    public void setConsole(String console) {
        this.console = console;
    }
}
