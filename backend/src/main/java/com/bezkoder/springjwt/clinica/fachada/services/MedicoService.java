package com.bezkoder.springjwt.clinica.fachada.services;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.bezkoder.springjwt.clinica.accesoADatos.entidades.Medico;
import com.bezkoder.springjwt.clinica.accesoADatos.repositorios.MedicoRepository;
import com.bezkoder.springjwt.clinica.fachada.DTO.MedicoRequestDTO;
import com.bezkoder.springjwt.clinica.fachada.DTO.MedicoResponseDTO;
import com.bezkoder.springjwt.clinica.fachada.excepciones.RecursoDuplicadoException;

@Service
public class MedicoService {

  private final MedicoRepository medicoRepository;

  public MedicoService(MedicoRepository medicoRepository) {
    this.medicoRepository = medicoRepository;
  }

  public List<MedicoResponseDTO> listar() {
    return medicoRepository.findAll(Sort.by("apellidos", "nombres")).stream().map(this::aDto).toList();
  }

  public boolean existePorCedula(String cedula) {
    return medicoRepository.existsByCedula(cedula);
  }

  public MedicoResponseDTO registrar(MedicoRequestDTO datos) {
    if (medicoRepository.existsByCedula(datos.cedula())) {
      throw new RecursoDuplicadoException("Ya existe un médico con la cédula " + datos.cedula());
    }
    Medico medico = new Medico();
    medico.setCedula(datos.cedula());
    medico.setNombres(datos.nombres());
    medico.setApellidos(datos.apellidos());
    medico.setEspecialidad(datos.especialidad());
    medico.setAniosTrabajando(datos.aniosTrabajando());
    medico.setGenero(datos.genero());
    medico.setFechaNacimiento(datos.fechaNacimiento());
    return aDto(medicoRepository.save(medico));
  }

  private MedicoResponseDTO aDto(Medico m) {
    return new MedicoResponseDTO(m.getId(), m.getCedula(), m.getNombres(), m.getApellidos(), m.getEspecialidad(),
        m.getAniosTrabajando(), m.getGenero(), m.getFechaNacimiento());
  }
}
