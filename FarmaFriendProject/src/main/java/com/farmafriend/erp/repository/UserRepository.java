package com.farmafriend.erp.repository;

import com.farmafriend.erp.constants.RoleName;
import com.farmafriend.erp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(RoleName role);
    List<User> findByRepresentative_UserId(Long representativeId);
    Optional<User> findByResetToken(String resetToken);
}
