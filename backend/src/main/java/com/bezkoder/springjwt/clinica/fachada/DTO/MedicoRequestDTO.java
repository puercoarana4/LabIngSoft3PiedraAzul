package com.bezkoder.springjwt.clinica.fachada.DTO;

import java.time.LocalDate;

import jakarta.validation.constraints.*;

public record MedicoRequestDTO(
    @NotBlank @Pattern(regexp = "\\d{6,12}", message = "La cédula debe tener entre 6 y 12 dígitos") String cedula,
    @NotBlank @Size(max = 60) String nombres,
    @NotBlank @Size(max = 60) String apellidos,
    @NotBlank @Size(max = 60) String especialidad,
    @NotNull @Min(0) @Max(60) Integer aniosTrabajando,
    @NotBlank @Size(max = 20) String genero,
    @NotNull @Past LocalDate fechaNacimiento) {
}
