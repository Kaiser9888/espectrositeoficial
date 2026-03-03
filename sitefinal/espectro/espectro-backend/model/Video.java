package com.espectro.bikes.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "videos")
@Data
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(length = 1000)
    private String descricao;

    @Column(nullable = false)
    private String url; // URL do vídeo

    private String thumbnail;
    private String duracao;
    private String modalidade; // downhill, speed, bmx, mtb

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @ToString.Exclude
    private Usuario usuario;

    private Integer visualizacoes = 0;
    private Integer likes = 0;
    private Integer comentarios = 0;

    @Column(name = "data_publicacao")
    private LocalDateTime dataPublicacao;

    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<ComentarioVideo> comentariosLista = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        dataPublicacao = LocalDateTime.now();
    }
}