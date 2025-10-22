
/**
 * =========================================================================
 * LÓGICA DE NEGOCIO PARA LA DISPONIBILIDAD DEL SERVICIO DE TRASLADO
 * =========================================================================
 *
 * Este archivo documenta y define las reglas para determinar si hay espacio
 * disponible en el vehículo de traslado para un nuevo grupo de mascotas.
 *
 * -- INVENTARIO DE CANILES (FIJO) --
 * El vehículo tiene una capacidad fija y heterogénea de 6 caniles:
 * - 1 canil "muy chiquito"
 * - 3 caniles "medianos"
 * - 1 canil "grande"
 * - 1 canil "muy grande"
 *
 * -- REGLAS DE SUSTITUCIÓN --
 * Los caniles más grandes pueden ser utilizados por perros más pequeños si no
 * están ocupados, optimizando el espacio.
 * - El canil "muy grande" puede alojar: 1 perro "muy grande" O 2 "medianos" O 3 "chicos".
 * - El canil "grande" puede alojar: 1 perro "grande" O 3 "chicos".
 * - Caniles "medianos" y "muy chiquitos" no tienen sustitución, solo alojan a su tamaño correspondiente (1 a 1).
 * 
 * -- DATOS CLAVE --
 * - Capacidad máxima de perros CHICOS (usando todos los caniles): 10
 * - Capacidad máxima de perros MEDIANOS (usando sustitución): 2 (en el muy grande) + 3 (en los medianos) = 5
 *
 */

/**
 * Verifica si hay disponibilidad de traslado para un grupo de nuevas mascotas,
 * considerando los turnos ya existentes en un día específico.
 * 
 * @param {Array<Object>} turnosDelDia - Lista de turnos con traslado ya agendados para el día.
 * @param {Array<Object>} nuevasMascotas - Lista de mascotas para las que se solicita el nuevo traslado.
 * @returns {boolean} - Devuelve `true` si hay espacio, de lo contrario `false`.
 */
export function verificarDisponibilidadTraslado(turnosDelDia, nuevasMascotas) {
    // 1. Contabilizar todas las mascotas por tamaño.
    const todasLasMascotas = [
        ...nuevasMascotas,
        ...(turnosDelDia || []).map(turno => turno.mascota) 
    ];

    const perrosPorTamaño = {
        muy_grande: 0, grande: 0, mediano: 0, chico: 0, muy_chiquito: 0,
    };

    for (const mascota of todasLasMascotas) {
        if (mascota && mascota.tamaño) {
            const tamañoNorm = mascota.tamaño.toLowerCase().replace(' ', '_').replace('pequeño', 'chico');
            if (perrosPorTamaño.hasOwnProperty(tamañoNorm)) {
                perrosPorTamaño[tamañoNorm]++;
            }
        }
    }

    // 2. Inventario inicial de caniles.
    let caniles = { muy_grande: 1, grande: 1, mediano: 3, muy_chiquito: 1 };

    // 3. Asignación directa (perros que no tienen sustitución).
    // Perros "muy grandes"
    if (perrosPorTamaño.muy_grande > caniles.muy_grande) return false;
    caniles.muy_grande -= perrosPorTamaño.muy_grande;
    perrosPorTamaño.muy_grande = 0;

    // Perros "grandes"
    if (perrosPorTamaño.grande > caniles.grande) return false;
    caniles.grande -= perrosPorTamaño.grande;
    perrosPorTamaño.grande = 0;

    // Perros "muy chiquitos"
    if (perrosPorTamaño.muy_chiquito > caniles.muy_chiquito) return false;
    caniles.muy_chiquito -= perrosPorTamaño.muy_chiquito;
    perrosPorTamaño.muy_chiquito = 0;

    // 4. Asignación a caniles medianos (tienen sustitución pero solo para más chicos).
    const medianosAsignados = Math.min(perrosPorTamaño.mediano, caniles.mediano);
    caniles.mediano -= medianosAsignados;
    perrosPorTamaño.mediano -= medianosAsignados;

    // 5. Reubicación de perros medianos restantes en caniles "muy grandes".
    if (perrosPorTamaño.mediano > 0) {
        const canilesMuyGrandesNecesarios = Math.ceil(perrosPorTamaño.mediano / 2); // 2 medianos por canil MG
        if (canilesMuyGrandesNecesarios > caniles.muy_grande) return false;
        caniles.muy_grande -= canilesMuyGrandesNecesarios;
        perrosPorTamaño.mediano = 0;
    }

    // 6. Reubicación de perros chicos restantes.
    // No tienen canil propio, siempre usan sustitución.
    // Prioridad 1: Caniles "grandes" libres.
    if (perrosPorTamaño.chico > 0 && caniles.grande > 0) {
        const capacidadEnGrandes = caniles.grande * 3; // 3 chicos por canil G
        const chicosEnGrandes = Math.min(perrosPorTamaño.chico, capacidadEnGrandes);
        perrosPorTamaño.chico -= chicosEnGrandes;
    }

    // Prioridad 2: Caniles "muy grandes" libres.
    if (perrosPorTamaño.chico > 0 && caniles.muy_grande > 0) {
        const capacidadEnMuyGrandes = caniles.muy_grande * 3; // 3 chicos por canil MG
        const chicosEnMuyGrandes = Math.min(perrosPorTamaño.chico, capacidadEnMuyGrandes);
        perrosPorTamaño.chico -= chicosEnMuyGrandes;
    }
    
    // 7. Verificación final.
    // Si quedan perros de cualquier tamaño, significa que no hubo espacio.
    return perrosPorTamaño.chico === 0 && perrosPorTamaño.mediano === 0;
}
