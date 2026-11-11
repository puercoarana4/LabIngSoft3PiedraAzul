package com.bezkoder.springjwt.clinica.fachada.DTO;

import java.time.LocalDate;

public record MedicoResponseDTO(Long id, String cedula, String nombres, String apellidos, String especialidad,
    Integer aniosTrabajando, String genero, LocalDate fechaNacimiento) {
}
