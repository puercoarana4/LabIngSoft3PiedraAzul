package com.bezkoder.springjwt;

import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Pruebas de las rutas publicas y privadas del backend.
 * Los usuarios salen de DatosIniciales (admin y el paciente 1002003001).
 */
@SpringBootTest
@AutoConfigureMockMvc
class RutasClinicaTests {

  private static final String[] RUTAS_SOLO_ADMIN = { "/api/medicos", "/api/pacientes", "/api/citas" };

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper mapper;

  private String iniciarSesion(String usuario, String clave) throws Exception {
    String cuerpo = mockMvc.perform(post("/api/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"username\":\"" + usuario + "\",\"password\":\"" + clave + "\"}"))
        .andExpect(status().isOk())
        .andReturn().getResponse().getContentAsString();
    return mapper.readTree(cuerpo).get("accessToken").asText();
  }

  private String tokenAdmin() throws Exception {
    return iniciarSesion("admin", "admin123");
  }

  private String tokenPaciente() throws Exception {
    return iniciarSesion("1002003001", "paciente123");
  }

  private String bearer(String token) {
    return "Bearer " + token;
  }

  // ---------- rutas publicas ----------

  @Test
  void loginConCredencialesValidasDevuelveTokenYRol() throws Exception {
    mockMvc.perform(post("/api/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"username\":\"admin\",\"password\":\"admin123\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").isNotEmpty())
        .andExpect(jsonPath("$.roles[0]").value("ROLE_ADMIN"));
  }

  @Test
  void loginConClaveIncorrectaResponde401() throws Exception {
    mockMvc.perform(post("/api/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"username\":\"admin\",\"password\":\"otra-clave\"}"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void listarMedicosEsPublico() throws Exception {
    mockMvc.perform(get("/api/public/medicos"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
        .andExpect(jsonPath("$[0].especialidad").isNotEmpty());
  }

  // ---------- rutas privadas: sin token (401) ----------

  @Test
  void rutasPrivadasSinTokenResponden401() throws Exception {
    for (String ruta : RUTAS_SOLO_ADMIN) {
      mockMvc.perform(get(ruta)).andExpect(status().isUnauthorized());
    }
    mockMvc.perform(get("/api/citas/mis-citas")).andExpect(status().isUnauthorized());
  }

  @Test
  void tokenInvalidoResponde401() throws Exception {
    mockMvc.perform(get("/api/medicos").header(HttpHeaders.AUTHORIZATION, bearer("esto.no.es.un.jwt")))
        .andExpect(status().isUnauthorized());
  }

  // ---------- rutas privadas: rol no autorizado (403) ----------

  @Test
  void pacienteEnRutasDeAdministradorResponde403() throws Exception {
    String token = tokenPaciente();
    for (String ruta : RUTAS_SOLO_ADMIN) {
      mockMvc.perform(get(ruta).header(HttpHeaders.AUTHORIZATION, bearer(token)))
          .andExpect(status().isForbidden());
    }
  }

  @Test
  void pacienteNoPuedeRegistrarMedicos() throws Exception {
    mockMvc.perform(post("/api/medicos")
        .header(HttpHeaders.AUTHORIZATION, bearer(tokenPaciente()))
        .contentType(MediaType.APPLICATION_JSON)
        .content("{}"))
        .andExpect(status().isForbidden());
  }

  @Test
  void administradorEnMisCitasResponde403() throws Exception {
    mockMvc.perform(get("/api/citas/mis-citas").header(HttpHeaders.AUTHORIZATION, bearer(tokenAdmin())))
        .andExpect(status().isForbidden());
  }

  // ---------- rutas privadas: token valido (200) ----------

  @Test
  void administradorListaMedicosPacientesYCitas() throws Exception {
    String token = tokenAdmin();
    for (String ruta : RUTAS_SOLO_ADMIN) {
      mockMvc.perform(get(ruta).header(HttpHeaders.AUTHORIZATION, bearer(token)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }
  }

  @Test
  void pacienteSoloVeSusPropiasCitas() throws Exception {
    mockMvc.perform(get("/api/citas/mis-citas").header(HttpHeaders.AUTHORIZATION, bearer(tokenPaciente())))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(3)))
        .andExpect(jsonPath("$[*].pacienteCedula", everyItem(is("1002003001"))));
  }

  @Test
  void administradorVeLasCitasDeTodosLosPacientes() throws Exception {
    mockMvc.perform(get("/api/citas").header(HttpHeaders.AUTHORIZATION, bearer(tokenAdmin())))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(4))));
  }

  // ---------- registro y cedula repetida ----------

  @Test
  void registrarMedicoYDetectarCedulaRepetida() throws Exception {
    String token = tokenAdmin();
    String medico = "{\"cedula\":\"11223344\",\"nombres\":\"Sofía\",\"apellidos\":\"Paz\","
        + "\"especialidad\":\"Neurología\",\"aniosTrabajando\":4,\"genero\":\"Femenino\","
        + "\"fechaNacimiento\":\"1991-02-10\"}";

    mockMvc.perform(get("/api/medicos/existe/11223344").header(HttpHeaders.AUTHORIZATION, bearer(token)))
        .andExpect(jsonPath("$.existe").value(false));

    mockMvc.perform(post("/api/medicos").header(HttpHeaders.AUTHORIZATION, bearer(token))
        .contentType(MediaType.APPLICATION_JSON).content(medico))
        .andExpect(status().isCreated());

    mockMvc.perform(get("/api/medicos/existe/11223344").header(HttpHeaders.AUTHORIZATION, bearer(token)))
        .andExpect(jsonPath("$.existe").value(true));

    mockMvc.perform(post("/api/medicos").header(HttpHeaders.AUTHORIZATION, bearer(token))
        .contentType(MediaType.APPLICATION_JSON).content(medico))
        .andExpect(status().isConflict());
  }

  @Test
  void registrarMedicoConDatosInvalidosResponde400() throws Exception {
    mockMvc.perform(post("/api/medicos").header(HttpHeaders.AUTHORIZATION, bearer(tokenAdmin()))
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"cedula\":\"abc\"}"))
        .andExpect(status().isBadRequest());
  }
}
