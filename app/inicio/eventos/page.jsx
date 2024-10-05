'use client';
import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  crearEventosAdmin,
  createTimer,
  editarEventoAdmin,
  eliminarEventosAdmin,
  getCategoriasActivasAdmin,
  getDisciplinasctionAction,
  getEventosAdmin,
  getInstalacionesAdmin,
  getTipoEventosAdmin,
  tomarAsistenciaAdmin,
} from '@/app/utils/actions';
import withAuthorization from '@/app/utils/autorization';
import { formatDate, formatearHoras } from '@/app/utils/functions';
import { Tooltip } from '@chakra-ui/react';
import {
  ClipboardIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast, { Toaster } from 'react-hot-toast';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import { CrearEditarModalEventos } from './CrearEditarModalEventos/CrearEditarModalEventos';
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
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState({});
  const [editCreateEvento, setEditCreateEvento] = useState(false);
  const [eliminarEvento, setEliminarEvento] = useState(false);
  const [errors, setErrors] = useState([]);
  const [disciplinasSeleccionadas, setDisciplinasSeleccionadas] = useState([]);
  let scanner;

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
    const fechaInicio = new Date(evento?.evento.fechaInicio);
    const fechaFin = new Date(evento?.evento.fechaFinEvento);
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
        {evento.activo && new Date() < fechaInicio ? (
          <>
            <Tooltip label="Editar">
              <PencilIcon
                className={`w-[50px] cursor-pointer text-slate-500`}
                onClick={() => {
                  setEventoSeleccionado(evento.evento);
                  setOpenCreateEditInstalacion(true);
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
                  setEventoSeleccionado(evento.evento);
                  setEliminarEvento(true);
                }}
              />
            </Tooltip>
          </>
        ) : (
          <>
            <PencilIcon className={`w-[50px] text-transparent `} />
          </>
        )}
        {evento.activo && fechaFin > new Date() > fechaInicio ? (
          <>
            <Tooltip label="Tomar asistencia">
              <ClipboardIcon
                className={`w-[50px] cursor-pointer text-slate-500`}
                onClick={() => {
                  setEventoSeleccionado(evento.evento);
                  setIsScannerActive(true);
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
        acciones: ActionTab(
          result.find((disc) => disc.evento.id === vnt.evento.id),
        ),
      }));
    setEventosToShow(resultFilter);
  };

  const crearEvento = async (e) => {
    try {
      const eventoACrear = {
        Titulo: e.target.Titulo.value,
        FechaInicio: e.target.FechaInicio.value,
        FechaFinEvento: e.target.FechaFinEvento.value,
        CupoMaximo: e.target.CupoMaximo.value,
        LinkStream: e.target.LinkStream.value,
        Descripcion: e.target.Descripcion.value,
        IdTipoEvento: e.target.IdTipoEvento.value,
        IdInstalacion: e.target.IdInstalacion.value,
        IdCategoria: e.target.IdCategoria.value,
        IdsDisciplinas: disciplinasSeleccionadas.map((perm) => perm.value),
        Banner: e.target.Banner.files[0],
      };

      const result = await editarEventoAdmin(eventoACrear);

      if (result?.error) {
        setErrors(result?.errors);
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editarEvento = async (e) => {
    try {
      const eventoACrear = {
        Titulo: e.target.Titulo.value,
        FechaInicio: e.target.FechaInicio.value,
        FechaFinEvento: e.target.FechaFinEvento.value,
        CupoMaximo: e.target.CupoMaximo.value,
        LinkStream: e.target.LinkStream.value,
        Descripcion: e.target.Descripcion.value,
        IdTipoEvento: e.target.IdTipoEvento.value,
        IdInstalacion: e.target.IdInstalacion.value,
        IdCategoria: e.target.IdCategoria.value,
        IdsDisciplinas: disciplinasSeleccionadas.map((perm) => perm.value),
        Banner: e.target.Banner.files[0] || eventoSeleccionado.Banner,
      };

      const result = await crearEventosAdmin(eventoACrear);

      if (result?.error) {
        setErrors(result?.errors);
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const eliminarEventoAction = async () => {
    try {
      await eliminarEventosAdmin(eventoSeleccionado.id);
      setEliminarEvento(false);
      setEventoSeleccionado({});
    } catch (error) {
      toast.error(error.message);
    }
  };

  const tomarAsistencia = async (userId, eventoId) => {
    try {
      await tomarAsistenciaAdmin({ IdEvento: eventoId, IdUsuario: userId });
      toast.success('Usuario Registrado con exito');
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllFilters();
    getEventos();
  }, []);

  useEffect(() => {
    if (isScannerActive) {
      scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 500,
          height: 500,
        },
        fps: 5,
      });
      let lastUser = {};
      // Manejador de éxito
      const success = (decodedText) => {
        const user = JSON.parse(decodedText);
        if (lastUser.id !== user.id) {
          tomarAsistencia(user.id, eventoSeleccionado.id);
          lastUser = user;
        }
        // Aquí puedes manejar el código QR detectado
      };

      // Manejador de error
      const error = (errorMessage) => {
        // console.error(`Error al escanear: ${errorMessage}`);
      };

      scanner.render(success, error);
    }

    // Limpiar el escáner cuando el componente se desmonta o el escáner se detenga
    return () => {
      if (scanner) {
        scanner.clear().catch((error) => {
          console.error('Error cleaning scanner:', error);
        });
      }
    };
  }, [isScannerActive, eventoSeleccionado]);

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
            type="button"
            onClick={() => {
              setEditCreateEvento(true);
              setErrors([]);
              setEventoSeleccionado({});
            }}
          >
            Crear Evento
          </button>
        </form>
        <section>
          <FlowTable Header={HEADER_TABLE} dataToShow={eventosToShow} />
        </section>
      </section>
      <Toaster />
      <FlowModal
        title={eventoSeleccionado?.evento ? 'Editar Evento' : 'Crear Evento'}
        modalBody={
          <CrearEditarModalEventos
            errors={errors}
            evento={eventoSeleccionado}
            instalacion={instalacion}
            categoria={categoria}
            disciplinas={disciplinas}
            tipo={tipo}
            setDisciplinasSeleccionadas={setDisciplinasSeleccionadas}
          />
        }
        primaryTextButton={eventoSeleccionado?.evento ? 'Editar' : 'Crear'}
        isOpen={editCreateEvento}
        scrollBehavior="outside"
        onAcceptModal={eventoSeleccionado?.evento ? editarEvento : crearEvento}
        onCancelModal={() => {
          setEditCreateEvento(false);
          setErrors([]);
          setEventoSeleccionado({});
          setDisciplinasSeleccionadas([]);
        }}
        type="submit"
        size="full"
      />
      <FlowModal
        title={`Seguro que desea eliminar el evento: ${eventoSeleccionado.titulo}`}
        modalBody={<></>}
        primaryTextButton={'Si'}
        isOpen={eliminarEvento}
        scrollBehavior="outside"
        onAcceptModal={eliminarEventoAction}
        onCancelModal={() => {
          setEliminarEvento(false);
          setEventoSeleccionado({});
        }}
      />
      {isScannerActive && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-start bg-black bg-opacity-75">
          <div className="flex flex-row content-center items-center gap-5">
            <button
              className="mb-2 mt-4 rounded bg-red-600 p-2 text-white"
              onClick={() => {
                setIsScannerActive(false);
                setEventoSeleccionado({});
              }}
            >
              Cerrar
            </button>
            <span className="text-3xl font-bold text-cyan-50">
              {eventoSeleccionado.titulo}
            </span>
          </div>
          <div id="reader" className="h-[50vh] w-[50vw] bg-white"></div>
        </div>
      )}
    </section>
  );
}

export default withAuthorization(Page, 'Eventos');
