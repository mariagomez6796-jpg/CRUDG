package com.example.CRUDG.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.example.CRUDG.entity.Admin;
import com.example.CRUDG.repository.AdminRepository;

@Service

public class AdminService {

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    private PasswordService passwordService;

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    public Admin saveOrUpdate(Admin admin) {
        // Hash the password before saving or updating
        admin.setPassword(passwordService.hashPassword(admin.getPassword()));
        return adminRepository.save(admin);
    }
    
    public void delete(Long id) {
        adminRepository.deleteById(id);
    }

    public Optional<Admin> findByEmail(String email) {
    return adminRepository.findByEmail(email);
}


}
