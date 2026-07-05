package com.turningdrylandsgreen.tdgbackend.controllers;

import com.turningdrylandsgreen.tdgbackend.services.AdminServices;
import com.turningdrylandsgreen.tdgbackend.services.CloudinaryService;
import com.turningdrylandsgreen.tdgbackend.dto.ProblemLoading;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminControllers {

    private final AdminServices adminServices;

    @PostMapping(value = "/register-problem", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "endpoint to register new TDG problem")
    public ResponseEntity<?> createProblem(@ModelAttribute ProblemLoading problemLoading){

        return new ResponseEntity<>(adminServices.createProblem(problemLoading),HttpStatus.OK);
    }

}
