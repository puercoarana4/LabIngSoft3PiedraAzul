package com.bezkoder.springjwt.clinica.fachada.DTO;

import java.time.LocalDateTime;

public record CitaResponseDTO(Long id, Long pacienteId, String pacienteNombre, String pacienteCedula, Long medicoId,
    String medicoNombre, String especialidad, LocalDateTime fechaHora, String motivo) {
}
