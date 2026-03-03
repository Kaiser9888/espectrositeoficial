package com.espectro.bikes.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class UploadService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String salvarImagem(MultipartFile arquivo) {
        return salvarArquivo(arquivo, "imagens");
    }

    public String salvarVideo(MultipartFile arquivo) {
        return salvarArquivo(arquivo, "videos");
    }

    private String salvarArquivo(MultipartFile arquivo, String tipo) {
        try {
            // Criar diretório se não existir
            Path diretorio = Paths.get(uploadDir, tipo);
            Files.createDirectories(diretorio);

            // Gerar nome único
            String nomeOriginal = arquivo.getOriginalFilename();
            String extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
            String nomeArquivo = UUID.randomUUID().toString() + extensao;

            // Caminho completo
            Path caminho = diretorio.resolve(nomeArquivo);

            // Salvar arquivo
            Files.copy(arquivo.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);

            // Retornar URL pública
            return "/uploads/" + tipo + "/" + nomeArquivo;

        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage());
        }
    }

    public void deletarArquivo(String caminho) {
        try {
            Path arquivo = Paths.get(uploadDir, caminho.replace("/uploads/", ""));
            Files.deleteIfExists(arquivo);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao deletar arquivo: " + e.getMessage());
        }
    }
}