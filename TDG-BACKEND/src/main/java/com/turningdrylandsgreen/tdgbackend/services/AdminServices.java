package com.turningdrylandsgreen.tdgbackend.services;

import com.turningdrylandsgreen.tdgbackend.dto.AdminProfile;
import com.turningdrylandsgreen.tdgbackend.dto.ProblemLoading;
import com.turningdrylandsgreen.tdgbackend.dto.ProjectsCreationDTO;
import com.turningdrylandsgreen.tdgbackend.entities.AdminProfiles;
import com.turningdrylandsgreen.tdgbackend.entities.ProblemImages;
import com.turningdrylandsgreen.tdgbackend.entities.ProjectStatus;
import com.turningdrylandsgreen.tdgbackend.entities.Projects;
import com.turningdrylandsgreen.tdgbackend.repositoryies.AdminProfileRepo;
import com.turningdrylandsgreen.tdgbackend.repositoryies.AdminRepo;
import com.turningdrylandsgreen.tdgbackend.repositoryies.ProjectsRepository;
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
    private final ProjectsRepository projectsRepository;

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

    public HttpStatus createProject(ProjectsCreationDTO projectsCreationDTO) {
        try{
            List<String> urls = cloudinaryService.uploadMultipleFiles(projectsCreationDTO.getImages());

            Projects project = Projects.builder()
                    .title(projectsCreationDTO.getTitle())
                    .location(projectsCreationDTO.getLocation())
                    .description(projectsCreationDTO.getDescription())
                    .images(urls)
                    .county(projectsCreationDTO.getCounty())
                    .impact(projectsCreationDTO.getImpact())
                    .outcome(projectsCreationDTO.getOutcome())
                    .communityName(projectsCreationDTO.getCommunityName())
                    .tags(projectsCreationDTO.getTags())
                    .status(ProjectStatus.valueOf(projectsCreationDTO.getStatus()))
                    .build();
            projectsRepository.save(project);
            return HttpStatus.OK;


        }catch (IOException e){
            return HttpStatus.BAD_REQUEST;
        }
    }
}
