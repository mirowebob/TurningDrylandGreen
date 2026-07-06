package com.turningdrylandsgreen.tdgbackend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestimonialDTO {
    private String message;
    private String name;
    private String role;
}
