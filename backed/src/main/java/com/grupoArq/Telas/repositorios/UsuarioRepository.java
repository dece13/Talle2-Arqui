package com.grupoArq.Telas.repositorios;

import com.grupoArq.Telas.entidades.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {
}
