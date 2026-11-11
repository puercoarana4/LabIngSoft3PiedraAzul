package com.bezkoder.springjwt.controladores;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bezkoder.springjwt.clinica.fachada.DTO.MedicoPublicoDTO;
import com.bezkoder.springjwt.clinica.fachada.services.MedicoService;

/** Servicios que no piden sesion. */
@RestController
@RequestMapping("/api/public")
public class PublicController {

  private final MedicoService medicoService;

  public PublicController(MedicoService medicoService) {
    this.medicoService = medicoService;
  }

  @GetMapping("/medicos")
  public List<MedicoPublicoDTO> listarMedicos() {
    return medicoService.listar().stream()
        .map(m -> new MedicoPublicoDTO(m.id(), m.nombres(), m.apellidos(), m.especialidad(), m.aniosTrabajando()))
        .toList();
  }
}
