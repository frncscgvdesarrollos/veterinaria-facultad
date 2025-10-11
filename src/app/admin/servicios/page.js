import ListaServicios from './ListaServicios';
import ServiciosClientView from './ServiciosClientView';

export default function AdminServiciosPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <ServiciosClientView>
          <ListaServicios />
        </ServiciosClientView>
      </div>
    </div>
  );
}
