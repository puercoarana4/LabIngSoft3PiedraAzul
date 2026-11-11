package com.bezkoder.springjwt.clinica.fachada.DTO;

import java.time.LocalDate;

public record PacienteResponseDTO(Long id, String cedula, String nombres, String apellidos, String email,
    String telefono, LocalDate fechaNacimiento) {
}
