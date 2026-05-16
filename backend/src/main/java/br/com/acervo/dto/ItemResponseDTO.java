package br.com.acervo.dto;

import br.com.acervo.model.TipoMidia;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;

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

    // getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDate getDataRetirada() {
        return dataRetirada;
    }

    public void setDataRetirada(LocalDate dataRetirada) {
        this.dataRetirada = dataRetirada;
    }

    public LocalDate getDataDevolucao() {
        return dataDevolucao;
    }

    public void setDataDevolucao(LocalDate dataDevolucao) {
        this.dataDevolucao = dataDevolucao;
    }

    public Boolean getPerdido() {
        return perdido;
    }

    public void setPerdido(Boolean perdido) {
        this.perdido = perdido;
    }

    public String getJustificativaPerda() {
        return justificativaPerda;
    }

    public void setJustificativaPerda(String justificativaPerda) {
        this.justificativaPerda = justificativaPerda;
    }
}
