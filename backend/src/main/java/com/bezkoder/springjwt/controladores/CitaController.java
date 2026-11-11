package com.bezkoder.springjwt.controladores;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.bezkoder.springjwt.clinica.fachada.DTO.CitaRequestDTO;
import com.bezkoder.springjwt.clinica.fachada.DTO.CitaResponseDTO;
import com.bezkoder.springjwt.clinica.fachada.services.CitaService;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

  private final CitaService citaService;

  public CitaController(CitaService citaService) {
    this.citaService = citaService;
  }

  /** Administrador: todas las citas. */
  @GetMapping
  public List<CitaResponseDTO> listarTodas() {
    return citaService.listarTodas();
  }

  /** Administrador: crear cita. */
  @PostMapping
  public ResponseEntity<CitaResponseDTO> crear(@Valid @RequestBody CitaRequestDTO datos) {
    return ResponseEntity.status(HttpStatus.CREATED).body(citaService.crear(datos));
  }

  /** Paciente: solo sus citas. El paciente sale del token, no de la URL. */
  @GetMapping("/mis-citas")
  public List<CitaResponseDTO> misCitas(Authentication autenticacion) {
    return citaService.listarDelPaciente(autenticacion.getName());
  }
}
