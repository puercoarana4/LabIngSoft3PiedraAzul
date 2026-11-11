package com.bezkoder.springjwt.controladores;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bezkoder.springjwt.clinica.fachada.DTO.ExisteResponseDTO;
import com.bezkoder.springjwt.clinica.fachada.DTO.MedicoRequestDTO;
import com.bezkoder.springjwt.clinica.fachada.DTO.MedicoResponseDTO;
import com.bezkoder.springjwt.clinica.fachada.services.MedicoService;

/** Solo administrador (la regla esta en WebSecurityConfig). */
@RestController
@RequestMapping("/api/medicos")
public class MedicoController {

  private final MedicoService medicoService;

  public MedicoController(MedicoService medicoService) {
    this.medicoService = medicoService;
  }

  @GetMapping
  public List<MedicoResponseDTO> listar() {
    return medicoService.listar();
  }

  @PostMapping
  public ResponseEntity<MedicoResponseDTO> registrar(@Valid @RequestBody MedicoRequestDTO datos) {
    return ResponseEntity.status(HttpStatus.CREATED).body(medicoService.registrar(datos));
  }

  @GetMapping("/existe/{cedula}")
  public ExisteResponseDTO existe(@PathVariable String cedula) {
    return new ExisteResponseDTO(medicoService.existePorCedula(cedula));
  }
}
