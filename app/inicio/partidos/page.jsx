'use client';
import { useEffect, useState } from 'react';
import withAuthorization from '../../../app/utils/autorization';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import { getInstalacionesActionAdmin } from '@/app/utils/actions';
import MatchCard from './matchCard/matchCard';

const partidosEjemplo = [
  {
    id: 1,
    equipoLocal: 'Equipo A',
    equipoVisitante: 'Equipo B',
    nombrePartido: 'Partido Amistoso',
    fechaPartido: new Date(),
    estadoPartido: 'Creado',
    totalEquipoLocal: 2,
    totalEquipoVisitante: 1,
  },
  {
    id: 2,
    equipoLocal: 'Equipo C',
    equipoVisitante: 'Equipo D',
    nombrePartido: 'Partido de Liga',
    fechaPartido: new Date(),
    estadoPartido: 'En Progreso',
    totalEquipoLocal: 0,
    totalEquipoVisitante: 0,
  },
  {
    id: 3,
    equipoLocal: 'Equipo E',
    equipoVisitante: 'Equipo F',
    nombrePartido: 'Semifinal',
    fechaPartido: new Date(),
    estadoPartido: 'Finalizado',
    totalEquipoLocal: 3,
    totalEquipoVisitante: 2,
  },
  {
    id: 4,
    equipoLocal: 'Equipo G',
    equipoVisitante: 'Equipo H',
    nombrePartido: 'Final del Torneo',
    fechaPartido: new Date(),
    estadoPartido: 'Cancelado',
    totalEquipoLocal: 0,
    totalEquipoVisitante: 0,
  },
  {
    id: 5,
    equipoLocal: 'Equipo I',
    equipoVisitante: 'Equipo J',
    nombrePartido: 'Partido Amistoso',
    fechaPartido: new Date(),
    estadoPartido: 'Pospuesto',
    totalEquipoLocal: 1,
    totalEquipoVisitante: 1,
  },
];

function Page() {
  const [fechaPartido, setFechaPartido] = useState(
    () => new Date().toISOString().split('T')[0],
  );
  const [asignado, setAsignado] = useState(false);
  const [instalacion, setInstalacion] = useState([]);
  const [instalacionSeleccionada, setInstalacionSeleccionada] = useState({
    value: 0,
    label: 'Todas las instalaciones',
  });
  const [partidoAver, setPartidoAver] = useState({});

  const handleGetMatchDetails = (partido) => {
    console.log('partido', partido);
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

  useEffect(() => {
    getInstalaciones();
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
            {partidosEjemplo.map((partido, index) => (
              <MatchCard
                key={index}
                handleGetMatchDetails={handleGetMatchDetails}
                partido={partido}
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

export default withAuthorization(Page, 'Partidos');
