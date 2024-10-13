'use client';
import { useEffect, useState } from 'react';
import withAuthorization from '../../../app/utils/autorization';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  getEventosActivos,
  getInstalacionesActionAdmin,
  getPartidoByIdAdmin,
} from '@/app/utils/actions';
import MatchCard from './components/matchCard/matchCard';
import { FormDetallePartido } from './components/formDetallePartido/formDetallePartido';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';

function Page() {
  const [fechaPartido, setFechaPartido] = useState(null);
  const [asignado, setAsignado] = useState(false);
  const [instalacion, setInstalacion] = useState([]);
  const [instalacionSeleccionada, setInstalacionSeleccionada] = useState({
    value: 0,
    label: 'Todas las instalaciones',
  });
  const [eventosSeleccionado, setEventosSeleccionado] = useState({});
  const [partidos, setPartidos] = useState([]);
  const [partidoAver, setPartidoAver] = useState([]);
  const [detallesDelPartido, setDetallesDelPartido] = useState(false);

  const handleGetMatchDetails = (partido) => {
    const partidoSeleccionado = partidos.find((part) => partido.id === part.id);
    setEventosSeleccionado(partidoSeleccionado);
    setDetallesDelPartido(true);
  };
  const getInstalaciones = async () => {
    const result = await getInstalacionesActionAdmin();
    const instalaciones = [
      { value: undefined, label: 'Todas las instalaciones' },
      ...result.map((ins) => ({ value: ins.id, label: ins.nombre })),
    ];
    setInstalacion(instalaciones);
  };

  const handleSearchMatches = () => {
    console.log(fechaPartido, asignado, instalacionSeleccionada);
  };

  const getTodosLosPartidos = async () => {
    const eventos = await getEventosActivos();
    const partidos = eventos
      .filter((ev) => ev?.tipoEvento?.nombreTipoEvento === 'Partido')
      .map((part) => part.id);
    const promises = partidos.map((part) => getPartidoByIdAdmin(part));
    const result = await Promise.all(promises);
    setPartidos(result);
    const partidosAVer = result.map((partido) => ({
      id: partido.id,
      equipoLocal: partido?.local?.equipo?.nombre,
      equipoVisitante: partido?.visitante?.equipo?.nombre,
      nombrePartido: partido?.titulo,
      fechaPartido: partido?.fechaInicio,
      estadoPartido:
        partido?.historialEventoList?.[0]?.estadoEvento?.nombreEstado,
      totalEquipoLocal: partido?.resultadoLocal || 0,
      totalEquipoVisitante: partido?.resultadoVisitante || 0,
    }));
    setPartidoAver(partidosAVer);
  };

  const prepararPartido = () => {
    console.log('hola');
  };

  useEffect(() => {
    getInstalaciones();
    getTodosLosPartidos();
  }, []);

  useEffect(() => {
    handleSearchMatches();
  }, [asignado, fechaPartido, instalacionSeleccionada]);

  return (
    <section>
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Partidos
      </div>
      <div className="flex flex-row flex-wrap gap-5">
        <div className="flex flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Asingados:
          </label>
          <InputWithLabel
            name="Socio"
            type="checkbox"
            stylesInput="peer block rounded-md h-[37px] border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            defaultChecked={asignado}
            defaultValue={asignado}
            onChange={(e) => {
              setAsignado(e.target.checked);
            }}
          />
        </div>
        <div className="flex flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Fecha:
          </label>
          <InputWithLabel
            name={'fecha'}
            type="date"
            defaultValue={fechaPartido}
            onChange={(e) => setFechaPartido(e.target.value)}
          />
        </div>
        <div className="flex min-w-[170px] flex-row items-center gap-3">
          <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
            Instalacion:
          </label>
          <div className="min-w-[170px]">
            <SelectWithLabel
              name="instalacion"
              options={instalacion}
              value={instalacionSeleccionada}
              onChange={(e) => {
                setInstalacionSeleccionada(e);
              }}
            />
          </div>
        </div>
      </div>
      <section className="items-centerbg-gray-100 flex justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="space-y-4 overflow-y-auto">
            {partidoAver.map((partido) => (
              <MatchCard
                key={partido.id}
                handleGetMatchDetails={handleGetMatchDetails}
                partido={partido}
              />
            ))}
          </div>
        </div>
      </section>
      <FlowModal
        title={`Detalles del partido`}
        modalBody={
          <>
            <FormDetallePartido partido={eventosSeleccionado} />
          </>
        }
        primaryTextButton={'Preparar Partido'}
        isOpen={detallesDelPartido}
        scrollBehavior="outside"
        onAcceptModal={prepararPartido}
        onCancelModal={() => {
          setDetallesDelPartido(false);
          setEventosSeleccionado({});
        }}
      />
    </section>
  );
}

export default withAuthorization(Page, 'Partidos');
