package com.turningdrylandsgreen.tdgbackend.repositoryies;

import com.turningdrylandsgreen.tdgbackend.entities.ProblemImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepo extends JpaRepository<ProblemImages, Integer> {
}
