'use client';
import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { getEquiposActivos } from '@/app/utils/actions';
import withAuthorization from '@/app/utils/autorization';
import { Tooltip } from '@chakra-ui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Disciplina' },
  { name: 'Categoria' },
  { name: 'Jugadores' },
  { name: 'Acciones' },
];

function Page() {
  const [nombreSeleccionado, setNombreSeleccionado] = useState('');
  const [equipo, setEquipo] = useState([]);
  const [equiposAMostrar, setEquiposAMostrar] = useState([]);
  const router = useRouter();
  const handleBuscarNombre = (e) => {
    if (!e.target.value) {
      setEquiposAMostrar(mappearData(equipo));
      setNombreSeleccionado(e.target.value);
      return;
    }
    const nuevosEquipos = equipo.filter((eq) => {
      return eq.nombre.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setNombreSeleccionado(e.target.value);
    setEquiposAMostrar(mappearData(nuevosEquipos));
  };

  const ActionTab = (equipo) => {
    return (
      <div className="flex flex-row gap-4">
        <Tooltip label="Editar">
          <PencilIcon
            className={`w-[50px] cursor-pointer text-slate-500`}
            onClick={() => {}}
          />
        </Tooltip>
        <Tooltip label="Eliminar">
          <TrashIcon
            className={`w-[50px] cursor-pointer text-slate-500`}
            onClick={() => {}}
          />
        </Tooltip>
      </div>
    );
  };

  const mappearData = (data) => {
    return (
      data &&
      data.map((equipo) => ({
        id: equipo.id,
        nombre: equipo.nombre,
        disciplina: equipo.disciplina.nombre,
        categoria: equipo.categoria.nombre,
        jugadores: (
          <ul>
            {equipo.jugadores.map((jugador, i) => (
              <li className="mb-1" key={`${jugador.id} - ${i}`}>
                {jugador.numCamiseta} - {jugador.nombre} - {jugador.puesto}
              </li>
            ))}
          </ul>
        ),
        acciones: ActionTab(data.find((disc) => disc.id === equipo.id)),
      }))
    );
  };
  const getEquipos = async () => {
    const result = await getEquiposActivos();
    setEquipo(result);
    const equipoAMostrar = mappearData(result);
    setEquiposAMostrar(equipoAMostrar);
  };

  useEffect(() => {
    getEquipos();
  }, []);

  return (
    <section>
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Equipos
      </div>
      <section>
        <div className="flex w-full flex-wrap items-center gap-8">
          <section className="flex flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Nombre:
            </label>
            <InputWithLabel
              name={'nombre'}
              type="text"
              onChange={handleBuscarNombre}
              value={nombreSeleccionado}
            />
          </section>
          <button
            onClick={() => {
              router.push('equipos/crear');
            }}
            className="rounded-lg bg-blue-500 p-2 text-center text-xl text-white lg:ml-auto"
            type="button"
          >
            Crear un nuevo equipo
          </button>
        </div>
        <section>
          <FlowTable Header={HEADER_TABLE} dataToShow={equiposAMostrar} />
        </section>
      </section>
    </section>
  );
}

export default withAuthorization(Page, 'Eventos');
