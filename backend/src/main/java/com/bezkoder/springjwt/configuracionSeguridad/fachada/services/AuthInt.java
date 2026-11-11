package com.bezkoder.springjwt.configuracionSeguridad.fachada.services;

import com.bezkoder.springjwt.configuracionSeguridad.fachada.DTO.request.LoginRequestDTO;
import com.bezkoder.springjwt.configuracionSeguridad.fachada.DTO.response.JwtResponseDTO;

public interface AuthInt {
  JwtResponseDTO authenticateUser(LoginRequestDTO loginRequest);
}
