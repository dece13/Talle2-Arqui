package com.grupoArq.Telas.entidades;

import jakarta.persistence.*;
import java.util.List;
import com.grupoArq.Telas.entidades.Pedido;

@Entity
@Table(name = "usuarios") // nombre de la tabla en MySQL
public class Usuario {
    @Id
    private String id; // UUID generado por Clerk

    private String nombre;
    private String apellido;
    @Column(unique = true)
    private String usuario;
    private String contrasena;
    private Boolean esSuperusuario = false;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedido> pedidos;

    public Usuario() {}

    public Usuario(String id, String nombre, String apellido, String usuario, String contrasena, Boolean esSuperusuario) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.esSuperusuario = esSuperusuario;
    }

    // Getters y Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public Boolean getEsSuperusuario() { return esSuperusuario; }
    public void setEsSuperusuario(Boolean esSuperusuario) { this.esSuperusuario = esSuperusuario; }

    public List<Pedido> getPedidos() { return pedidos; }
    public void setPedidos(List<Pedido> pedidos) { this.pedidos = pedidos; }
}