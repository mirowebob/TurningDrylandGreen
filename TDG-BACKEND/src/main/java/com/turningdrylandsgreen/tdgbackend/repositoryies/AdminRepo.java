package com.turningdrylandsgreen.tdgbackend.repositoryies;

import com.turningdrylandsgreen.tdgbackend.dto.ProblemLoading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepo extends JpaRepository<ProblemLoading, Integer> {
}
