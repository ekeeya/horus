package com.oddjobs.controllers;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class AssetsController {

    @GetMapping("/assets/{imageName:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String imageName) throws IOException {
        String imagePath = "static/categories/" + imageName;

        Resource resource = new ClassPathResource(imagePath);

        if (resource.exists()) {
            Path path = Paths.get(resource.getURI());
            byte[] imageBytes = Files.readAllBytes(path);
            MediaType mediaType = determineMediaType(imageName);
            return ResponseEntity.ok().contentType(mediaType).body(imageBytes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private MediaType determineMediaType(String imageName) {
        if (imageName.endsWith(".jpg") || imageName.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG;
        } else if (imageName.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        } else if (imageName.endsWith(".gif")) {
            return MediaType.IMAGE_GIF;
        } else {
            return MediaType.IMAGE_JPEG;
        }
    }
}
