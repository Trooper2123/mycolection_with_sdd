package br.com.acervo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "itens")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Enumerated(EnumType.STRING)
    private TipoMidia tipoMidia;

    @ElementCollection
    @CollectionTable(name = "item_categorias", joinColumns = @JoinColumn(name = "item_id"))
    @Column(name = "categoria")
    private List<String> categorias;

    @Column(length = 2000)
    private String descricao;

    private String tags;

    private String console;

    private LocalDate dataRetirada;

    private LocalDate dataDevolucao;

    private Boolean perdido = false;

    @Column(length = 2000)
    private String justificativaPerda;
}
