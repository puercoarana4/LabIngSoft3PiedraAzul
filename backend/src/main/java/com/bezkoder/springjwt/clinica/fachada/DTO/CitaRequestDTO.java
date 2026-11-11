package com.bezkoder.springjwt.clinica.fachada.DTO;

import java.time.LocalDateTime;

import jakarta.validation.constraints.*;

public record CitaRequestDTO(
    @NotNull Long pacienteId,
    @NotNull Long medicoId,
    @NotNull @Future LocalDateTime fechaHora,
    @NotBlank @Size(max = 200) String motivo) {
}
