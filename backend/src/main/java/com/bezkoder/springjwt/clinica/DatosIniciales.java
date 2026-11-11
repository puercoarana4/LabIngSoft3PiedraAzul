package com.bezkoder.springjwt.clinica;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.bezkoder.springjwt.configuracionSeguridad.accesoADatos.entidades.ERole;
import com.bezkoder.springjwt.configuracionSeguridad.accesoADatos.entidades.Role;
import com.bezkoder.springjwt.configuracionSeguridad.accesoADatos.entidades.User;
import com.bezkoder.springjwt.configuracionSeguridad.accesoADatos.repositorios.RoleRepository;
import com.bezkoder.springjwt.configuracionSeguridad.accesoADatos.repositorios.UserRepository;
import com.bezkoder.springjwt.clinica.accesoADatos.entidades.Cita;
import com.bezkoder.springjwt.clinica.accesoADatos.entidades.Medico;
import com.bezkoder.springjwt.clinica.accesoADatos.entidades.Paciente;
import com.bezkoder.springjwt.clinica.accesoADatos.repositorios.CitaRepository;
import com.bezkoder.springjwt.clinica.accesoADatos.repositorios.MedicoRepository;
import com.bezkoder.springjwt.clinica.accesoADatos.repositorios.PacienteRepository;

/**
 * Carga los roles y los usuarios de prueba la primera vez que arranca la app.
 * Si ya existen no vuelve a crearlos.
 *
 * Administrador: admin / admin123
 * Pacientes:     1002003001 / paciente123 (3 citas)  y  1003004002 / paciente123 (1 cita)
 */
@Component
public class DatosIniciales implements ApplicationRunner {

  private final RoleRepository roleRepository;
  private final UserRepository userRepository;
  private final MedicoRepository medicoRepository;
  private final PacienteRepository pacienteRepository;
  private final CitaRepository citaRepository;
  private final PasswordEncoder encoder;

  public DatosIniciales(RoleRepository roleRepository, UserRepository userRepository,
      MedicoRepository medicoRepository, PacienteRepository pacienteRepository, CitaRepository citaRepository,
      PasswordEncoder encoder) {
    this.roleRepository = roleRepository;
    this.userRepository = userRepository;
    this.medicoRepository = medicoRepository;
    this.pacienteRepository = pacienteRepository;
    this.citaRepository = citaRepository;
    this.encoder = encoder;
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    Role rolAdmin = asegurarRol(ERole.ROLE_ADMIN);
    Role rolPaciente = asegurarRol(ERole.ROLE_PACIENTE);

    if (!userRepository.existsByUsername("admin")) {
      crearUsuario("admin", "admin@piedraazul.com", "admin123", rolAdmin);
    }

    if (medicoRepository.count() > 0) {
      return;
    }

    Medico cardiologo = crearMedico("79123456", "Carlos", "Mendoza", "Cardiología", 12, "Masculino", LocalDate.of(1980, 3, 14));
    Medico pediatra = crearMedico("52987654", "Laura", "Ramírez", "Pediatría", 8, "Femenino", LocalDate.of(1986, 7, 2));
    Medico dermatologo = crearMedico("80456123", "Andrés", "Cuéllar", "Dermatología", 5, "Masculino", LocalDate.of(1990, 11, 23));
    crearMedico("1061234567", "Marcela", "Ibarra", "Medicina general", 3, "Femenino", LocalDate.of(1994, 1, 30));

    Paciente maria = crearPaciente("1002003001", "María Fernanda", "Ortiz", "maria.ortiz@correo.com", "3101112233",
        LocalDate.of(1998, 5, 9), rolPaciente);
    Paciente juan = crearPaciente("1003004002", "Juan David", "Muñoz", "juan.munoz@correo.com", "3204445566",
        LocalDate.of(1975, 9, 18), rolPaciente);

    crearCita(maria, cardiologo, 2, 9, "Control de presión arterial");
    crearCita(maria, dermatologo, 6, 14, "Revisión de lunar en la espalda");
    crearCita(maria, pediatra, 10, 10, "Consulta por su sobrino de 4 años");
    crearCita(juan, cardiologo, 4, 11, "Electrocardiograma de rutina");
  }

  private Role asegurarRol(ERole nombre) {
    return roleRepository.findByName(nombre).orElseGet(() -> roleRepository.save(new Role(nombre)));
  }

  private User crearUsuario(String username, String email, String clave, Role rol) {
    User usuario = new User(username, email, encoder.encode(clave));
    Set<Role> roles = new HashSet<>();
    roles.add(rol);
    usuario.setRoles(roles);
    return userRepository.save(usuario);
  }

  private Medico crearMedico(String cedula, String nombres, String apellidos, String especialidad, int anios,
      String genero, LocalDate nacimiento) {
    Medico m = new Medico();
    m.setCedula(cedula);
    m.setNombres(nombres);
    m.setApellidos(apellidos);
    m.setEspecialidad(especialidad);
    m.setAniosTrabajando(anios);
    m.setGenero(genero);
    m.setFechaNacimiento(nacimiento);
    return medicoRepository.save(m);
  }

  private Paciente crearPaciente(String cedula, String nombres, String apellidos, String email, String telefono,
      LocalDate nacimiento, Role rol) {
    User usuario = crearUsuario(cedula, email, "paciente123", rol);
    Paciente p = new Paciente();
    p.setCedula(cedula);
    p.setNombres(nombres);
    p.setApellidos(apellidos);
    p.setTelefono(telefono);
    p.setFechaNacimiento(nacimiento);
    p.setUsuario(usuario);
    return pacienteRepository.save(p);
  }

  private void crearCita(Paciente paciente, Medico medico, int diasDesdeHoy, int hora, String motivo) {
    Cita c = new Cita();
    c.setPaciente(paciente);
    c.setMedico(medico);
    c.setFechaHora(LocalDateTime.now().plusDays(diasDesdeHoy).withHour(hora).withMinute(0).withSecond(0).withNano(0));
    c.setMotivo(motivo);
    citaRepository.save(c);
  }
}
