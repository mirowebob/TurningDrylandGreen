package com.turningdrylandsgreen.tdgbackend.repositoryies;

import com.turningdrylandsgreen.tdgbackend.entities.AdminProfiles;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminProfileRepo extends JpaRepository<AdminProfiles, Integer> {
}
