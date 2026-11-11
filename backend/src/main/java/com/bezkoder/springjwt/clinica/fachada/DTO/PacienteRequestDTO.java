package com.bezkoder.springjwt.clinica.fachada.DTO;

import java.time.LocalDate;

import jakarta.validation.constraints.*;

public record PacienteRequestDTO(
    @NotBlank @Pattern(regexp = "\\d{6,12}", message = "La cédula debe tener entre 6 y 12 dígitos") String cedula,
    @NotBlank @Size(max = 60) String nombres,
    @NotBlank @Size(max = 60) String apellidos,
    @NotBlank @Email @Size(max = 50) String email,
    @NotBlank @Pattern(regexp = "\\d{7,10}", message = "El teléfono debe tener entre 7 y 10 dígitos") String telefono,
    @NotNull @Past LocalDate fechaNacimiento,
    @NotBlank @Size(min = 6, max = 40) String password) {
}
