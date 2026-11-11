package com.bezkoder.springjwt.clinica.fachada.DTO;

/** Lo que se muestra en el listado publico: sin cedula ni fecha de nacimiento. */
public record MedicoPublicoDTO(Long id, String nombres, String apellidos, String especialidad, Integer aniosTrabajando) {
}
