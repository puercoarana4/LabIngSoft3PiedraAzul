package com.bezkoder.springjwt.clinica.fachada.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bezkoder.springjwt.clinica.accesoADatos.entidades.Cita;
import com.bezkoder.springjwt.clinica.accesoADatos.entidades.Medico;
import com.bezkoder.springjwt.clinica.accesoADatos.entidades.Paciente;
import com.bezkoder.springjwt.clinica.accesoADatos.repositorios.CitaRepository;
import com.bezkoder.springjwt.clinica.accesoADatos.repositorios.MedicoRepository;
import com.bezkoder.springjwt.clinica.accesoADatos.repositorios.PacienteRepository;
import com.bezkoder.springjwt.clinica.fachada.DTO.CitaRequestDTO;
import com.bezkoder.springjwt.clinica.fachada.DTO.CitaResponseDTO;
import com.bezkoder.springjwt.clinica.fachada.excepciones.RecursoNoEncontradoException;

@Service
public class CitaService {

  private final CitaRepository citaRepository;
  private final PacienteRepository pacienteRepository;
  private final MedicoRepository medicoRepository;

  public CitaService(CitaRepository citaRepository, PacienteRepository pacienteRepository,
      MedicoRepository medicoRepository) {
    this.citaRepository = citaRepository;
    this.pacienteRepository = pacienteRepository;
    this.medicoRepository = medicoRepository;
  }

  @Transactional
  public CitaResponseDTO crear(CitaRequestDTO datos) {
    Paciente paciente = pacienteRepository.findById(datos.pacienteId())
        .orElseThrow(() -> new RecursoNoEncontradoException("No existe el paciente " + datos.pacienteId()));
    Medico medico = medicoRepository.findById(datos.medicoId())
        .orElseThrow(() -> new RecursoNoEncontradoException("No existe el médico " + datos.medicoId()));

    Cita cita = new Cita();
    cita.setPaciente(paciente);
    cita.setMedico(medico);
    cita.setFechaHora(datos.fechaHora());
    cita.setMotivo(datos.motivo());
    return aDto(citaRepository.save(cita));
  }

  @Transactional(readOnly = true)
  public List<CitaResponseDTO> listarTodas() {
    return citaRepository.findAllByOrderByFechaHoraDesc().stream().map(this::aDto).toList();
  }

  /** Solo devuelve las citas del paciente dueño de la cuenta que hizo la peticion. */
  @Transactional(readOnly = true)
  public List<CitaResponseDTO> listarDelPaciente(String username) {
    Paciente paciente = pacienteRepository.findByUsuarioUsername(username)
        .orElseThrow(() -> new RecursoNoEncontradoException("El usuario no tiene un paciente asociado"));
    return citaRepository.findByPacienteIdOrderByFechaHoraDesc(paciente.getId()).stream().map(this::aDto).toList();
  }

  private CitaResponseDTO aDto(Cita c) {
    Paciente p = c.getPaciente();
    Medico m = c.getMedico();
    return new CitaResponseDTO(c.getId(), p.getId(), p.getNombres() + " " + p.getApellidos(), p.getCedula(),
        m.getId(), "Dr(a). " + m.getNombres() + " " + m.getApellidos(), m.getEspecialidad(), c.getFechaHora(),
        c.getMotivo());
  }
}
