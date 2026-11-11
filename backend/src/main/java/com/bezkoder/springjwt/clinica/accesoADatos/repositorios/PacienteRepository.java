package com.bezkoder.springjwt.clinica.accesoADatos.repositorios;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bezkoder.springjwt.clinica.accesoADatos.entidades.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
  boolean existsByCedula(String cedula);

  Optional<Paciente> findByUsuarioUsername(String username);
}
