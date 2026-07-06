package com.turningdrylandsgreen.tdgbackend.repositoryies;

import com.turningdrylandsgreen.tdgbackend.entities.Testimonials;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestimonialsRepo extends JpaRepository<Testimonials, Integer> {
}
