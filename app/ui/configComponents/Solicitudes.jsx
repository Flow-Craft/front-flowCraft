'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputWithLabel } from '../components/InputWithLabel/InputWithLabel';
import { FlowTable } from '../components/FlowTable/FlowTable';
import { TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { FlowModal } from '../components/FlowModal/FlowModal';
import { Tooltip } from '@chakra-ui/react';
import toast, { Toaster } from 'react-hot-toast';
import { EditCreatProfile } from './Perfiles/EditCreatProfile';
import {
  gestionarSolicitudAdmin,
  getSolicitudesAdmin,
} from '../../utils/actions';
import { formatDate } from '@/app/utils/functions';
import { SelectWithLabel } from '../components/SelectWithLabel/SelectWithLabel';

const HEADER_TABLE = [
  { name: 'Id' },
  { name: 'Nombre' },
  { name: 'Apellido' },
  { name: 'DNI' },
  { name: 'Email' },
  { name: 'Estado' },
  { name: 'Fecha de creacion' },
  { name: 'Acciones' },
];

const OPTIONS_SOLICITUDES = [
  { label: 'Pendientes', value: 1 },
  { label: 'Aprobadas', value: 2 },
  { label: 'Rechazadas', value: 3 },
];

export const SolicitudesTab = () => {
  const [solicitudesToShow, setSolicitudesToShow] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [openDeleteSocilitudes, setopenDeleteSocilitudes] = useState(false);
  const [solicitudesToDelte, setSolicitudesToDelte] = useState(null);
  const [typeSelected, setTypeSelected] = useState(OPTIONS_SOLICITUDES[0]);

  const rechazarSolicutud = async (e) => {
    try {
      const refusedAction = {
        Id: solicitudesToDelte.id,
        Accion: 'Rechazada',
        MotivoRechazo: e.target.razon.value,
      };
      await gestionarSolicitudAdmin(refusedAction);
      toast.success('Solicitud Rechaza exitosamente');
      SolicutedToTab(typeSelected);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setopenDeleteSocilitudes(false);
      setSolicitudesToDelte(null);
    }
  };

  const filterSolicitudes = async (e) => {
    e.preventDefault();
    // Capturamos los valores de los filtros
    const filtros = {
      nombre: e.target.nombre.value.trim(), // Asegura que no haya espacios vacíos
      dni: e.target.dni.value.trim(), // Asegura que no haya espacios vacíos
      estado: e.target.activo.value,
    };
    const typeSelected = OPTIONS_SOLICITUDES.find(
      (value) => value.value == e.target.activo.value,
    );
    const result = await getSolicitudesAdmin(e.target.activo.value);
    setSolicitudes(result);
    setTypeSelected(typeSelected);

    // // Filtramos los usuarios
    const solicitudesFilteres = result.filter((solicitud) => {
      // Filtrar por nombre si está presente
      const filtroNombreValido = filtros.nombre
        ? solicitud.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
        : true; // Ignorar si está vacío

      // Filtrar por DNI si está presente
      const filtroDniValido = filtros.dni
        ? solicitud.dni.toString().includes(filtros.dni)
        : true; // Ignorar si está vacío

      // Devuelve true si pasa todos los filtros aplicables
      return filtroNombreValido && filtroDniValido;
    });
    // Mapeamos los usuarios filtrados
    const solicitu = solicitudesFilteres.map((dis) => {
      return {
        ids: dis.id,
        nombre: dis.nombre,
        apellido: dis.apellido,
        dni: dis.dni,
        email: dis.eMail,
        estado: dis.estado,
        fechaCreacion: formatDate(dis.fechaCreacion),
        acciones: ActionTab(result.find((disc) => disc.id === dis.id)),
        id: dis.id,
      };
    });
    setSolicitudesToShow(solicitu);
  };

  const handleEliminarDisciplina = (dis) => {
    setopenDeleteSocilitudes(true);
    setSolicitudesToDelte(dis);
  };

  const handleAcceptSolicitud = async (solicitud) => {
    try {
      await gestionarSolicitudAdmin({
        Id: solicitud.id.toString(),
        Accion: 'Aprobada',
      });
      toast.success('Solicitud aprobada');
      SolicutedToTab(typeSelected);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const SolicutedToTab = async (option) => {
    try {
      const result = await getSolicitudesAdmin(option.value);
      setSolicitudes(result);
      const newsolicitudesToShow =
        result &&
        result.map((dis) => {
          return {
            ids: dis.id,
            nombre: dis.nombre,
            apellido: dis.apellido,
            dni: dis.dni,
            email: dis.eMail,
            estado: dis.estado,
            fechaCreacion: formatDate(dis.fechaCreacion),
            acciones: ActionTab(result.find((disc) => disc.id === dis.id)),
            id: dis.id,
          };
        });
      setSolicitudesToShow(newsolicitudesToShow);
    } catch (error) {}
  };
  const ActionTab = (solicitud) => {
    return (
      <div className="flex flex-row gap-4">
        <Tooltip label="Aprobar">
          <CheckIcon
            onClick={() => {
              if (solicitud.estado === 'Pendiente')
                handleAcceptSolicitud(solicitud);
            }}
            className={`w-[50px] text-slate-500 ${solicitud.estado !== 'Pendiente' ? 'cursor-none' : 'cursor-pointer'}`}
          />
        </Tooltip>
        <Tooltip label="Rechazar">
          <TrashIcon
            onClick={() => {
              if (solicitud.estado === 'Pendiente')
                handleEliminarDisciplina(solicitud);
            }}
            className={`w-[50px] text-slate-500 ${solicitud.estado !== 'Pendiente' ? 'cursor-none' : 'cursor-pointer'}`}
          />
        </Tooltip>
      </div>
    );
  };
  useEffect(() => {
    SolicutedToTab(typeSelected);
  }, []);
  return (
    <div className="mt-7">
      <form
        className="flex w-full flex-wrap items-center"
        onSubmit={filterSolicitudes}
      >
        <div className="flex flex-row flex-wrap gap-5">
          <section className="flex flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Nombre:
            </label>
            <InputWithLabel name={'nombre'} type="text" />
          </section>
          <section className="flex flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              DNI:
            </label>
            <InputWithLabel name={'dni'} type="number" />
          </section>
          <div className="flex min-w-[170px] flex-row items-center gap-3">
            <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
              Estado:
            </label>
            <SelectWithLabel
              name="activo"
              options={OPTIONS_SOLICITUDES}
              defaultValue={typeSelected}
            />
          </div>
          <button
            className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
            type="submit"
          >
            Buscar
          </button>
        </div>
      </form>
      <section>
        <FlowTable Header={HEADER_TABLE} dataToShow={solicitudesToShow} />
      </section>
      <Toaster />
      <FlowModal
        title={`Razón del rechazo de la solicitud de ${solicitudesToDelte?.nombre} ${solicitudesToDelte?.apellido} DNI: ${solicitudesToDelte?.dni}`}
        modalBody={
          <div>
            <textarea
              name="razon"
              rows="5"
              cols="50"
              className={`w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
            />
          </div>
        }
        primaryTextButton="Rechazar solicitud"
        isOpen={openDeleteSocilitudes}
        scrollBehavior="outside"
        onAcceptModal={rechazarSolicutud}
        type="submit"
        onCancelModal={() => {
          setopenDeleteSocilitudes(false);
          setSolicitudesToDelte(null);
        }}
      />
    </div>
  );
};
