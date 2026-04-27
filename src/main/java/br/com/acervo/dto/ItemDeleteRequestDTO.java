package br.com.acervo.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Dados opcionais para remocao de item")
public class ItemDeleteRequestDTO {

    @Schema(description = "Justificativa obrigatoria quando o item estiver emprestado", example = "Item nao foi devolvido pelo responsavel")
    private String justificativa;

    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }
}
