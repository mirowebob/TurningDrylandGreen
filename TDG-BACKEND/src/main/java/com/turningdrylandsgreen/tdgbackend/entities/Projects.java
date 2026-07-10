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
public class Projects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    @Column(length = 1000)
    private String shortDescription;

    @Column(length = 10000)
    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    private String location;
    private String county;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> images;

    private String communityName;

    @Column(length = 1500)
    private String impact;

    @Column(length = 1500)
    private String outcome;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> tags;
}
