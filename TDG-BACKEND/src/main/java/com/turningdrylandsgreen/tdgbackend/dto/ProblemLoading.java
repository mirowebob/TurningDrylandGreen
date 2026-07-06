package com.turningdrylandsgreen.tdgbackend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder

public class ProblemLoading {
    @Schema(nullable = false)
    private String problemTitle;

    @Schema(nullable = false)
    private String problemDescription;

    @Schema(nullable = true)
    private String tag;

    private List<MultipartFile> multipartFileList;

}
