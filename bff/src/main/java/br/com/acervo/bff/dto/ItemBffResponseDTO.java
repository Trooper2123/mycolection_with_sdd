package br.com.acervo.bff.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Contrato de saída do BFF para o frontend Angular.
 * Contém todos os campos do core-api mais campos derivados de apresentação.
 */
@Getter
@Setter
@NoArgsConstructor
public class ItemBffResponseDTO {

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

    /**
     * Campo derivado para o frontend.
     * Valores: "Disponível", "Emprestado", "Perdido"
     */
    private String statusEmprestimo;

    /**
     * Campo derivado para o frontend.
     * Valores: "Livro", "Quadrinho", "Mangá", "Jogo"
     */
    private String labelTipoMidia;
}
