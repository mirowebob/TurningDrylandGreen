package com.turningdrylandsgreen.tdgbackend.controllers;

import com.turningdrylandsgreen.tdgbackend.entities.*;
import com.turningdrylandsgreen.tdgbackend.services.AdminServices;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Public-facing controller. No admin credentials required.
 * Used by the public-facing section/pages to fetch data from the database.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PublicController {

    private final AdminServices adminServices;

    @GetMapping("/problems")
    @Operation(summary = "Public endpoint to retrieve all problem entries")
    public ResponseEntity<List<ProblemImages>> getProblems() {
        return new ResponseEntity<>(adminServices.getAllProblems(), HttpStatus.OK);
    }

    @GetMapping("/projects")
    @Operation(summary = "Public endpoint to retrieve all projects")
    public ResponseEntity<List<Projects>> getProjects() {
        return new ResponseEntity<>(adminServices.getAllProjects(), HttpStatus.OK);
    }

    @GetMapping("/testimonials")
    @Operation(summary = "Public endpoint to retrieve all testimonials")
    public ResponseEntity<List<Testimonials>> getTestimonials() {
        return new ResponseEntity<>(adminServices.getAllTestimonials(), HttpStatus.OK);
    }
}
