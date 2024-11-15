'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputWithLabel } from '../components/InputWithLabel/InputWithLabel';
import { FlowTable } from '../components/FlowTable/FlowTable';
import {
  createDisciplineAction,
  deleteDisciplineAction,
  editDisciplineAction,
  getDisciplinasAdmin,
} from '@/app/utils/actions';
import { PencilIcon, FireIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FlowModal } from '../components/FlowModal/FlowModal';
import { Tooltip } from '@chakra-ui/react';
import toast, { Toaster } from 'react-hot-toast';
import EditCreateDisciplineModalForm from './Disciplines/EditCreateModalForm';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Jugadores' },
  { name: 'Jugadores Banca' },
  { name: 'tarjetas advertencia' },
  { name: 'tarjetas expulsión' },
  { name: 'cantidad de tiempos' },
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
  const [openCreateDiscipline, setOpenCreateDiscipline] = useState(false);
  const [disciplineToEdit, setDisciplineToEdit] = useState<any>(null);

  const isValidDiscipline = (disciplineToEdit: any) => {
    if (!disciplineToEdit) {
      return false; // Si disciplineToEdit es null o undefined, no es válido
    }

    // Verificar si las propiedades requeridas existen y no están vacías
    const requiredFields = [
      'nombre',
      'cantJugadores',
      'cantJugadoresEnBanca',
      'periodosMax',
      'tarjetasAdvertencia',
      'tarjetasExpulsion',
    ];

    // Validar que todos los campos requeridos existen y no están vacíos o llenos de espacios
    return requiredFields.every((field) => {
      const value = disciplineToEdit[field];

      // Si el valor es una cadena, verificar que no esté vacía
      if (typeof value === 'string') {
        return value.trim() !== '';
      }

      // Si el valor es un número, verificar que sea mayor que 0
      if (typeof value === 'number') {
        return value > 0;
      }

      // En cualquier otro caso, el valor no es válido
      return false;
    });
  };

  const handleClick = (dis: JSON) => {
    setDisciplineToShow(dis);
    setOpenDetailDiscipline(true);
  };

  const deleteDicipline = async () => {
    try {
      await deleteDisciplineAction(disciplineToDelte.id);
      toast.success('disciplina eliminada con éxito');
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

  const handleFormDiscipline = async () => {
    try {
      if (!disciplineToEdit.id) {
        await createDisciplineAction(disciplineToEdit);
        toast.success('Disciplina creada con éxito');
      } else {
        await editDisciplineAction(disciplineToEdit);
        toast.success('Disciplina editada con éxito');
      }
      disciplinasToTab();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDisciplineToEdit(null);
      setOpenCreateDiscipline(false);
    }
  };
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
        {!disciplina.fechaBaja && (
          <Tooltip label="Editar">
            <PencilIcon
              onClick={() => {
                setDisciplineToEdit(disciplina);
                setOpenCreateDiscipline(true);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
        {!disciplina.fechaBaja && (
          <Tooltip label="Eliminar">
            <TrashIcon
              onClick={() => {
                handleEliminarDisciplina(disciplina);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
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
          onClick={() => {
            setOpenCreateDiscipline(true);
          }}
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
        primaryTextButton="¿Está seguro que desea eliminar esta disciplina?"
        isOpen={openDeleteDiscipline}
        scrollBehavior="outside"
        onAcceptModal={deleteDicipline}
        onCancelModal={() => {
          setOpenDeleteDiscipline(false);
          setDisciplineToDelte(null);
        }}
      />
      <FlowModal
        title={`${disciplineToEdit?.id ? 'Editar disciplina' : 'Crear disciplina'}`}
        modalBody={
          <div>
            <EditCreateDisciplineModalForm
              disciplina={disciplineToEdit}
              onChange={setDisciplineToEdit}
            />
          </div>
        }
        primaryTextButton="Guardar"
        isOpen={openCreateDiscipline}
        scrollBehavior="outside"
        onAcceptModal={handleFormDiscipline}
        disabled={!isValidDiscipline(disciplineToEdit)}
        onCancelModal={() => {
          setOpenCreateDiscipline(false);
          setDisciplineToEdit(false);
        }}
      />
    </div>
  );
};
