import {
  crearTipoEventosAdmin,
  editarTipoEventosAdmin,
  eliminarTipoEventosAdmin,
  getTipoEventosAdmin,
} from '@/app/utils/actions';
import { Tooltip } from '@chakra-ui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { FlowTable } from '../components/FlowTable/FlowTable';
import toast, { Toaster } from 'react-hot-toast';
import { FlowModal } from '../components/FlowModal/FlowModal';
import { InputWithLabel } from '../components/InputWithLabel/InputWithLabel';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Descripcion' },
  { name: 'Acciones' },
];
export const TipoEventos = () => {
  const [tipoEventosToShow, setTipoEventosToShow] = useState([]);
  const [tipoEventos, setTipoEventos] = useState([]);
  const [openDeleteTipoEvento, setOpenDeleteTipoEvento] = useState(false);
  const [openCreateEditTipoEvento, setOpenCreateEditTipoEvento] =
    useState(false);
  const [tipoEventosToDelte, setTipoEventosToDelte] = useState(null);
  const [errors, setErrors] = useState([]);

  const crearTipoEvento = async (e) => {
    try {
      setErrors([]);
      const tipoAcrear = {
        NombreTipoEvento: e.target.nombre.value,
        Descripcion: e.target.descripcion.value,
      };
      const result = await crearTipoEventosAdmin(tipoAcrear);
      console.log('hola');
      if (result?.errors) {
        console.log('result?.errors', result?.errors);
        setErrors(result?.errors);
        return;
      } else {
        toast.success('Tipo creado exitosamente');
        TipoEventoToTab();
        setTipoEventosToDelte(null);
        setOpenCreateEditTipoEvento(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editTipoEvento = async (e) => {
    try {
      const tipoAcrear = {
        Id: tipoEventosToDelte.id,
        NombreTipoEvento:
          e.target.nombre.value || tipoEventosToDelte.nombreTipoEvento,
        Descripcion:
          e.target.descripcion.value || tipoEventosToDelte.descripcion,
      };
      await editarTipoEventosAdmin(tipoAcrear);
      toast.success('Tipo editado exitosamente');
      TipoEventoToTab();
      setTipoEventosToDelte(null);
      setOpenCreateEditTipoEvento(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEliminarTipoEvento = async () => {
    try {
      const tipoAEliminar = {
        Id: tipoEventosToDelte.id,
      };
      await eliminarTipoEventosAdmin(tipoAEliminar);
      toast.success('Tipo eliminado exitosamente');
      TipoEventoToTab();
      setTipoEventosToDelte(null);
      setOpenDeleteTipoEvento(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const TipoEventoToTab = async () => {
    try {
      const result = await getTipoEventosAdmin();
      setTipoEventos(result);
      const newtipoEventosToShow =
        result &&
        result.map((dis) => {
          return {
            id: dis.id,
            nombre: dis.nombreTipoEvento,
            descripcion: dis.descripcion,
            acciones: ActionTab(result.find((disc) => disc.id === dis.id)),
          };
        });
      setTipoEventosToShow(newtipoEventosToShow);
    } catch (error) {}
  };
  const ActionTab = (tipoEvento) => {
    return (
      <div className="flex flex-row gap-4">
        {!tipoEvento.fechaBaja ? (
          <>
            <Tooltip label="Editar">
              <PencilIcon
                className={`w-[50px] cursor-pointer text-slate-500 ${tipoEvento.fechaBaja ? 'cursor-none text-transparent' : 'cursor-pointer'} `}
                onClick={() => {
                  setTipoEventosToDelte(tipoEvento);
                  setOpenCreateEditTipoEvento(true);
                }}
              />
            </Tooltip>
          </>
        ) : (
          <>
            <PencilIcon className={`w-[50px] text-transparent `} />
          </>
        )}
        {!tipoEvento.fechaBaja ? (
          <>
            <Tooltip label="Eliminar">
              <TrashIcon
                className={`w-[50px] cursor-pointer text-slate-500 ${tipoEvento.fechaBaja ? 'cursor-none text-transparent' : 'cursor-pointer'} `}
                onClick={() => {
                  setTipoEventosToDelte(tipoEvento);
                  setOpenDeleteTipoEvento(true);
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
    TipoEventoToTab();
  }, []);
  return (
    <div className="mt-7">
      <div className="flex w-full items-end justify-end py-5">
        <button
          className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
          type="button"
          onClick={() => {
            setErrors([]);
            setOpenCreateEditTipoEvento(true);
          }}
        >
          Crear Tipo Evento
        </button>
      </div>
      <section>
        <FlowTable Header={HEADER_TABLE} dataToShow={tipoEventosToShow} />
      </section>
      <Toaster />
      <FlowModal
        title={`${tipoEventosToDelte ? 'Editar' : 'Crear'} Tipo Evento`}
        modalBody={
          <div>
            <InputWithLabel
              name={'nombre'}
              type="text"
              label="Nombre tipo evento"
              defaultValue={tipoEventosToDelte?.nombreTipoEvento}
              required
            />
            <label
              className="mb-3 mt-5 block text-lg font-medium text-gray-900"
              htmlFor={'descripcion'}
            >
              Descripcion
              <label className="text-red-600"> *</label>
              <textarea
                name="descripcion"
                rows="5"
                cols="50"
                defaultValue={tipoEventosToDelte?.descripcion}
                className={`w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
              />
            </label>
            {errors.length > 0 && (
              <div className="text-red-600">
                Todos los campos son obligatorios
              </div>
            )}
          </div>
        }
        primaryTextButton={tipoEventosToDelte ? 'Editar ' : `Crear`}
        isOpen={openCreateEditTipoEvento}
        scrollBehavior="outside"
        onAcceptModal={tipoEventosToDelte ? editTipoEvento : crearTipoEvento}
        type="submit"
        onCancelModal={() => {
          setOpenCreateEditTipoEvento(false);
          setTipoEventosToDelte(null);
        }}
      />
      <FlowModal
        title={`Seguro que desea eliminar el tipo de evento ${tipoEventosToDelte?.nombreTipoEvento}`}
        modalBody={<div></div>}
        primaryTextButton={`Si`}
        isOpen={openDeleteTipoEvento}
        scrollBehavior="outside"
        onAcceptModal={handleEliminarTipoEvento}
        onCancelModal={() => {
          setOpenDeleteTipoEvento(false);
          setTipoEventosToDelte(null);
        }}
      />
    </div>
  );
};
