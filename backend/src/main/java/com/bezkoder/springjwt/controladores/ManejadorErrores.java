package com.bezkoder.springjwt.controladores;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.bezkoder.springjwt.clinica.fachada.excepciones.RecursoDuplicadoException;
import com.bezkoder.springjwt.clinica.fachada.excepciones.RecursoNoEncontradoException;

/** Convierte las excepciones del negocio en respuestas JSON con el codigo HTTP correcto. */
@RestControllerAdvice
public class ManejadorErrores {

  @ExceptionHandler(RecursoDuplicadoException.class)
  public ResponseEntity<Map<String, Object>> duplicado(RecursoDuplicadoException ex) {
    return respuesta(HttpStatus.CONFLICT, ex.getMessage(), null);
  }

  @ExceptionHandler(RecursoNoEncontradoException.class)
  public ResponseEntity<Map<String, Object>> noEncontrado(RecursoNoEncontradoException ex) {
    return respuesta(HttpStatus.NOT_FOUND, ex.getMessage(), null);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> invalido(MethodArgumentNotValidException ex) {
    Map<String, String> errores = new LinkedHashMap<>();
    ex.getBindingResult().getFieldErrors()
        .forEach(e -> errores.putIfAbsent(e.getField(), e.getDefaultMessage()));
    return respuesta(HttpStatus.BAD_REQUEST, "Hay datos que no son válidos", errores);
  }

  private ResponseEntity<Map<String, Object>> respuesta(HttpStatus estado, String mensaje, Object errores) {
    Map<String, Object> cuerpo = new LinkedHashMap<>();
    cuerpo.put("status", estado.value());
    cuerpo.put("error", estado.getReasonPhrase());
    cuerpo.put("message", mensaje);
    if (errores != null) {
      cuerpo.put("errores", errores);
    }
    return ResponseEntity.status(estado).body(cuerpo);
  }
}
