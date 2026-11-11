package com.bezkoder.springjwt.clinica.accesoADatos.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bezkoder.springjwt.clinica.accesoADatos.entidades.Medico;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
  boolean existsByCedula(String cedula);
}
