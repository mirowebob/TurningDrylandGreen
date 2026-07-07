package com.turningdrylandsgreen.tdgbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestimonialDTO {
    private String message;
    private String name;
    private String role;
}
