package com.oddjobs.dtos.responses;
import com.oddjobs.entities.Image;
import lombok.Data;
import java.io.Serializable;

@Data
public class ImageResponseDto implements Serializable {
    private Long id;
    private String name;
    private String content;
    private String fileType;

    public ImageResponseDto(Image image){
        setId(image.getId());
        setName(image.getName());
        setFileType(image.getFileType());
        setContent(image.getContent());
    }
}
