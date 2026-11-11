package com.bezkoder.springjwt.clinica.fachada.services;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bezkoder.springjwt.configuracionSeguridad.accesoADatos.entidades.ERole;
import com.bezkoder.springjwt.configuracionSeguridad.accesoADatos.entidades.Role;
import com.bezkoder.springjwt.configuracionSeguridad.accesoADatos.entidades.User;
import com.bezkoder.springjwt.configuracionSeguridad.accesoADatos.repositorios.RoleRepository;
import com.bezkoder.springjwt.configuracionSeguridad.accesoADatos.repositorios.UserRepository;
import com.bezkoder.springjwt.clinica.accesoADatos.entidades.Paciente;
import com.bezkoder.springjwt.clinica.accesoADatos.repositorios.PacienteRepository;
import com.bezkoder.springjwt.clinica.fachada.DTO.PacienteRequestDTO;
import com.bezkoder.springjwt.clinica.fachada.DTO.PacienteResponseDTO;
import com.bezkoder.springjwt.clinica.fachada.excepciones.RecursoDuplicadoException;

@Service
public class PacienteService {

  private final PacienteRepository pacienteRepository;
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder encoder;

  public PacienteService(PacienteRepository pacienteRepository, UserRepository userRepository,
      RoleRepository roleRepository, PasswordEncoder encoder) {
    this.pacienteRepository = pacienteRepository;
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.encoder = encoder;
  }

  @Transactional(readOnly = true)
  public List<PacienteResponseDTO> listar() {
    return pacienteRepository.findAll(Sort.by("apellidos", "nombres")).stream().map(this::aDto).toList();
  }

  public boolean existePorCedula(String cedula) {
    return pacienteRepository.existsByCedula(cedula);
  }

  /** Crea el paciente y su cuenta de acceso (usuario = cedula) con rol PACIENTE. */
  @Transactional
  public PacienteResponseDTO registrar(PacienteRequestDTO datos) {
    if (pacienteRepository.existsByCedula(datos.cedula()) || userRepository.existsByUsername(datos.cedula())) {
      throw new RecursoDuplicadoException("Ya existe un paciente con la cédula " + datos.cedula());
    }
    if (userRepository.existsByEmail(datos.email())) {
      throw new RecursoDuplicadoException("Ya existe un usuario con el correo " + datos.email());
    }

    Role rolPaciente = roleRepository.findByName(ERole.ROLE_PACIENTE)
        .orElseThrow(() -> new IllegalStateException("No existe el rol ROLE_PACIENTE"));
    User usuario = new User(datos.cedula(), datos.email(), encoder.encode(datos.password()));
    Set<Role> roles = new HashSet<>();
    roles.add(rolPaciente);
    usuario.setRoles(roles);
    userRepository.save(usuario);

    Paciente paciente = new Paciente();
    paciente.setCedula(datos.cedula());
    paciente.setNombres(datos.nombres());
    paciente.setApellidos(datos.apellidos());
    paciente.setTelefono(datos.telefono());
    paciente.setFechaNacimiento(datos.fechaNacimiento());
    paciente.setUsuario(usuario);
    return aDto(pacienteRepository.save(paciente));
  }

  private PacienteResponseDTO aDto(Paciente p) {
    return new PacienteResponseDTO(p.getId(), p.getCedula(), p.getNombres(), p.getApellidos(),
        p.getUsuario().getEmail(), p.getTelefono(), p.getFechaNacimiento());
  }
}
