package com.bezkoder.springjwt.clinica.fachada.excepciones;

public class RecursoNoEncontradoException extends RuntimeException {
  public RecursoNoEncontradoException(String mensaje) {
    super(mensaje);
  }
}
