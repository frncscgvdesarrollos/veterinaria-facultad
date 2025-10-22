
import { getAllTurnsForAdmin } from "@/lib/actions/turnos.admin.actions.js";

// Componente simple para mostrar un turno
function TurnoItem({ turno }) {
  return (
    <li style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
      <p><strong>Fecha:</strong> {new Date(turno.fecha).toLocaleDateString()} - {turno.horario}</p>
      <p><strong>Mascota:</strong> {turno.mascota.nombre} (Dueño: {turno.user.nombre} {turno.user.apellido})</p>
      <p><strong>Servicio:</strong> {turno.servicioNombre}</p>
      <p><strong>Estado:</strong> <span style={{ fontWeight: 'bold', color: turno.estado === 'pendiente' ? '#orange' : 'green' }}>{turno.estado}</span></p>
    </li>
  );
}

export default async function AdminTurnosBasePage() {
  const { success, data: turnos, error } = await getAllTurnsForAdmin();

  if (!success) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error al Cargar los Turnos</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Filtramos los turnos en dos listas separadas
  const turnosPeluqueria = turnos.filter(t => t.tipo === 'peluqueria');
  const turnosClinica = turnos.filter(t => t.tipo === 'clinica');

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Administración de Turnos</h1>

      <div style={{ marginTop: '30px' }}>
        <h2>Turnos de Peluquería ({turnosPeluqueria.length})</h2>
        {turnosPeluqueria.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {turnosPeluqueria.map(turno => <TurnoItem key={turno.id} turno={turno} />)}
          </ul>
        ) : (
          <p>No hay turnos de peluquería programados.</p>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Turnos de Clínica Veterinaria ({turnosClinica.length})</h2>
        {turnosClinica.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {turnosClinica.map(turno => <TurnoItem key={turno.id} turno={turno} />)}
          </ul>
        ) : (
          <p>No hay turnos de clínica programados.</p>
        )}
      </div>
    </div>
  );
}

// Forzamos el renderizado dinámico para asegurar que los datos estén siempre actualizados
export const dynamic = 'force-dynamic';
