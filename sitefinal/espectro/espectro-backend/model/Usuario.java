package com.espectro.bikes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String senha;

    private String cpf;
    private String telefone;
    private String avatar;
    private String tipo; // "comprador" ou "vendedor"
    private String statusVendedor; // "pendente", "aprovado", "rejeitado"

    @Column(name = "data_cadastro")
    private LocalDateTime dataCadastro;

    private Integer compras = 0;
    private Integer vendas = 0;
    private Double avaliacao = 0.0;

    @OneToMany(mappedBy = "vendedor", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Produto> produtos = new ArrayList<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Endereco> enderecos = new ArrayList<>();

    @OneToMany(mappedBy = "remetente", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Mensagem> mensagensEnviadas = new ArrayList<>();

    @OneToMany(mappedBy = "destinatario", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Mensagem> mensagensRecebidas = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        dataCadastro = LocalDateTime.now();
        if (tipo == null) tipo = "comprador";
        if (avatar == null) avatar = "/uploads/avatars/default.jpg";
    }
}