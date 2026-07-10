package com.turningdrylandsgreen.tdgbackend.services;

import com.turningdrylandsgreen.tdgbackend.dto.AdminProfile;
import com.turningdrylandsgreen.tdgbackend.dto.ProblemLoading;
import com.turningdrylandsgreen.tdgbackend.dto.ProjectsCreationDTO;
import com.turningdrylandsgreen.tdgbackend.dto.TestimonialDTO;
import com.turningdrylandsgreen.tdgbackend.entities.*;
import com.turningdrylandsgreen.tdgbackend.repositoryies.AdminProfileRepo;
import com.turningdrylandsgreen.tdgbackend.repositoryies.AdminRepo;
import com.turningdrylandsgreen.tdgbackend.repositoryies.ProjectsRepository;
import com.turningdrylandsgreen.tdgbackend.repositoryies.TestimonialsRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServices {

    private final AdminRepo adminRepo;
    private final CloudinaryService cloudinaryService;
    private final AdminProfileRepo profileRepo;
    private final ProjectsRepository projectsRepository;
    private final TestimonialsRepo testimonialsRepo;

    public String createProblem(ProblemLoading problemLoading){

        try {
            List<String> urls = cloudinaryService.uploadMultipleFiles(problemLoading.getMultipartFileList());

            ProblemImages images = ProblemImages.builder()
                    .title(problemLoading.getProblemTitle())
                    .description(problemLoading.getProblemDescription())
                    .tag(problemLoading.getTag())
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
                    .shortDescription(projectsCreationDTO.getShortDescription())
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

    public HttpStatus createTestimonial(TestimonialDTO testimonialDTO){

        Testimonials testimonials = Testimonials.builder()
                .role(testimonialDTO.getRole())
                .name(testimonialDTO.getName())
                .message(testimonialDTO.getMessage())
                .build();

        testimonialsRepo.save(testimonials);
        return HttpStatus.OK;
    }

    // --- Projects CRUD ---
    public List<Projects> getAllProjects() {
        return projectsRepository.findAll();
    }

    public Projects getProjectById(int id) {
        return projectsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    public Projects updateProject(int id, ProjectsCreationDTO dto) {
        Projects project = getProjectById(id);

        if (dto.getTitle() != null) project.setTitle(dto.getTitle());
        if (dto.getDescription() != null) project.setDescription(dto.getDescription());
        if (dto.getLocation() != null) project.setLocation(dto.getLocation());
        if (dto.getCounty() != null) project.setCounty(dto.getCounty());
        if (dto.getCommunityName() != null) project.setCommunityName(dto.getCommunityName());
        if (dto.getImpact() != null) project.setImpact(dto.getImpact());
        if (dto.getOutcome() != null) project.setOutcome(dto.getOutcome());
        if (dto.getTags() != null) project.setTags(dto.getTags());
        if (dto.getStatus() != null) {
            project.setStatus(ProjectStatus.valueOf(dto.getStatus()));
        }

        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            try {
                List<String> urls = cloudinaryService.uploadMultipleFiles(dto.getImages());
                project.setImages(urls);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload images", e);
            }
        }

        return projectsRepository.save(project);
    }

    public void deleteProject(int id) {
        Projects project = getProjectById(id);
        projectsRepository.delete(project);
    }

    // --- Problems (ProblemImages) CRUD ---
    public List<ProblemImages> getAllProblems() {
        return adminRepo.findAll();
    }

    public ProblemImages getProblemById(int id) {
        return adminRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));
    }

    public ProblemImages updateProblem(int id, ProblemLoading dto) {
        ProblemImages problem = getProblemById(id);

        if (dto.getProblemTitle() != null) problem.setTitle(dto.getProblemTitle());
        if (dto.getProblemDescription() != null) problem.setDescription(dto.getProblemDescription());
        if (dto.getTag() != null) problem.setTag(dto.getTag());

        if (dto.getMultipartFileList() != null && !dto.getMultipartFileList().isEmpty()) {
            try {
                List<String> urls = cloudinaryService.uploadMultipleFiles(dto.getMultipartFileList());
                problem.setImageUrls(urls);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload images", e);
            }
        }

        return adminRepo.save(problem);
    }

    public void deleteProblem(int id) {
        ProblemImages problem = getProblemById(id);
        adminRepo.delete(problem);
    }

    // --- Admin Profiles CRUD ---
    public List<AdminProfiles> getAllProfiles() {
        return profileRepo.findAll();
    }

    public AdminProfiles getProfileById(int id) {
        return profileRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin Profile not found"));
    }

    public AdminProfiles updateProfile(int id, AdminProfile dto) {
        AdminProfiles profile = getProfileById(id);

        if (dto.getFullName() != null) profile.setFullName(dto.getFullName());
        if (dto.getTitle() != null) profile.setTitle(dto.getTitle());
        if (dto.getMessage() != null) profile.setMessage(dto.getMessage());

        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            try {
                String url = cloudinaryService.uploadProfileImage(dto.getImage());
                profile.setProfileImageUrl(url);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload profile image", e);
            }
        }

        return profileRepo.save(profile);
    }

    public void deleteProfile(int id) {
        AdminProfiles profile = getProfileById(id);
        profileRepo.delete(profile);
    }

    // --- Testimonials CRUD ---
    public List<Testimonials> getAllTestimonials() {
        return testimonialsRepo.findAll();
    }

    public Testimonials getTestimonialById(int id) {
        return testimonialsRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Testimonial not found"));
    }

    public Testimonials updateTestimonial(int id, TestimonialDTO dto) {
        Testimonials testimonial = getTestimonialById(id);

        if (dto.getMessage() != null) testimonial.setMessage(dto.getMessage());
        if (dto.getName() != null) testimonial.setName(dto.getName());
        if (dto.getRole() != null) testimonial.setRole(dto.getRole());

        return testimonialsRepo.save(testimonial);
    }

    public void deleteTestimonial(int id) {
        Testimonials testimonial = getTestimonialById(id);
        testimonialsRepo.delete(testimonial);
    }
}
