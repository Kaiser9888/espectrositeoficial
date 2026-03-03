package com.espectro.bikes.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "produtos")
@Data
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private Double preco;

    private Double precoAntigo;

    @Column(length = 2000)
    private String descricao;

    private String categoria;
    private String subcategoria;
    private String marca;
    private String modelo;
    private Integer ano;
    private String condicao; // novo, seminovo, usado, recondicionado

    @ElementCollection
    @CollectionTable(name = "produto_imagens", joinColumns = @JoinColumn(name = "produto_id"))
    @Column(name = "imagem_url", length = 500)
    private List<String> imagens = new ArrayList<>();

    private Integer estoque;
    private Double peso;
    private Double altura;
    private Double largura;
    private Double comprimento;
    private Boolean freteGratis = false;

    @ManyToOne
    @JoinColumn(name = "vendedor_id")
    @ToString.Exclude
    private Usuario vendedor;

    private Integer views = 0;
    private Integer favoritos = 0;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    private LocalDateTime dataDestaque;

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Avaliacao> avaliacoes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        if (estoque == null) estoque = 1;
    }
}