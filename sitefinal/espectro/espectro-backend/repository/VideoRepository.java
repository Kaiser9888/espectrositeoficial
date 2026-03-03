package com.espectro.bikes.repository;

import com.espectro.bikes.model.Video;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {

    Page<Video> findByModalidade(String modalidade, Pageable pageable);

    List<Video> findTop10ByOrderByDataPublicacaoDesc();

    List<Video> findTop10ByOrderByVisualizacoesDesc();

    @Query("SELECT v FROM Video v ORDER BY v.dataPublicacao DESC")
    Page<Video> findAllOrderByDataPublicacaoDesc(Pageable pageable);
}