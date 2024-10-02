'use client';
import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  getCategoriasActivasAdmin,
  getDisciplinasctionAction,
  getEventosAdmin,
  getInstalacionesAdmin,
  getTipoEventosAdmin,
} from '@/app/utils/actions';
import withAuthorization from '@/app/utils/autorization';
import { formatDate, formatearHoras } from '@/app/utils/functions';
import { Tooltip } from '@chakra-ui/react';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Tipo' },
  { name: 'Fecha' },
  { name: 'Hora' },
  { name: 'Instalacion' },
  { name: 'Disciplina' },
  { name: 'Categoria' },
  { name: 'Acciones' },
];
const ACTIVO_OPTIONS = [
  { label: 'SI', value: true },
  { label: 'NO', value: true },
];

const getFecha = (fechaCompleta) => {
  return fechaCompleta.split('T')[0];
};
function Page() {
  const [tipo, setTipo] = useState([]);
  const [instalacion, setInstalacion] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventosToShow, setEventosToShow] = useState([]);

  const getAllFilters = async () => {
    const inst = await getInstalacionesAdmin();
    const types = await getTipoEventosAdmin();
    const categorias = await getCategoriasActivasAdmin();
    const disciplinas = await getDisciplinasctionAction();

    const disOptions =
      disciplinas &&
      disciplinas.map((tp) => {
        return { label: tp.nombre, value: tp.id };
      });

    const catOptions =
      categorias &&
      categorias
        .map((tp) => {
          if (!tp.fechaBaja) {
            return { label: `${tp.genero} - ${tp.nombre}`, value: tp.id };
          }
        })
        .filter(Boolean);

    const typesOptions =
      types &&
      types
        .map((tp) => {
          if (!tp.fechaBaja) {
            return { label: tp.nombreTipoEvento, value: tp.id };
          }
        })
        .filter(Boolean);
    const instalacionesOptions =
      inst &&
      inst
        .map((ins) => {
          if (ins.activo) {
            return { label: ins.instalacion.nombre, value: ins.instalacion.id };
          }
        })
        .filter(Boolean);
    setTipo(typesOptions);
    setInstalacion(instalacionesOptions);
    setCategoria(catOptions);
    setDisciplinas(disOptions);
  };

  const ActionTab = (evento) => {
    return (
      <div className="flex flex-row gap-4">
        {evento.activo && (
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
        {evento.activo ? (
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
        {evento.activo ? (
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

  const getEventos = async () => {
    const result = await getEventosAdmin();
    setEventos(result);
    const resultFilter =
      result &&
      result.map((vnt) => ({
        id: vnt.evento.id,
        nombre: vnt.evento.titulo,
        tipo: vnt.evento.tipoEvento.nombreTipoEvento,
        fecha: formatDate(vnt.evento.fechaInicio),
        hora: formatearHoras(vnt.evento.fechaInicio, vnt.evento.fechaFinEvento),
        instalacion: vnt.evento.instalacion.nombre,
        disciplina: vnt.evento.disciplinas.map((dis) => `|${dis.nombre}| `),
        categoria: `${vnt.evento.categoria.genero} - ${vnt.evento.categoria.nombre}`,
        acciones: ActionTab(result.find((disc) => disc.evento.id === vnt.evento.id)),
      }));
    setEventosToShow(resultFilter);
  };
  useEffect(() => {
    getAllFilters();
    getEventos();
  }, []);

  return (
    <section>
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Eventos
      </div>
      <section>
        <form
          className="flex w-full flex-wrap items-center"
          onSubmit={() => {}}
          id="filterEvents"
        >
          <div className="flex flex-row flex-wrap gap-5">
            <section className="flex flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Nombre:
              </label>
              <InputWithLabel name={'nombre'} type="text" />
            </section>
            <div className="flex min-w-[170px] flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Tipo:
              </label>
              <div className="min-w-[170px]">
                <SelectWithLabel name="tipo" options={tipo} />
              </div>
            </div>
            <section className="flex flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Fecha:
              </label>
              <InputWithLabel name={'fecha'} type="date" />
            </section>
            <div className="flex min-w-[170px] flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Instalacion:
              </label>
              <div className="min-w-[170px]">
                <SelectWithLabel name="instalacion" options={instalacion} />
              </div>
            </div>
            <div className="flex min-w-[170px] flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Activo:
              </label>
              <div className="min-w-[170px]">
                <SelectWithLabel name="activo" options={ACTIVO_OPTIONS} />
              </div>
            </div>
            <div className="flex min-w-[170px] flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Categoria:
              </label>
              <div className="min-w-[220px]">
                <SelectWithLabel name="categoria" options={categoria} />
              </div>
            </div>
            <div className="flex min-w-[170px] flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Disciplina:
              </label>
              <div className="min-w-[220px]">
                <SelectWithLabel
                  name="disciplinas"
                  options={disciplinas}
                  isMulti
                />
              </div>
            </div>
            <button
              className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
              type="submit"
            >
              Buscar
            </button>
          </div>

          <button
            className="rounded-lg bg-blue-500 p-2 text-center text-xl text-white lg:ml-auto"
            onClick={() => {}}
          >
            Crear Evento
          </button>
        </form>
        <section>
          <FlowTable Header={HEADER_TABLE} dataToShow={eventosToShow} />
        </section>
      </section>
    </section>
  );
}

export default withAuthorization(Page, 'Eventos');
