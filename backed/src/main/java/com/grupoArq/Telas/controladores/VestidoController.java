package com.grupoArq.Telas.controlador;

import com.grupoArq.Telas.entidades.Vestido;
import com.grupoArq.Telas.repositorio.VestidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vestidos")
public class VestidoController {
    @Autowired
    private VestidoRepository vestidoRepository;

    // Listar todos
    @GetMapping
    public List<Vestido> getAllVestidos() {
        return vestidoRepository.findAll();
    }

    // Obtener por ID
    @GetMapping("/{id}")
    public Vestido getVestidoById(@PathVariable Long id) {
        return vestidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vestido no encontrado"));
    }

    // Crear
    @PostMapping
    public Vestido createVestido(@RequestBody Vestido vestido) {
        return vestidoRepository.save(vestido);
    }

    // Actualizar
    @PutMapping("/{id}")
    public Vestido updateVestido(@PathVariable Long id, @RequestBody Vestido vestidoDetails) {
        Vestido vestido = vestidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vestido no encontrado"));

        vestido.setTipo(vestidoDetails.getTipo());
        vestido.setCantidad(vestidoDetails.getCantidad());
        vestido.setColores(vestidoDetails.getColores());
        vestido.setTamano(vestidoDetails.getTamano());

        return vestidoRepository.save(vestido);
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public void deleteVestido(@PathVariable Long id) {
        vestidoRepository.deleteById(id);
    }
}