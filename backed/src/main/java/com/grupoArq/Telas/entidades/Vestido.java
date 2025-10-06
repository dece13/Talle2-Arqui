package com.grupoArq.Telas.entidades;

import jakarta.persistence.*;

@Entity
@Table(name = "vestido")
public class Vestido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo;
    private int cantidad;
    private String colores;
    private String tamano;

    public Vestido() {}

    public Vestido(String tipo, int cantidad, String colores, String tamano) {
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.colores = colores;
        this.tamano = tamano;
    }

    public Long getId() { return id; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    public String getColores() { return colores; }
    public void setColores(String colores) { this.colores = colores; }
    public String getTamano() { return tamano; }
    public void setTamano(String tamano) { this.tamano = tamano; }
}