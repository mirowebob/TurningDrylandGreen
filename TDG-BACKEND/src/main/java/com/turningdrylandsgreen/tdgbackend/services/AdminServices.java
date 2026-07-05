package com.turningdrylandsgreen.tdgbackend.services;

import com.turningdrylandsgreen.tdgbackend.dto.AdminProfile;
import com.turningdrylandsgreen.tdgbackend.dto.ProblemLoading;
import com.turningdrylandsgreen.tdgbackend.entities.AdminProfiles;
import com.turningdrylandsgreen.tdgbackend.entities.ProblemImages;
import com.turningdrylandsgreen.tdgbackend.repositoryies.AdminProfileRepo;
import com.turningdrylandsgreen.tdgbackend.repositoryies.AdminRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServices {

    private final AdminRepo adminRepo;
    private final CloudinaryService cloudinaryService;
    private final AdminProfileRepo profileRepo;

    public String createProblem(ProblemLoading problemLoading){

        try {
            List<String> urls = cloudinaryService.uploadMultipleFiles(problemLoading.getMultipartFileList());

            ProblemImages images = ProblemImages.builder()
                    .title(problemLoading.getProblemTitle())
                    .description(problemLoading.getProblemDescription())
                    .imageUrls(urls)
                    .build();
            adminRepo.save(images);
            return "problem recorded successfully";
        }catch (IOException e){
            return "Failed to upload image";
        }
    }

    public HttpStatus createAdminWithMessage(AdminProfile profile) {

        try {
            String url = cloudinaryService.uploadProfileImage(profile.getImage());

            AdminProfiles prof = AdminProfiles.builder()
                    .title(profile.getTitle())
                    .fullName(profile.getFullName())
                    .message(profile.getMessage())
                    .profileImageUrl(url)
                    .build();
            profileRepo.save(prof);
            return HttpStatus.OK;

        }catch (IOException e){
            return HttpStatus.BAD_REQUEST;
        }
    }
}
