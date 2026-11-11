package com.bezkoder.springjwt.clinica.accesoADatos.entidades;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "medicos", uniqueConstraints = @UniqueConstraint(columnNames = "cedula"))
public class Medico {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 15)
  private String cedula;

  @Column(nullable = false, length = 60)
  private String nombres;

  @Column(nullable = false, length = 60)
  private String apellidos;

  @Column(nullable = false, length = 60)
  private String especialidad;

  @Column(nullable = false)
  private Integer aniosTrabajando;

  @Column(nullable = false, length = 20)
  private String genero;

  @Column(nullable = false)
  private LocalDate fechaNacimiento;

  public Medico() {
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getCedula() { return cedula; }
  public void setCedula(String cedula) { this.cedula = cedula; }

  public String getNombres() { return nombres; }
  public void setNombres(String nombres) { this.nombres = nombres; }

  public String getApellidos() { return apellidos; }
  public void setApellidos(String apellidos) { this.apellidos = apellidos; }

  public String getEspecialidad() { return especialidad; }
  public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }

  public Integer getAniosTrabajando() { return aniosTrabajando; }
  public void setAniosTrabajando(Integer aniosTrabajando) { this.aniosTrabajando = aniosTrabajando; }

  public String getGenero() { return genero; }
  public void setGenero(String genero) { this.genero = genero; }

  public LocalDate getFechaNacimiento() { return fechaNacimiento; }
  public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

}
