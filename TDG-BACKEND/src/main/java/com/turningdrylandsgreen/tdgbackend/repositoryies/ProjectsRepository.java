package com.turningdrylandsgreen.tdgbackend.repositoryies;

import com.turningdrylandsgreen.tdgbackend.entities.Projects;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectsRepository extends JpaRepository<Projects, Integer> {
}
