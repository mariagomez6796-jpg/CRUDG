package com.example.CRUDG.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.CRUDG.entity.Doctor;
import com.example.CRUDG.repository.DoctorRepository;



@Service

public class DoctorService {
    @Autowired
    DoctorRepository doctorRepository;

    @Autowired
    private PasswordService passwordService;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    public Doctor saveOrUpdate(Doctor doctor) {
        // Hash the password before saving or updating
        doctor.setPassword(passwordService.hashPassword(doctor.getPassword()));
        return doctorRepository.save(doctor);
    }

    public void delete(Long id) {
        doctorRepository.deleteById(id);
    }

    public Optional<Doctor> findByEmail(String email) {
    return doctorRepository.findByEmail(email);
}


    
}
