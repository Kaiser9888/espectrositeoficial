package com.espectro.bikes.controller;

import com.espectro.bikes.model.Video;
import com.espectro.bikes.model.Usuario;
import com.espectro.bikes.repository.VideoRepository;
import com.espectro.bikes.repository.UsuarioRepository;
import com.espectro.bikes.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin
public class VideoController {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UploadService uploadService;

    @GetMapping
    public Page<Video> listar(
            @RequestParam(required = false) String modalidade,
            @RequestParam(defaultValue = "0") int pagina) {

        PageRequest pageRequest = PageRequest.of(pagina, 12);

        if (modalidade != null && !modalidade.equals("todos")) {
            return videoRepository.findByModalidade(modalidade, pageRequest);
        }

        return videoRepository.findAllOrderByDataPublicacaoDesc(pageRequest);
    }

    @GetMapping("/recentes")
    public List<Video> getRecentes() {
        return videoRepository.findTop10ByOrderByDataPublicacaoDesc();
    }

    @GetMapping("/populares")
    public List<Video> getPopulares() {
        return videoRepository.findTop10ByOrderByVisualizacoesDesc();
    }

    @PostMapping
    public ResponseEntity<Video> upload(
            @RequestParam("video") MultipartFile video,
            @RequestParam("thumbnail") MultipartFile thumbnail,
            @RequestParam("titulo") String titulo,
            @RequestParam("descricao") String descricao,
            @RequestParam("modalidade") String modalidade,
            @AuthenticationPrincipal UserDetails userDetails) {

        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Salvar arquivos
        String videoUrl = uploadService.salvarVideo(video);
        String thumbUrl = uploadService.salvarImagem(thumbnail);

        Video novoVideo = new Video();
        novoVideo.setTitulo(titulo);
        novoVideo.setDescricao(descricao);
        novoVideo.setUrl(videoUrl);
        novoVideo.setThumbnail(thumbUrl);
        novoVideo.setModalidade(modalidade);
        novoVideo.setUsuario(usuario);

        videoRepository.save(novoVideo);

        return ResponseEntity.ok(novoVideo);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeVideo(@PathVariable Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vídeo não encontrado"));

        video.setLikes(video.getLikes() + 1);
        videoRepository.save(video);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<?> viewVideo(@PathVariable Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vídeo não encontrado"));

        video.setVisualizacoes(video.getVisualizacoes() + 1);
        videoRepository.save(video);

        return ResponseEntity.ok().build();
    }
}