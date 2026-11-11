package com.bezkoder.springjwt.clinica.accesoADatos.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bezkoder.springjwt.clinica.accesoADatos.entidades.Cita;

public interface CitaRepository extends JpaRepository<Cita, Long> {
  List<Cita> findAllByOrderByFechaHoraDesc();

  List<Cita> findByPacienteIdOrderByFechaHoraDesc(Long pacienteId);
}
