import {
  crearTipoAccionPartidosAdmin,
  editarTipoAccionPartidoAdmin,
  editarTipoEventosAdmin,
  eliminarTipoAccionPartidoAdmin,
  eliminarTipoEventosAdmin,
  getDisciplinasAdmin,
  getTipoAccionPartidosAdmin,
  getTipoEventosAdmin,
} from '@/app/utils/actions';
import { Tooltip } from '@chakra-ui/react';
import { CheckIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { FlowTable } from '../components/FlowTable/FlowTable';
import toast, { Toaster } from 'react-hot-toast';
import { FlowModal } from '../components/FlowModal/FlowModal';
import { InputWithLabel } from '../components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '../components/SelectWithLabel/SelectWithLabel';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Disciplina' },
  { name: 'Descripcion' },
  { name: 'Modifica Advertencia' },
  { name: 'Modifica expulsion' },
  { name: 'Se visualizara en' },
  { name: 'secuencial' },
  { name: 'Acciones' },
];

const opcionesDePartido = [
  { value: 0, label: 'Leccion y partido ' },
  { value: 1, label: 'Solo en partido ' },
  { value: 2, label: 'Solo en lección ' },
];
export const TiposAccionPartido = () => {
  const [tipoAccionPartido, setTipoAccionPartido] = useState([]);
  const [tipoAccionPartidoToShow, setTipoAccionPartidoToShow] = useState([]);
  const [openDeleteAccionPartido, setOpenDeleteAccionPartido] = useState(false);
  const [openCreateEditAccionPartido, setOpenCreateEditAccionPartido] =
    useState(false);
  const [tipoAccionPartidoToDelte, setTipoAccionPartidoToDelte] =
    useState(null);
  const [errors, setErrors] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  const crearTipoAccionPartido = async (e) => {
    try {
      setErrors([]);
      const tipoAccionPartido = {
        NombreTipoAccion: e.target.nombre.value,
        Descripcion: e.target.descripcion.value,
        ModificaTarjetasAdvertencia: e.target.tarjAdvertencia.checked,
        ModificaTarjetasExpulsion: e.target.tarjExpulsion.checked,
        secuencial: e.target.secuencial.checked,
        IdDisciplina: e.target.disciplina?.value?.toString(),
        EsPartido: e.target.esPartido?.value?.toString(),
      };
      const result = await crearTipoAccionPartidosAdmin(tipoAccionPartido);
      if (result?.errors) {
        setErrors(result?.errors);
        return;
      } else {
        toast.success('Tipo creado exitosamente');
        TipoAccionPartidoToTab();
        setOpenCreateEditAccionPartido(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDisciplinas = async () => {
    const result = await getDisciplinasAdmin();
    const resultToSelect =
      result &&
      result.map((dis) => ({
        value: dis.id,
        label: dis.nombre,
      }));
    setDisciplinas(resultToSelect);
  };

  const editTipoAccionPartido = async (e) => {
    try {
      const tipoAccionPartido = {
        Id: tipoAccionPartidoToDelte.id,
        NombreTipoAccion: e.target.nombre.value,
        Descripcion: e.target.descripcion.value,
        ModificaTarjetasAdvertencia: e.target.tarjAdvertencia.checked,
        ModificaTarjetasExpulsion: e.target.tarjExpulsion.checked,
        secuencial: e.target.secuencial.checked,
        IdDisciplina: e.target.disciplina?.value?.toString(),
        EsPartido: e.target.esPartido?.value?.toString(),
      };
      await editarTipoAccionPartidoAdmin(tipoAccionPartido);
      toast.success('Tipo editado samente');
      TipoAccionPartidoToTab();
      setTipoAccionPartidoToDelte(null);
      setOpenCreateEditAccionPartido(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEliminarTipoEvento = async () => {
    try {
      const tipoAEliminar = {
        Id: tipoAccionPartidoToDelte.id,
      };
      await eliminarTipoAccionPartidoAdmin(tipoAEliminar);
      toast.success('Tipo eliminado exitosamente');
      TipoAccionPartidoToTab();
      setTipoAccionPartidoToDelte(null);
      setOpenDeleteAccionPartido(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const TipoAccionPartidoToTab = async () => {
    try {
      const result = await getTipoAccionPartidosAdmin();
      console.log('result', result);
      setTipoAccionPartido(result);
      const newtipoAccionPartidoToShow =
        result &&
        result.map((dis) => {
          return {
            id: dis.id,
            nombre: dis.nombreTipoAccion,
            disciplina: dis.disciplina?.nombre || 'Futbol',
            descripcion: dis.descripcion,
            modificaTarjetasAdvertencia: dis.modificaTarjetasAdvertencia && (
              <CheckIcon className={`w-[50px] text-slate-500`} />
            ),
            modificaTarjetasExpulsion: dis.modificaTarjetasExpulsion && (
              <CheckIcon className={`w-[50px] text-slate-500`} />
            ),
            esPartido: `${opcionesDePartido[dis.esPartido].label}`,
            secuencial: dis.secuencial && (
              <CheckIcon className={`w-[50px] text-slate-500`} />
            ),
            acciones: ActionTab(result.find((disc) => disc.id === dis.id)),
          };
        });
      setTipoAccionPartidoToShow(newtipoAccionPartidoToShow);
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
                  setTipoAccionPartidoToDelte(tipoEvento);
                  setOpenCreateEditAccionPartido(true);
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
                  setTipoAccionPartidoToDelte(tipoEvento);
                  setOpenDeleteAccionPartido(true);
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
    TipoAccionPartidoToTab();
    getDisciplinas();
  }, []);
  return (
    <div className="mt-7">
      <div className="flex w-full items-end justify-end py-5">
        <button
          className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
          type="button"
          onClick={() => {
            setErrors([]);
            setOpenCreateEditAccionPartido(true);
          }}
        >
          Crear Tipo Accion Partido
        </button>
      </div>
      <section>
        <FlowTable Header={HEADER_TABLE} dataToShow={tipoAccionPartidoToShow} />
      </section>
      <Toaster />
      <FlowModal
        title={`${tipoAccionPartidoToDelte ? 'Editar' : 'Crear'} Tipo accion partido`}
        modalBody={
          <div>
            <InputWithLabel
              name={'nombre'}
              type="text"
              label="Nombre accion partido"
              defaultValue={tipoAccionPartidoToDelte?.nombreTipoAccion}
              required
            />
            <SelectWithLabel
              name="disciplina"
              options={disciplinas}
              label="Disciplina"
              required
              defaultValue={disciplinas.find(
                (dis) => tipoAccionPartidoToDelte?.disciplina?.id === dis.value,
              )}
            />
            <SelectWithLabel
              name="esPartido"
              options={opcionesDePartido}
              label="Visible en"
              required
              defaultValue={() => {
                if (tipoAccionPartidoToDelte?.esPartido) {
                  return opcionesDePartido[tipoAccionPartidoToDelte?.esPartido];
                }
                return opcionesDePartido[0];
              }}
            />
            <InputWithLabel
              label="Modifica tarjetas advertencia"
              name="tarjAdvertencia"
              type="checkbox"
              defaultChecked={
                tipoAccionPartidoToDelte?.modificaTarjetasAdvertencia
              }
              stylesInput="peer block rounded-md h-[37px] border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <InputWithLabel
              label="Modifica tarjetas expulsion"
              name="tarjExpulsion"
              type="checkbox"
              defaultChecked={
                tipoAccionPartidoToDelte?.modificaTarjetasExpulsion
              }
              stylesInput="peer block rounded-md h-[37px] border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <InputWithLabel
              label="Secuencial"
              name="secuencial"
              defaultChecked={tipoAccionPartidoToDelte?.secuencial}
              type="checkbox"
              stylesInput="peer block rounded-md h-[37px] border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
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
                defaultValue={tipoAccionPartidoToDelte?.descripcion}
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
        primaryTextButton={tipoAccionPartidoToDelte ? 'Editar' : 'Crear'}
        isOpen={openCreateEditAccionPartido}
        scrollBehavior="outside"
        onAcceptModal={
          tipoAccionPartidoToDelte
            ? editTipoAccionPartido
            : crearTipoAccionPartido
        }
        type="submit"
        onCancelModal={() => {
          setOpenCreateEditAccionPartido(false);
          setTipoAccionPartidoToDelte(null);
        }}
      />
      <FlowModal
        title={`Seguro que desea eliminar el tipo de accionPartido ${tipoAccionPartidoToDelte?.nombreTipoAccion}`}
        modalBody={<div></div>}
        primaryTextButton={`Si`}
        isOpen={openDeleteAccionPartido}
        scrollBehavior="outside"
        onAcceptModal={handleEliminarTipoEvento}
        onCancelModal={() => {
          setOpenDeleteAccionPartido(false);
          setTipoAccionPartidoToDelte(null);
        }}
      />
    </div>
  );
};
