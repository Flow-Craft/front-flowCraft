'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputWithLabel } from '../components/InputWithLabel/InputWithLabel';
import { FlowTable } from '../components/FlowTable/FlowTable';
import { PencilIcon, FireIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FlowModal } from '../components/FlowModal/FlowModal';
import { Tooltip } from '@chakra-ui/react';
import toast, { Toaster } from 'react-hot-toast';
import EditCreateDisciplineModalForm from './Disciplines/EditCreateModalForm';
import { getPerfilesAdmin } from '../../utils/actions';
import { formatDate } from '@/app/utils/functions';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Descripcion' },
  { name: 'Alta' },
  { name: 'Edicion' },
  { name: 'Baja' },
  { name: 'Acciones' },
];

export const ProfilesTab = () => {
  const [profilesToShow, setProfilesToShow] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [openDetailDiscipline, setOpenDetailDiscipline] = useState(false);
  const [disciplineToShow, setDisciplineToShow] = useState(null);
  const [openDeleteDiscipline, setOpenDeleteDiscipline] = useState(false);
  const [disciplineToDelte, setDisciplineToDelte] = useState(null);
  const [openCreateDiscipline, setOpenCreateDiscipline] = useState(false);
  const [disciplineToEdit, setDisciplineToEdit] = useState(null);

  const isValidDiscipline = (disciplineToEdit) => {
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

  const handleClick = (dis) => {
    setDisciplineToShow(dis);
    setOpenDetailDiscipline(true);
  };

  const deleteDicipline = async () => {
    try {
      await deleteDisciplineAction(disciplineToDelte.id);
      toast.success('disciplina eliminada con exito');
      disciplinasToTab();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setOpenDeleteDiscipline(false);
      setDisciplineToDelte(null);
    }
  };

  const filterUsers = (e) => {
    e.preventDefault();
    const filtros = {
      nombre: e.target.nombre.value.trim(), // Asegura que no haya espacios vacíos
    };
    // Filtramos los usuarios
    const disFiltered = disciplinas.filter((dis) => {
      // Filtrar por nombre si está presente
      const filtroNombreValido = filtros.nombre
        ? dis.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
        : true; // Ignorar si está vacío

      // Devuelve true si pasa todos los filtros aplicables
      return filtroNombreValido;
    });
    // Mapeamos los usuarios filtrados
    const filterMappeds = disFiltered.map((dis) => {
      return {
        nombre: dis.nombre,
        cantJugadores: dis.cantJugadores,
        cantJugadoresEnBanca: dis.cantJugadoresEnBanca,
        periodosMax: dis.periodosMax,
        tarjetasAdvertencia: dis.tarjetasAdvertencia,
        tarjetasExpulsion: dis.tarjetasExpulsion,
        eliminada: dis.fechaBaja ? 'Si' : 'No',
        acciones: ActionTab(disciplinas.find((usr) => usr.id === dis.id)),
        id: dis.id,
      };
    });

    setDisciplinasToShow(filterMappeds);
  };

  const handleEliminarDisciplina = (dis) => {
    setOpenDeleteDiscipline(true);
    setDisciplineToDelte(dis);
  };

  const handleFormDiscipline = async () => {
    try {
      if (!disciplineToEdit.id) {
        await createDisciplineAction(disciplineToEdit);
        toast.success('Disciplina creada con exito');
      } else {
        await editDisciplineAction(disciplineToEdit);
        toast.success('Disciplina editada con exito');
      }
      disciplinasToTab();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDisciplineToEdit(null);
      setOpenCreateDiscipline(false);
    }
  };
  const PerfilesToTab = async () => {
    try {
      const result = await getPerfilesAdmin();
      setProfiles(result);
      const newProfilesToShow =
        result &&
        result.map((dis) => {
          return {
            nombre: dis.nombrePerfil,
            descripcion: dis.descripcionPerfil,
            fechaCreacion: formatDate(dis.fechaCreacion),
            fechaModificacion: dis.fechaModificacion
              ? formatDate(dis.fechaModificacion)
              : '',
            fechaBaja: dis.fechaBaja ? formatDate(dis.fechaBaja) : '',
            acciones: ActionTab(result.find((disc) => disc.id === dis.id)),
            id: dis.id,
          };
        });
      setProfilesToShow(newProfilesToShow);
    } catch (error) {}
  };
  const ActionTab = (disciplina) => {
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
    PerfilesToTab();
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
          Crear Perfil
        </button>
      </form>
      <section>
        <FlowTable Header={HEADER_TABLE} dataToShow={profilesToShow} />
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
