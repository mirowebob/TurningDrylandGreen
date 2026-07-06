package com.turningdrylandsgreen.tdgbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemImages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column
    private String tag;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> imageUrls;
}
