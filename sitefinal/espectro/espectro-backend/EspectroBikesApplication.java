package com.espectro.bikes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EspectroBikesApplication {
    public static void main(String[] args) {
        SpringApplication.run(EspectroBikesApplication.class, args);
        System.out.println("🚲 Espectro Bikes Backend rodando na porta 8080!");
    }
}