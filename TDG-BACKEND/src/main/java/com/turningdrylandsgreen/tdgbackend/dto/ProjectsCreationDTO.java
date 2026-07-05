package com.turningdrylandsgreen.tdgbackend.dto;

import com.turningdrylandsgreen.tdgbackend.entities.ProjectStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Builder
@Data
public class ProjectsCreationDTO {
    private String title;
    private String description;
    private String status;
    private String location;
    private String county;
    private List<MultipartFile> images;
    private String communityName;
    @Schema(nullable = true)
    private String impact;
    @Schema(nullable = true)
    private String outcome;
    private List<String> tags;
}
