package com.bezkoder.springjwt.clinica.accesoADatos.entidades;

import java.time.LocalDate;

import com.bezkoder.springjwt.configuracionSeguridad.accesoADatos.entidades.User;
import jakarta.persistence.*;

@Entity
@Table(name = "pacientes", uniqueConstraints = @UniqueConstraint(columnNames = "cedula"))
public class Paciente {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 15)
  private String cedula;

  @Column(nullable = false, length = 60)
  private String nombres;

  @Column(nullable = false, length = 60)
  private String apellidos;

  @Column(nullable = false, length = 15)
  private String telefono;

  @Column(nullable = false)
  private LocalDate fechaNacimiento;

  // Cuenta con la que el paciente inicia sesion
  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "usuario_id", nullable = false)
  private User usuario;

  public Paciente() {
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getCedula() { return cedula; }
  public void setCedula(String cedula) { this.cedula = cedula; }

  public String getNombres() { return nombres; }
  public void setNombres(String nombres) { this.nombres = nombres; }

  public String getApellidos() { return apellidos; }
  public void setApellidos(String apellidos) { this.apellidos = apellidos; }

  public String getTelefono() { return telefono; }
  public void setTelefono(String telefono) { this.telefono = telefono; }

  public LocalDate getFechaNacimiento() { return fechaNacimiento; }
  public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

  public User getUsuario() { return usuario; }
  public void setUsuario(User usuario) { this.usuario = usuario; }

}
