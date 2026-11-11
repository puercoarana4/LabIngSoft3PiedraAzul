package com.bezkoder.springjwt.controladores;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bezkoder.springjwt.configuracionSeguridad.fachada.DTO.request.LoginRequestDTO;
import com.bezkoder.springjwt.configuracionSeguridad.fachada.DTO.response.JwtResponseDTO;
import com.bezkoder.springjwt.configuracionSeguridad.fachada.services.AuthImpl;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  AuthImpl objAuthImpl;

  @PostMapping("/signin")
  public ResponseEntity<JwtResponseDTO> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
    return ResponseEntity.ok(this.objAuthImpl.authenticateUser(loginRequest));
  }
}
