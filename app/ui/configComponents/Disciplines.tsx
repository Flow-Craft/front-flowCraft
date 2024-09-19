'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputWithLabel } from '../components/InputWithLabel/InputWithLabel';
import { FlowTable } from '../components/FlowTable/FlowTable';
import {
  deleteDisciplineAction,
  getDisciplinasAdmin,
} from '@/app/utils/actions';
import { PencilIcon, FireIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FlowModal } from '../components/FlowModal/FlowModal';
import { Tooltip } from '@chakra-ui/react';
import toast, { Toaster } from 'react-hot-toast';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Jugadores' },
  { name: 'Jugadores Banca' },
  { name: 'tarjetas advertencia' },
  { name: 'tarjetas expulsion' },
  { name: 'cant tiempos' },
  { name: 'Eliminada' },
  { name: 'Acciones' },
];

export const DisciplinasTab = () => {
  const [disciplinasToShow, setDisciplinasToShow] = useState<any>([]);
  const [disciplinas, setDisciplinas] = useState<any>([]);
  const [openDetailDiscipline, setOpenDetailDiscipline] = useState(false);
  const [disciplineToShow, setDisciplineToShow] = useState<any>(null);
  const [openDeleteDiscipline, setOpenDeleteDiscipline] = useState(false);
  const [disciplineToDelte, setDisciplineToDelte] = useState<any>(null);
  const handleClick = (dis: JSON) => {
    console.log('HOLA', dis);
    setDisciplineToShow(dis);
    setOpenDetailDiscipline(true);
  };

  const deleteDicipline = async () => {
    try {
      await deleteDisciplineAction(disciplineToDelte.id);
      toast.success('disciplina eliminada con exito');
      disciplinasToTab();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setOpenDeleteDiscipline(false);
      setDisciplineToDelte(null);
    }
  };

  const filterUsers = (e: any) => {
    e.preventDefault();
    const filtros = {
      nombre: e.target.nombre.value.trim(), // Asegura que no haya espacios vacíos
    };
    // Filtramos los usuarios
    const disFiltered = disciplinas.filter((dis: any) => {
      // Filtrar por nombre si está presente
      const filtroNombreValido = filtros.nombre
        ? dis.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
        : true; // Ignorar si está vacío

      // Devuelve true si pasa todos los filtros aplicables
      return filtroNombreValido;
    });
    // Mapeamos los usuarios filtrados
    const filterMappeds = disFiltered.map((dis: any) => {
      return {
        nombre: dis.nombre,
        cantJugadores: dis.cantJugadores,
        cantJugadoresEnBanca: dis.cantJugadoresEnBanca,
        periodosMax: dis.periodosMax,
        tarjetasAdvertencia: dis.tarjetasAdvertencia,
        tarjetasExpulsion: dis.tarjetasExpulsion,
        eliminada: dis.fechaBaja ? 'Si' : 'No',
        acciones: ActionTab(disciplinas.find((usr: any) => usr.id === dis.id)),
        id: dis.id,
      };
    });

    setDisciplinasToShow(filterMappeds);
  };

  const handleEliminarDisciplina = (dis: any) => {
    setOpenDeleteDiscipline(true);
    setDisciplineToDelte(dis);
  };

  const handleAccept = () => {};
  const disciplinasToTab = async () => {
    try {
      const result: any = await getDisciplinasAdmin();
      setDisciplinas(result);
      const newDisciplinasToShow =
        result &&
        result.map((dis: any) => {
          return {
            nombre: dis.nombre,
            cantJugadores: dis.cantJugadores,
            cantJugadoresEnBanca: dis.cantJugadoresEnBanca,
            periodosMax: dis.periodosMax,
            tarjetasAdvertencia: dis.tarjetasAdvertencia,
            tarjetasExpulsion: dis.tarjetasExpulsion,
            eliminada: dis.fechaBaja ? 'Si' : 'No',
            acciones: ActionTab(result.find((disc: any) => disc.id === dis.id)),
            id: dis.id,
          };
        });
      setDisciplinasToShow(newDisciplinasToShow);
    } catch (error) {}
  };
  const ActionTab = (disciplina: any) => {
    console.log(disciplina);
    return (
      <div className="flex flex-row gap-4">
        <Tooltip label="Ver mas detalles">
          <FireIcon
            onClick={() => {
              handleClick(disciplina);
            }}
            className="w-[50px] cursor-pointer text-slate-500"
          />
        </Tooltip>
        <Tooltip label="Editar">
          <PencilIcon className="w-[50px] cursor-pointer text-slate-500" />
        </Tooltip>
        <Tooltip label="Eliminar">
          <TrashIcon
            onClick={() => {
              handleEliminarDisciplina(disciplina);
            }}
            className="w-[50px] cursor-pointer text-slate-500"
          />
        </Tooltip>
      </div>
    );
  };
  useEffect(() => {
    disciplinasToTab();
  }, []);
  return (
    <div className="mt-7">
      <form
        className="flex w-full flex-wrap items-center"
        onSubmit={filterUsers}
      >
        <div className="flex flex-row flex-wrap gap-5">
          <section className="flex flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Nombre:
            </label>
            <InputWithLabel name={'nombre'} type="text" />
          </section>
          <button
            className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
            type="submit"
          >
            Buscar
          </button>
        </div>

        <button
          className="rounded-lg bg-blue-500 p-2 text-center text-xl text-white lg:ml-auto"
          disabled
        >
          Crear Disciplina
        </button>
      </form>
      <section>
        <FlowTable Header={HEADER_TABLE} dataToShow={disciplinasToShow} />
      </section>
      <Toaster />
      <FlowModal
        title={`Disciplina ${disciplineToShow?.nombre}`}
        modalBody={<div>{disciplineToShow?.descripcion}</div>}
        primaryTextButton="Ok"
        isOpen={openDetailDiscipline}
        scrollBehavior="outside"
        onAcceptModal={() => {
          setOpenDetailDiscipline(false);
        }}
        onCancelModal={() => {
          setOpenDetailDiscipline(false);
        }}
      />
      <FlowModal
        title={`Eliminar Disciplina ${disciplineToDelte?.nombre}`}
        modalBody={<div>{disciplineToDelte?.descripcion}</div>}
        primaryTextButton="¿Esta seguro que desea eliminar esta disciplina?"
        isOpen={openDeleteDiscipline}
        scrollBehavior="outside"
        onAcceptModal={deleteDicipline}
        onCancelModal={() => {
          setOpenDeleteDiscipline(false);
          setDisciplineToDelte(null);
        }}
      />
    </div>
  );
};
