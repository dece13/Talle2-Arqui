package com.grupoArq.Telas.controladores;

import com.grupoArq.Telas.entidades.Usuario;
import com.grupoArq.Telas.servicios.UsuarioService;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ClerkUserController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/usuario")
    public Object getUsuario(HttpServletRequest request) {
        String userId = (String) request.getAttribute("clerkUserId");
        if (userId == null) {
            return Map.of("error", "No Clerk userId en el request");
        }
        Usuario usuario = usuarioService.obtenerUsuarioPorId(userId);
        if (usuario != null) {
            return usuario;
        } else {
            return Map.of("error", "Usuario no encontrado en la base de datos");
        }
    }
}
