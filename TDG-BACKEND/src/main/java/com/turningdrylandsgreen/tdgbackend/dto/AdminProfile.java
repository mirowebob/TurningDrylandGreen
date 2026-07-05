package com.turningdrylandsgreen.tdgbackend.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
public class AdminProfile {
    private String fullName;
    private String title;
    private String Message;
    private MultipartFile image;
}
