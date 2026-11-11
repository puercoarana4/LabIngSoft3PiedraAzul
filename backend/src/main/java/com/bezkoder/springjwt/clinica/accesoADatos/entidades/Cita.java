package com.bezkoder.springjwt.clinica.accesoADatos.entidades;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "citas")
public class Cita {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "paciente_id", nullable = false)
  private Paciente paciente;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "medico_id", nullable = false)
  private Medico medico;

  @Column(nullable = false)
  private LocalDateTime fechaHora;

  @Column(nullable = false, length = 200)
  private String motivo;

  public Cita() {
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Paciente getPaciente() { return paciente; }
  public void setPaciente(Paciente paciente) { this.paciente = paciente; }

  public Medico getMedico() { return medico; }
  public void setMedico(Medico medico) { this.medico = medico; }

  public LocalDateTime getFechaHora() { return fechaHora; }
  public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

  public String getMotivo() { return motivo; }
  public void setMotivo(String motivo) { this.motivo = motivo; }

}
