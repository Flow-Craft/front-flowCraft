'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputWithLabel } from '../../components/InputWithLabel/InputWithLabel';
import { FlowTable } from '../../components/FlowTable/FlowTable';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FlowModal } from '../../components/FlowModal/FlowModal';
import { Tooltip } from '@chakra-ui/react';
import toast, { Toaster } from 'react-hot-toast';
import {
  crearEventoAdmin,
  crearUsuarioEstadoAdmin,
  editarEventoEstadoAdmin,
  editarUsuarioEstadoAdmin,
  eliminarEventoEstadoAdmin,
  eliminarUsuarioEstadoAdmin,
  getEventosEstadoAdmin,
  getUsuarioEstadoAdmin,
} from '@/app/utils/actions';
import { EditarCrearEquipo } from '../equipo/EditarCrearEquipo';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Descripción' },
  { name: 'Acciones' },
];

export const EventosTab = () => {
  const [equipoToShow, setEquipoToShow] = useState([]);
  const [equipo, setEquipo] = useState([]);
  const [openDeleteEquipo, setOpenDeleteEquipo] = useState(false);
  const [equipoToDelte, setEquipoToDelte] = useState(null);
  const [openCreateEquipo, setOpenCreateEquipo] = useState(false);
  const [equipoToEdit, setEquipoToEdit] = useState(null);
  const [errors, setErrors] = useState([]);

  const deleteCategoria = async () => {
    try {
      await eliminarEventoEstadoAdmin(equipoToDelte.id);
      toast.success('Evento Estado eliminado con éxito');
      equipoToTab();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setOpenDeleteEquipo(false);
      setEquipoToDelte(null);
    }
  };

  const filterEquipo = (e) => {
    e.preventDefault();
    const filtros = {
      nombre: e.target.nombre.value.trim(), // Asegura que no haya espacios vacíos
    };
    // Filtramos los usuarios
    const disFiltered = equipo.filter((dis) => {
      // Filtrar por nombre si está presente
      const filtroNombreValido = filtros.nombre
        ? dis.nombreEstado.toLowerCase().includes(filtros.nombre.toLowerCase())
        : true; // Ignorar si está vacío

      // Devuelve true si pasa todos los filtros aplicables
      return filtroNombreValido;
    });
    // Mapeamos los usuarios filtrados
    const equipoFiltradas =
      disFiltered &&
      disFiltered.map((dis) => {
        return {
          id: dis.id,
          nombreEstado: dis.nombreEstado,
          descripcionEstado: dis.descripcionEstado,
          acciones: ActionTab(equipo.find((disc) => disc.id === dis.id)),
        };
      });
    setEquipoToShow(equipoFiltradas);
  };

  const handleEliminarEquipo = (dis) => {
    setOpenDeleteEquipo(true);
    setEquipoToDelte(dis);
  };

  const handleFormEquipo = async (e) => {
    try {
      e.target.nombreEstado;
      setErrors([]);
      let equipo = {
        NombreEstado: e.target.nombre.value,
        DescripcionEstado: e.target.descripcion.value,
      };
      const result = await crearEventoAdmin(equipo, setErrors);
      if (result?.error) {
        setErrors(result.errors);
        return;
      }
      toast.success('Evento Estado creado con éxito');
      equipoToTab();
      setOpenCreateEquipo(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editarEquipo = async (e) => {
    try {
      let categoria = {
        Id: equipoToEdit.id,
        NombreEstado: e.target.nombre.value,
        DescripcionEstado: e.target.descripcion.value,
      };
      const result = await editarEventoEstadoAdmin(categoria);
      if (result?.error) {
        setErrors(result.errors);
        return;
      }
      toast.success('Evento Estado editado con éxito');
      equipoToTab();
      setOpenCreateEquipo(false);
      setEquipoToEdit({});
    } catch (error) {
      toast.error(error.message);
    }
  };

  const equipoToTab = async () => {
    try {
      const result = await getEventosEstadoAdmin();
      setEquipo(result);
      const equipo =
        result &&
        result.map((dis) => {
          return {
            id: dis.id,
            nombreEstado: dis.nombreEstado,
            descripcionEstado: dis.descripcionEstado,
            acciones: ActionTab(result.find((disc) => disc.id === dis.id)),
          };
        });
      setEquipoToShow(equipo);
    } catch (error) {}
  };
  const ActionTab = (equipo) => {
    return (
      <div className="flex flex-row gap-4">
        {!equipo.fechaBaja ? (
          <Tooltip label="Editar">
            <PencilIcon
              onClick={() => {
                setEquipoToEdit(equipo);
                setOpenCreateEquipo(true);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        ) : (
          <>
            <PencilIcon className={`w-[50px] text-transparent `} />
          </>
        )}
        {!equipo.fechaBaja && (
          <Tooltip label="Eliminar">
            <TrashIcon
              onClick={() => {
                handleEliminarEquipo(equipo);
              }}
              className="w-[50px] cursor-pointer text-slate-500"
            />
          </Tooltip>
        )}
      </div>
    );
  };
  useEffect(() => {
    equipoToTab();
  }, []);
  return (
    <div className="mt-7">
      <form
        className="flex w-full flex-wrap items-center"
        onSubmit={filterEquipo}
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
            setOpenCreateEquipo(true);
          }}
        >
          Crear Estado Evento
        </button>
      </form>
      <section>
        <FlowTable Header={HEADER_TABLE} dataToShow={equipoToShow} />
      </section>
      <Toaster />
      <FlowModal
        title={`Eliminar Estado Evento ${equipoToDelte?.nombreEstado}`}
        modalBody={
          <div>
            ¿Esta seguro que desea eliminar esta evento Estado?
          </div>
        }
        primaryTextButton="Si"
        isOpen={openDeleteEquipo}
        scrollBehavior="outside"
        onAcceptModal={deleteCategoria}
        onCancelModal={() => {
          setOpenDeleteEquipo(false);
          setEquipoToDelte(null);
        }}
      />
      <FlowModal
        title={`${equipoToEdit?.id ? 'Editar evento estado' : 'Crear evento estado'}`}
        modalBody={
          <div>
            <EditarCrearEquipo errors={errors} equipo={equipoToEdit} />
          </div>
        }
        primaryTextButton="Guardar"
        isOpen={openCreateEquipo}
        scrollBehavior="outside"
        onAcceptModal={equipoToEdit?.id ? editarEquipo : handleFormEquipo}
        type="submit"
        onCancelModal={() => {
          setOpenCreateEquipo(false);
          setEquipoToEdit({});
          setErrors([]);
        }}
      />
    </div>
  );
};
