package com.turningdrylandsgreen.tdgbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Projects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    @Column(length = 5000)
    private String description;
    private ProjectStatus status;
    private String location;
    private String county;
    private List<String> images;
    private String communityName;
    @Column(length = 1500)
    private String impact;
    @Column(length = 1500)
    private String outcome;
    private List<String> tags;
}
