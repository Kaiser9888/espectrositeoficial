package com.espectro.bikes.repository;

import com.espectro.bikes.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    Page<Produto> findByCategoria(String categoria, Pageable pageable);

    Page<Produto> findByVendedorId(Long vendedorId, Pageable pageable);

    @Query("SELECT p FROM Produto p WHERE " +
           "LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(p.descricao) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(p.marca) LIKE LOWER(CONCAT('%', :termo, '%'))")
    Page<Produto> buscar(@Param("termo") String termo, Pageable pageable);

    @Query("SELECT p FROM Produto p WHERE p.dataDestaque IS NOT NULL")
    List<Produto> findProdutosEmDestaque();

    List<Produto> findTop10ByOrderByViewsDesc();

    List<Produto> findTop10ByOrderByDataCriacaoDesc();
}