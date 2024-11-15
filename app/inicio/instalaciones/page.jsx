'use client';
import React, { useEffect, useState } from 'react';

import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import toast, { Toaster } from 'react-hot-toast';
import {
  CheckIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from '@chakra-ui/react';
import {
  crearInstalacionAction,
  editarInstalacionAction,
  eliminarInstalacionAdmin,
  getInstalacionesAdmin,
  getInstalacionesEstadoAdmin,
} from '@/app/utils/actions';
import { EditCreateInstall } from './components/editCreateInstall';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import withAuthorization from '@/app/utils/autorization';
import usePermisos from '@/app/utils/permisos';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Ubicación' },
  { name: 'Precio por hora' },
  { name: 'Apertura' },
  { name: 'Cierre' },
  { name: 'Activa' },
  { name: 'Acciones' },
];

function Page() {
  const [instalaciones, setInstalaciones] = useState([]);
  const [instalacionesToShow, setInstalacionesToShow] = useState([]);
  const [errors, setErrors] = useState([]);
  const [openCreateEditInstalacion, setOpenCreateEditInstalacion] =
    useState(false);
  const [disable, setDisable] = useState(false);
  const [instalacionSeleccionada, setInstalacionSeleccionada] = useState(null);
  const [instalacionEliminar, setInstalacionEliminar] = useState(false);
  const [estadoInstalacion, setEstadoInstalacion] = useState([]);
  const [edit, setEdit] = useState(false);
  const { getPermisosByNombre } = usePermisos();
  const permisos = getPermisosByNombre('Instalaciones');

  const getInstalacionesAction = async () => {
    try {
      const result = await getInstalacionesAdmin();
      setInstalaciones(result);
      const newtipoEventosToShow =
        result &&
        result.map((dis) => {
          return {
            id: dis.instalacion.id,
            nombre: dis.instalacion.nombre,
            ubicacion: dis.instalacion.ubicacion,
            precio: dis.instalacion.precio,
            horaInicio: dis.instalacion.horaInicio,
            horaCierre: dis.instalacion.horaCierre,
            activa: dis.activo && (
              <CheckIcon className={`w-[50px] text-slate-500`} />
            ),
            acciones: ActionTab(
              result.find((disc) => disc.instalacion.id === dis.instalacion.id),
              permisos,
            ),
          };
        });
      setInstalacionesToShow(newtipoEventosToShow);
    } catch (error) {}
  };

  const getInstalacionesEstado = async () => {
    const result = await getInstalacionesEstadoAdmin();
    const stateOptions =
      result &&
      result.map((r) => {
        if (!r.fechaBaja) {
          return {
            value: r.id,
            label: r.nombreEstado,
          };
        }
      });
    setEstadoInstalacion(stateOptions);
  };

  const editInstalacion = async (e) => {
    try {
      setErrors([]);
      const instalacionAEditar = {
        Id: instalacionSeleccionada.instalacion.id,
        Nombre: e.target.nombre.value,
        Ubicacion: e.target.ubicacion.value,
        Precio: e.target.precio.value,
        Condiciones: e.target.condiciones.value,
        HoraInicio: `${e.target.inicio.value.split(':').length === 2 ? `${e.target.inicio.value}:00` : e.target.inicio.value}`,
        HoraCierre: `${e.target.cierre.value.split(':').length === 2 ? `${e.target.cierre.value}:00` : e.target.cierre.value}`,
        EstadoId: Number(e.target.estadoInstalacion.value),
      };
      const result = await editarInstalacionAction(instalacionAEditar);
      if (result?.errors) {
        setErrors(result.errors);
        return;
      }
      toast.success('instalación editada con éxito');
      getInstalacionesAction();
      setOpenCreateEditInstalacion(false);
      setEdit(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const crearInstalacion = async (e) => {
    try {
      setErrors([]);
      const instalacionACrear = {
        Nombre: e.target.nombre.value,
        Ubicacion: e.target.ubicacion.value,
        Precio: e.target.precio.value,
        Condiciones: e.target.condiciones.value,
        HoraInicio: `${e.target.inicio.value}:00`,
        HoraCierre: `${e.target.cierre.value}:00`,
        EstadoId: Number(e.target.estadoInstalacion.value),
      };

      const result = await crearInstalacionAction(instalacionACrear);
      if (result?.errors) {
        setErrors(result.errors);
        return;
      }
      toast.success('instalación creada con éxito');
      getInstalacionesAction();
      setOpenCreateEditInstalacion(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEliminarInstalacion = async () => {
    try {
      await eliminarInstalacionAdmin(instalacionSeleccionada.instalacion.id);
      toast.success('instalación eliminada con éxito');
      getInstalacionesAction();
      setInstalacionEliminar(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const ActionTab = (instalacion) => {
    const estadoInstalacion =
      instalacion?.instalacion?.instalacionHistoriales.reverse();
    const ultimoEstado = estadoInstalacion[0];

    return (
      <div className="flex flex-row gap-4">
        {ultimoEstado?.instalacionEstado?.nombreEstado !== 'Inactivo' && (
          <Tooltip label="Ver detalles">
            <MagnifyingGlassIcon
              className={`w-[50px] cursor-pointer text-slate-500 `}
              onClick={() => {
                setInstalacionSeleccionada(instalacion);
                setOpenCreateEditInstalacion(true);
                setDisable(true);
              }}
            />
          </Tooltip>
        )}
        {ultimoEstado?.instalacionEstado?.nombreEstado !== 'Inactivo' &&
        permisos.some(
          (permiso) => permiso.funcionalidades === 'ABM instalación',
        ) ? (
          <>
            <Tooltip label="Editar">
              <PencilIcon
                className={`w-[50px] cursor-pointer text-slate-500`}
                onClick={() => {
                  setInstalacionSeleccionada(instalacion);
                  setOpenCreateEditInstalacion(true);
                  setEdit(true);
                }}
              />
            </Tooltip>
          </>
        ) : (
          <>
            <PencilIcon className={`w-[50px] text-transparent `} />
          </>
        )}
        {ultimoEstado?.instalacionEstado?.nombreEstado !== 'Inactivo' &&
        permisos.some(
          (permiso) => permiso.funcionalidades === 'ABM instalación',
        ) ? (
          <>
            <Tooltip label="Eliminar">
              <TrashIcon
                className={`w-[50px] cursor-pointer text-slate-500`}
                onClick={() => {
                  setInstalacionSeleccionada(instalacion);
                  setInstalacionEliminar(true);
                }}
              />
            </Tooltip>
          </>
        ) : (
          <>
            <PencilIcon className={`w-[50px] text-transparent `} />
          </>
        )}
      </div>
    );
  };
  useEffect(() => {
    getInstalacionesAction();
    getInstalacionesEstado();
  }, [permisos]);

  return (
    <section>
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Instalaciones
      </div>
      <section>
        <div className="mt-7">
          <div className="flex w-full items-end justify-end py-5">
            {permisos.some(
              (permiso) => permiso.funcionalidades === 'ABM instalación',
            ) && (
              <button
                className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
                type="button"
                onClick={() => {
                  setErrors([]);
                  setEdit(false);
                  setOpenCreateEditInstalacion(true);
                  setInstalacionSeleccionada(null);
                }}
              >
                Crear nueva instalación
              </button>
            )}
          </div>
          <section>
            <FlowTable Header={HEADER_TABLE} dataToShow={instalacionesToShow} />
          </section>
          <Toaster />
          <FlowModal
            title={`${disable ? 'Ver' : instalacionSeleccionada ? 'Editar' : 'Crear'} Instalación`}
            modalBody={
              <EditCreateInstall
                errors={errors}
                instalacionSeleccionada={instalacionSeleccionada}
                disable={disable}
                estadoInstalacion={estadoInstalacion}
              />
            }
            primaryTextButton={`${disable ? 'Ver' : instalacionSeleccionada ? 'Editar' : 'Crear'}`}
            isOpen={openCreateEditInstalacion}
            scrollBehavior="outside"
            onAcceptModal={
              disable
                ? () => {
                    setOpenCreateEditInstalacion(false);
                    setInstalacionSeleccionada(null);
                    setDisable(false);
                  }
                : edit
                  ? editInstalacion
                  : crearInstalacion
            }
            type="submit"
            onCancelModal={() => {
              setOpenCreateEditInstalacion(false);
              setInstalacionSeleccionada(null);
              setDisable(false);
            }}
          />
          <FlowModal
            title={`Seguro que desea eliminar la siguiente instalación ${instalacionSeleccionada?.instalacion?.nombre}`}
            modalBody={<div></div>}
            primaryTextButton={`Sí`}
            isOpen={instalacionEliminar}
            scrollBehavior="outside"
            onAcceptModal={handleEliminarInstalacion}
            onCancelModal={() => {
              setInstalacionSeleccionada(null);
              setDisable(false);
              setInstalacionEliminar(false);
            }}
          />
        </div>
      </section>
    </section>
  );
}

export default withAuthorization(Page, 'Instalaciones');
