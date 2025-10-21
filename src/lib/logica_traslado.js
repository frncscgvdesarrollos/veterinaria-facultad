
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
 * -- ALGORITMO DE VERIFICACIÓN (A IMPLEMENTAR) --
 * 
 * La función `verificarDisponibilidadTraslado` recibirá dos argumentos:
 * 1. `turnosDelDia`: Un array de objetos, donde cada objeto representa un turno ya agendado con traslado para ese día.
 * 2. `nuevasMascotas`: Un array de objetos, representando las mascotas para las cuales se solicita el nuevo turno de traslado.
 *
 * La función seguirá los siguientes pasos:
 * 1. Contabilizar todos los perros (los ya agendados + los nuevos) y agruparlos por tamaño ("muy chiquito", "chico", "mediano", "grande", "muy grande").
 * 
 * 2. Iniciar con el inventario completo de caniles.
 * 
 * 3. Asignar los perros a los caniles en orden de prioridad (de más grande a más chico) para evitar que un perro grande se quede sin su canil específico.
 *    - Asignar perros "muy grandes" al canil "muy grande".
 *    - Asignar perros "grandes" al canil "grande".
 *    - Asignar perros "medianos" a los caniles "medianos".
 *    - Asignar perros "chicos" y "muy chiquitos" a sus respectivos caniles.
 *
 * 4. Para los perros que no encontraron lugar (si los hay), intentar reubicarlos usando las reglas de sustitución en los caniles más grandes que quedaron libres.
 *    - ¿Quedaron perros medianos? Ver si caben en el canil "muy grande" libre.
 *    - ¿Quedaron perros chicos? Ver si caben en el canil "grande" o "muy grande" libres.
 * 
 * 5. Si después de todo el proceso todos los perros tienen un lugar asignado, la función devolverá `true` (hay disponibilidad).
 * 
 * 6. Si a algún perro no se le pudo asignar un lugar, la función devolverá `false`.
 */

/**
 * Verifica si hay disponibilidad de traslado para un grupo de nuevas mascotas,
 * considerando los turnos ya existentes en un día específico.
 * 
 * @param {Array<Object>} turnosDelDia - Lista de turnos con traslado ya agendados para el día. Se espera que cada turno tenga una propiedad `mascota` con la info del tamaño.
 * @param {Array<Object>} nuevasMascotas - Lista de mascotas para las que se solicita el nuevo traslado.
 * @returns {boolean} - Devuelve `true` si hay espacio, de lo contrario `false`.
 */
export function verificarDisponibilidadTraslado(turnosDelDia, nuevasMascotas) {
    // 1. Contabilizar todos los perros por tamaño.
    // Se asume que los objetos en `turnosDelDia` tienen una propiedad `mascota` con el `tamaño`.
    const todasLasMascotas = [
        ...nuevasMascotas,
        ...(turnosDelDia || []).map(turno => turno.mascota) 
    ];

    const perrosPorTamaño = {
        muy_grande: 0,
        grande: 0,
        mediano: 0,
        chico: 0,
        muy_chiquito: 0,
    };

    for (const mascota of todasLasMascotas) {
        if (mascota && mascota.tamaño) {
            // Normalizar el tamaño, ej: 'pequeño' -> 'chico'
            const tamaño = mascota.tamaño.toLowerCase().replace(' ', '_');
            const tamañoNormalizado = tamaño === 'pequeño' ? 'chico' : tamaño;
            
            if (perrosPorTamaño.hasOwnProperty(tamañoNormalizado)) {
                perrosPorTamaño[tamañoNormalizado]++;
            }
        }
    }

    // 2. Iniciar con el inventario de caniles.
    let canilesLibres = {
        muy_grande: 1,
        grande: 1,
        mediano: 3,
        muy_chiquito: 1,
    };

    // 3. Asignar perros a caniles de su tamaño exacto (de mayor a menor).
    
    // Perros "muy grandes" no tienen sustitución.
    if (perrosPorTamaño.muy_grande > canilesLibres.muy_grande) return false;
    canilesLibres.muy_grande -= perrosPorTamaño.muy_grande;

    // Perros "grandes" no tienen sustitución.
    if (perrosPorTamaño.grande > canilesLibres.grande) return false;
    canilesLibres.grande -= perrosPorTamaño.grande;

    // Perros "muy chiquitos" no tienen sustitución.
    if (perrosPorTamaño.muy_chiquito > canilesLibres.muy_chiquito) return false;
    canilesLibres.muy_chiquito -= perrosPorTamaño.muy_chiquito;
    
    // Asignar perros "medianos" a sus caniles y registrar los que no caben.
    const medianosAsignadosDirecto = Math.min(perrosPorTamaño.mediano, canilesLibres.mediano);
    let medianosSinLugar = perrosPorTamaño.mediano - medianosAsignadosDirecto;
    canilesLibres.mediano -= medianosAsignadosDirecto;
    
    // Todos los perros "chicos" necesitan reubicación ya que no hay canil "chico" específico.
    let chicosSinLugar = perrosPorTamaño.chico;

    // 4. Intentar reubicar usando sustitución en caniles más grandes.

    // Reubicar medianos sin lugar en caniles "muy grandes" libres.
    if (medianosSinLugar > 0) {
        // Regla: 1 canil "muy grande" puede alojar 2 "medianos".
        const canilesMGNecesarios = Math.ceil(medianosSinLugar / 2);
        if (canilesMGNecesarios > canilesLibres.muy_grande) return false;
        canilesLibres.muy_grande -= canilesMGNecesarios;
    }

    // Reubicar chicos sin lugar en caniles "grandes" y "muy grandes" libres.
    if (chicosSinLugar > 0) {
        // Prioridad 1: Usar caniles "grandes" libres.
        // Regla: 1 canil "grande" puede alojar 3 "chicos".
        if (canilesLibres.grande > 0) {
            const capacidadEnCanilesGrandes = canilesLibres.grande * 3;
            const chicosUbicadosEnGrandes = Math.min(chicosSinLugar, capacidadEnCanilesGrandes);
            chicosSinLugar -= chicosUbicadosEnGrandes;
        }
        
        // Prioridad 2: Usar caniles "muy grandes" si aún quedan chicos.
        if (chicosSinLugar > 0) {
            // Regla: 1 canil "muy grande" puede alojar 3 "chicos".
             if (canilesLibres.muy_grande > 0) {
                const capacidadEnCanilesMuyGrandes = canilesLibres.muy_grande * 3;
                if (chicosSinLugar > capacidadEnCanilesMuyGrandes) return false; // No hay más opciones
            } else {
                 return false; // No quedan caniles grandes ni muy grandes
            }
        }
    }

    // 5. Si no hemos retornado `false` hasta ahora, significa que todos cupieron.
    return true;
}
