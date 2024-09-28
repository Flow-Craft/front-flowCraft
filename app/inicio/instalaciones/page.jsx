'use client';
import React, { useEffect, useState } from 'react';
import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import { Toaster } from 'react-hot-toast';
import { CheckIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@chakra-ui/react';
import { getInstalacionesAdmin } from '@/app/utils/actions';
import { EditCreateInstall } from './components/editCreateInstall';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Ubicacion' },
  { name: 'Precio por hora' },
  { name: 'Apertura' },
  { name: 'Cierre' },
  { name: 'Activa' },
  { name: 'Acciones' },
];

export default function Page() {
  const [instalaciones, setInstalaciones] = useState([]);
  const [instalacionesToShow, setInstalacionesToShow] = useState([]);
  const [errors, setErrors] = useState([]);
  const [openCreateEditInstalacion, setOpenCreateEditInstalacion] =
    useState(false);
  const [instalacionSeleccionada, setInstalacionSeleccionada] = useState(null);
  const getInstalacionesAction = async () => {
    try {
      const result = await getInstalacionesAdmin();
      setInstalaciones(result);
      const newtipoEventosToShow =
        result &&
        result.map((dis) => {
          return {
            id: dis.id,
            nombre: dis.nombre,
            ubicacion: dis.ubicacion,
            precio: dis.precio,
            horaInicio: dis.horaInicio,
            horaCierre: dis.horaCierre,
            activa: dis.fechaBaja && (
              <CheckIcon className={`w-[50px] text-slate-500`} />
            ),
            acciones: ActionTab(result.find((disc) => disc.id === dis.id)),
          };
        });
      setInstalacionesToShow(newtipoEventosToShow);
    } catch (error) {}
  };

  const editInstalacion = () => {};

  const crearInstalacion = () => {};

  const ActionTab = (instalacion) => {
    return (
      <div className="flex flex-row gap-4">
        {!instalacion.fechaBaja ? (
          <>
            <Tooltip label="Editar">
              <PencilIcon
                className={`w-[50px] cursor-pointer text-slate-500 ${instalacion.fechaBaja ? 'cursor-none text-transparent' : 'cursor-pointer'} `}
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
        {!instalacion.fechaBaja ? (
          <>
            <Tooltip label="Eliminar">
              <TrashIcon
                className={`w-[50px] cursor-pointer text-slate-500 ${instalacion.fechaBaja ? 'cursor-none text-transparent' : 'cursor-pointer'} `}
                onClick={() => {
                  // setTipoEventosToDelte(tipoEvento);
                  // setOpenDeleteTipoEvento(true);
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
  }, []);

  return (
    <section>
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Instalaciones
      </div>
      <section>
        <div className="mt-7">
          <div className="flex w-full items-end justify-end py-5">
            <button
              className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
              type="button"
              onClick={() => {
                setErrors([]);
                setOpenCreateEditInstalacion(true);
              }}
            >
              Crear Nueva instalacion
            </button>
          </div>
          <section>
            <FlowTable Header={HEADER_TABLE} dataToShow={instalacionesToShow} />
          </section>
          <Toaster />
          <FlowModal
            title={`${instalacionSeleccionada ? 'Editar' : 'Crear'} Instalacion`}
            modalBody={
              <>
                <EditCreateInstall
                  errors={errors}
                  instalacionSeleccionada={instalacionSeleccionada}
                />
              </>
            }
            primaryTextButton={`Crear`}
            isOpen={openCreateEditInstalacion}
            scrollBehavior="outside"
            onAcceptModal={
              openCreateEditInstalacion ? editInstalacion : crearInstalacion
            }
            type="submit"
            onCancelModal={() => {
              setOpenCreateEditInstalacion(false);
              setInstalacionSeleccionada(null);
            }}
          />
          {/* <FlowModal
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
      /> */}
        </div>
      </section>
    </section>
  );
}
