package com.bezkoder.springjwt.controladores;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bezkoder.springjwt.clinica.fachada.DTO.ExisteResponseDTO;
import com.bezkoder.springjwt.clinica.fachada.DTO.PacienteRequestDTO;
import com.bezkoder.springjwt.clinica.fachada.DTO.PacienteResponseDTO;
import com.bezkoder.springjwt.clinica.fachada.services.PacienteService;

/** Solo administrador (la regla esta en WebSecurityConfig). */
@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

  private final PacienteService pacienteService;

  public PacienteController(PacienteService pacienteService) {
    this.pacienteService = pacienteService;
  }

  @GetMapping
  public List<PacienteResponseDTO> listar() {
    return pacienteService.listar();
  }

  @PostMapping
  public ResponseEntity<PacienteResponseDTO> registrar(@Valid @RequestBody PacienteRequestDTO datos) {
    return ResponseEntity.status(HttpStatus.CREATED).body(pacienteService.registrar(datos));
  }

  @GetMapping("/existe/{cedula}")
  public ExisteResponseDTO existe(@PathVariable String cedula) {
    return new ExisteResponseDTO(pacienteService.existePorCedula(cedula));
  }
}
