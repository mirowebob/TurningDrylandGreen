package com.turningdrylandsgreen.tdgbackend.controllers;

import com.turningdrylandsgreen.tdgbackend.dto.AdminProfile;
import com.turningdrylandsgreen.tdgbackend.dto.ProjectsCreationDTO;
import com.turningdrylandsgreen.tdgbackend.dto.TestimonialDTO;
import com.turningdrylandsgreen.tdgbackend.services.AdminServices;
import com.turningdrylandsgreen.tdgbackend.services.CloudinaryService;
import com.turningdrylandsgreen.tdgbackend.dto.ProblemLoading;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.turningdrylandsgreen.tdgbackend.entities.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@Slf4j
public class AdminControllers {

    private final AdminServices adminServices;

    @PostMapping(value = "/register-problem", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "endpoint to register new TDG problem")
    public ResponseEntity<?> createProblem(@ModelAttribute ProblemLoading problemLoading){
        log.info("in the registration controller");
        return new ResponseEntity<>(adminServices.createProblem(problemLoading),HttpStatus.OK);
    }

    @PostMapping(value = "/create-profile", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "endpoint to create a profile and message for admin")
    public ResponseEntity<?> createAdminWithMessage(@ModelAttribute AdminProfile profile){
        log.info("in the profile controller");
        return new ResponseEntity<HttpStatus>(adminServices.createAdminWithMessage(profile),HttpStatus.OK);
    }

    @PostMapping(value = "/add-project", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "endpoint to add th projects")
    public ResponseEntity<?> addProject(@ModelAttribute ProjectsCreationDTO dto){
        return new ResponseEntity<HttpStatus>(adminServices.createProject(dto), HttpStatus.OK);
    }

    @Operation(summary = "endpoint to add community testimonials")
    @PostMapping(value = "/add-testimonials")
    public ResponseEntity<HttpStatus> addTestimonial(@RequestBody TestimonialDTO testimonialDTO){
        return new ResponseEntity<>(adminServices.createTestimonial(testimonialDTO), HttpStatus.OK);
    }

    // --- Projects CRUD ---
    @GetMapping("/projects")
    @Operation(summary = "endpoint to get all projects")
    public ResponseEntity<List<Projects>> getAllProjects() {
        return new ResponseEntity<>(adminServices.getAllProjects(), HttpStatus.OK);
    }

    @GetMapping("/projects/{id}")
    @Operation(summary = "endpoint to get project by id")
    public ResponseEntity<Projects> getProjectById(@PathVariable int id) {
        return new ResponseEntity<>(adminServices.getProjectById(id), HttpStatus.OK);
    }

    @PutMapping(value = "/projects/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "endpoint to update a project")
    public ResponseEntity<Projects> updateProject(@PathVariable int id, @ModelAttribute ProjectsCreationDTO dto) {
        return new ResponseEntity<>(adminServices.updateProject(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/projects/{id}")
    @Operation(summary = "endpoint to delete a project")
    public ResponseEntity<Void> deleteProject(@PathVariable int id) {
        adminServices.deleteProject(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // --- Problems CRUD ---
    @GetMapping("/problems")
    @Operation(summary = "endpoint to get all problems")
    public ResponseEntity<List<ProblemImages>> getAllProblems() {
        return new ResponseEntity<>(adminServices.getAllProblems(), HttpStatus.OK);
    }

    @GetMapping("/problems/{id}")
    @Operation(summary = "endpoint to get problem by id")
    public ResponseEntity<ProblemImages> getProblemById(@PathVariable int id) {
        return new ResponseEntity<>(adminServices.getProblemById(id), HttpStatus.OK);
    }

    @PutMapping(value = "/problems/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "endpoint to update a problem")
    public ResponseEntity<ProblemImages> updateProblem(@PathVariable int id, @ModelAttribute ProblemLoading dto) {
        return new ResponseEntity<>(adminServices.updateProblem(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/problems/{id}")
    @Operation(summary = "endpoint to delete a problem")
    public ResponseEntity<Void> deleteProblem(@PathVariable int id) {
        adminServices.deleteProblem(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // --- Admin Profile CRUD ---
    @GetMapping("/profiles")
    @Operation(summary = "endpoint to get all admin profiles")
    public ResponseEntity<List<AdminProfiles>> getAllProfiles() {
        return new ResponseEntity<>(adminServices.getAllProfiles(), HttpStatus.OK);
    }

    @GetMapping("/profiles/{id}")
    @Operation(summary = "endpoint to get admin profile by id")
    public ResponseEntity<AdminProfiles> getProfileById(@PathVariable int id) {
        return new ResponseEntity<>(adminServices.getProfileById(id), HttpStatus.OK);
    }

    @PutMapping(value = "/profiles/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "endpoint to update admin profile")
    public ResponseEntity<AdminProfiles> updateProfile(@PathVariable int id, @ModelAttribute AdminProfile dto) {
        return new ResponseEntity<>(adminServices.updateProfile(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/profiles/{id}")
    @Operation(summary = "endpoint to delete admin profile")
    public ResponseEntity<Void> deleteProfile(@PathVariable int id) {
        adminServices.deleteProfile(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // --- Testimonials CRUD ---
    @GetMapping("/testimonials")
    @Operation(summary = "endpoint to get all testimonials")
    public ResponseEntity<List<Testimonials>> getAllTestimonials() {
        return new ResponseEntity<>(adminServices.getAllTestimonials(), HttpStatus.OK);
    }

    @GetMapping("/testimonials/{id}")
    @Operation(summary = "endpoint to get testimonial by id")
    public ResponseEntity<Testimonials> getTestimonialById(@PathVariable int id) {
        return new ResponseEntity<>(adminServices.getTestimonialById(id), HttpStatus.OK);
    }

    @PutMapping("/testimonials/{id}")
    @Operation(summary = "endpoint to update testimonial")
    public ResponseEntity<Testimonials> updateTestimonial(@PathVariable int id, @RequestBody TestimonialDTO dto) {
        return new ResponseEntity<>(adminServices.updateTestimonial(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/testimonials/{id}")
    @Operation(summary = "endpoint to delete testimonial")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable int id) {
        adminServices.deleteTestimonial(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
