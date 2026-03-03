package com.espectro.bikes.controller;

import com.espectro.bikes.model.Produto;
import com.espectro.bikes.model.Usuario;
import com.espectro.bikes.repository.ProdutoRepository;
import com.espectro.bikes.repository.UsuarioRepository;
import com.espectro.bikes.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UploadService uploadService;

    @GetMapping
    public Page<Produto> listar(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "20") int tamanho,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String ordenar) {

        PageRequest pageRequest = PageRequest.of(pagina, tamanho,
                Sort.by(Sort.Direction.DESC, "dataCriacao"));

        if (categoria != null) {
            return produtoRepository.findByCategoria(categoria, pageRequest);
        }

        return produtoRepository.findAll(pageRequest);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> getById(@PathVariable Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        // Incrementar visualizações
        produto.setViews(produto.getViews() + 1);
        produtoRepository.save(produto);

        return ResponseEntity.ok(produto);
    }

    @PostMapping
    public ResponseEntity<Produto> criar(
            @RequestParam("nome") String nome,
            @RequestParam("preco") Double preco,
            @RequestParam("categoria") String categoria,
            @RequestParam("descricao") String descricao,
            @RequestParam("condicao") String condicao,
            @RequestParam(value = "imagens", required = false) List<MultipartFile> imagens,
            @AuthenticationPrincipal UserDetails userDetails) {

        Usuario vendedor = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Produto produto = new Produto();
        produto.setNome(nome);
        produto.setPreco(preco);
        produto.setCategoria(categoria);
        produto.setDescricao(descricao);
        produto.setCondicao(condicao);
        produto.setVendedor(vendedor);

        // Upload das imagens
        if (imagens != null && !imagens.isEmpty()) {
            List<String> urls = new ArrayList<>();
            for (MultipartFile imagem : imagens) {
                String url = uploadService.salvarImagem(imagem);
                urls.add(url);
            }
            produto.setImagens(urls);
        }

        produtoRepository.save(produto);

        return ResponseEntity.ok(produto);
    }

    @GetMapping("/busca")
    public Page<Produto> buscar(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int pagina) {
        return produtoRepository.buscar(q, PageRequest.of(pagina, 20));
    }

    @GetMapping("/destaques")
    public List<Produto> getDestaques() {
        return produtoRepository.findProdutosEmDestaque();
    }
}