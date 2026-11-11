package com.bezkoder.springjwt.clinica.fachada.excepciones;

public class RecursoDuplicadoException extends RuntimeException {
  public RecursoDuplicadoException(String mensaje) {
    super(mensaje);
  }
}
