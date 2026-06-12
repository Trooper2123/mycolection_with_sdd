package br.com.acervo.bff.client.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * DTO interno utilizado para deserializar a resposta do core-api.
 * Isolado no pacote client para não vazar para outras camadas do BFF.
 */
@Getter
@Setter
@NoArgsConstructor
public class CoreItemResponseDTO {

    private Long id;
    private String nome;
    private String tipoMidia;
    private List<String> categorias;
    private String descricao;
    private String tags;
    private String console;
    private String dataRetirada;
    private String dataDevolucao;
    private Boolean perdido;
    private String justificativaPerda;
}
