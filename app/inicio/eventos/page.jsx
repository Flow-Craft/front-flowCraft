'use client';
import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  crearEventosAdmin,
  crearEventosPartidoAdmin,
  createTimer,
  editarEventoAdmin,
  eliminarEventosAdmin,
  getCategoriasActivasAdmin,
  getDisciplinasctionAction,
  getEventosAdmin,
  getInstalacionesActivasAdmin,
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
  PaintBrushIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast, { Toaster } from 'react-hot-toast';
import { FlowModal } from '@/app/ui/components/FlowModal/FlowModal';
import { CrearEditarModalEventos } from './CrearEditarModalEventos/CrearEditarModalEventos';
import { useRouter } from 'next/navigation';
import usePermisos from '@/app/utils/permisos';

const HEADER_TABLE = [
  { name: 'Nombre' },
  { name: 'Tipo' },
  { name: 'Fecha' },
  { name: 'Hora' },
  { name: 'Instalación' },
  { name: 'Disciplina' },
  { name: 'Categoria' },
  { name: 'Acciones' },
];
const ACTIVO_OPTIONS = [
  { label: 'SI', value: true },
  { label: 'NO', value: false },
];

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
  const [disciplinasSeleccionadas, setDisciplinasSeleccionadas] = useState({});
  const [instalacionesActivasAdmin, setInstalacionesActivasAdmin] = useState(
    [],
  );
  const [instalacionesSeleccionadas, setInstalacionesSeleccionadas] = useState(
    [],
  );
  const [defaultValueLocal, setDefaultValueLocal] = useState({});
  const [defaultValueVisitante, setDefaultValueVisitante] = useState({});
  const { getPermisosByNombre } = usePermisos();
  const permisos = getPermisosByNombre('Eventos');
  const nombreRef = useRef(null);
  const tipoRef = useRef(null);
  const fechaRef = useRef(null);
  const instalacionRef = useRef(null);
  const activoRef = useRef(null);
  const categoriaRef = useRef(null);
  const disciplinasRef = useRef(null);
  const limpiarFiltros = () => {
    if (nombreRef.current) nombreRef.current.value = '';
    if (tipoRef.current) tipoRef.current.clearValue();
    if (fechaRef.current) fechaRef.current.value = '';
    if (instalacionRef.current) instalacionRef.current.clearValue();
    if (activoRef.current) activoRef.current.clearValue();
    if (categoriaRef.current) categoriaRef.current.clearValue();
    if (disciplinasRef.current) disciplinasRef.current.clearValue(); // Si usas react-select para disciplinas
  };
  const router = useRouter();
  let scanner;

  const getAllFilters = async () => {
    const inst = await getInstalacionesAdmin();
    const types = await getTipoEventosAdmin();
    const categorias = await getCategoriasActivasAdmin();
    const disciplinas = await getDisciplinasctionAction();
    const instActivas = await getInstalacionesActivasAdmin();

    const disOptions =
      disciplinas &&
      disciplinas.map((tp) => {
        return { label: tp.nombre, value: tp.id };
      });

    const insActivasOptions =
      instActivas &&
      instActivas.map((tp) => {
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
    setInstalacionesActivasAdmin(insActivasOptions);
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
                router.push(`eventos/${evento.evento.id}`);
              }}
            />
          </Tooltip>
        )}
        {evento.activo &&
        permisos.some((perm) => perm.funcionalidades === 'Gestionar evento') &&
        new Date() < fechaInicio ? (
          <>
            <Tooltip label="Editar">
              <PencilIcon
                className={`w-[50px] cursor-pointer text-slate-500`}
                onClick={() => {
                  setEventoSeleccionado(evento.evento);
                  setEditCreateEvento(true);
                }}
              />
            </Tooltip>
          </>
        ) : (
          <>
            <PencilIcon className={`w-[50px] text-transparent `} />
          </>
        )}
        {evento.activo &&
        permisos.some((perm) => perm.funcionalidades === 'Gestionar evento') ? (
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
        {evento.activo &&
        permisos.some((perm) => perm.funcionalidades === 'Gestionar evento') &&
        fechaFin > new Date() &&
        new Date() > fechaInicio ? (
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
        disciplina: vnt.evento.disciplina.nombre,
        categoria: `${vnt.evento.categoria.genero} - ${vnt.evento.categoria.nombre}`,
        acciones: ActionTab(
          result.find((disc) => disc.evento.id === vnt.evento.id),
        ),
      }));
    setEventosToShow(resultFilter);
  };

  const crearEvento = async (e) => {
    try {
      const tipoSeleccionado = tipo.find(
        (el) => el.value === Number(e.target.IdTipoEvento.value),
      );
      if (!tipoSeleccionado) {
        setErrors([{ error: true, path: [''] }]);
        return;
      }
      if (tipoSeleccionado.label === 'Partido') {
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
          IdDisciplina: e.target.IdsDisciplinaPartido.value,
          Banner: e.target.Banner.files[0],
          EquipoLocal: defaultValueLocal.value,
          EquipoVisitante: defaultValueVisitante.value,
          Arbitro: e.target.arbitro.value,
          Planillero: e.target.planillero.value,
        };
        console.log('eventoACrear', eventoACrear);
        const result = await crearEventosPartidoAdmin(eventoACrear);
        if (result?.error) {
          setErrors(result?.errors);
          return;
        }
      } else {
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
          IdDisciplina: disciplinasSeleccionadas.value,
          Banner: e.target.Banner.files[0],
        };
        const result = await crearEventosAdmin(eventoACrear);
        if (result?.error) {
          setErrors(result?.errors);
          return;
        }
      }
      toast.success('Evento creado con éxito');
      setEditCreateEvento(false);
      getEventos();
    } catch (error) {
      const errorMessage = error.message.split(',Exception')[0];
      toast.error(errorMessage || 'Error al crear torneo', {
        autoClose: 5000,
        toastId: 'unique-error-id',
      });
    }
  };

  const editarEvento = async (e) => {
    try {
      if (eventoSeleccionado.tipoEvento.nombreTipoEvento === 'Partido') {
        const eventoACrear = {
          Id: eventoSeleccionado.id.toString(),
          Titulo: e.target.Titulo.value,
          FechaInicio: e.target.FechaInicio.value,
          FechaFinEvento: e.target.FechaFinEvento.value,
          CupoMaximo: e.target.CupoMaximo.value,
          LinkStream: e.target.LinkStream.value,
          Descripcion: e.target.Descripcion.value,
          IdInstalacion: e.target.IdInstalacion.value,
          IdCategoria: e.target.IdCategoria.value,
          IdDisciplina: e.target.IdsDisciplinaPartido.value,
          Banner: e.target.Banner.files[0] || eventoSeleccionado.banner,
          EquipoLocal: defaultValueLocal.value || 0,
          EquipoVisitante: defaultValueVisitante.value || 0,
          Arbitro: e.target.arbitro.value,
          Planillero: e.target.planillero.value,
        };
        const result = await editarEventoAdmin(eventoACrear);
        if (result?.error) {
          setErrors(result?.errors);
          return;
        }
        toast.success('Evento editado con éxito');
      } else {
        const eventoACrear = {
          Id: eventoSeleccionado.id,
          Titulo: e.target.Titulo.value,
          FechaInicio: e.target.FechaInicio.value,
          FechaFinEvento: e.target.FechaFinEvento.value,
          CupoMaximo: e.target.CupoMaximo.value,
          LinkStream: e.target.LinkStream.value,
          Descripcion: e.target.Descripcion.value,
          IdTipoEvento: e.target.IdTipoEvento.value,
          IdInstalacion: e.target.IdInstalacion.value,
          IdCategoria: e.target.IdCategoria.value,
          IdDisciplina: disciplinasSeleccionadas.value,
          Banner: e.target.Banner.files[0] || eventoSeleccionado.banner,
        };
        const result = await editarEventoAdmin(eventoACrear);
        if (result?.error) {
          setErrors(result?.errors);
          return;
        }
        toast.success('Evento editado con éxito');
      }
      setEventoSeleccionado({});
      setEditCreateEvento(false);
      getEventos();
    } catch (error) {
      const errorMessage = error.message.split(',Exception')[0];
      toast.error(errorMessage || 'Error al crear torneo', {
        autoClose: 5000,
        toastId: 'unique-error-id',
      });
    }
  };

  const eliminarEventoAction = async () => {
    try {
      await eliminarEventosAdmin(eventoSeleccionado.id);
      setEliminarEvento(false);
      setEventoSeleccionado({});
      getEventos();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const tomarAsistencia = async (userId, eventoId) => {
    try {
      await tomarAsistenciaAdmin({ IdEvento: eventoId, IdUsuario: userId });
      toast.success('Usuario Registrado con éxito');
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllFilters();
    getEventos();
  }, [permisos]);

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

  const applyFilters = (e) => {
    e.preventDefault();
    const filters = {
      nombre: e.target.nombre.value,
      tipo: e.target.tipo.value,
      fecha: e.target.fecha.value,
      instalacion: e.target.instalacion.value,
      activo: e.target.activo.value,
      categoria: e.target.categoria.value,
      instalaciones: instalacionesSeleccionadas,
    };
    const eventosFiltrados = eventos.filter((evento) => {
      const {
        nombre,
        tipo,
        fecha,
        instalacion,
        activo,
        categoria,
        instalaciones,
      } = filters;

      // Verificar nombre (parcial)
      const coincideNombre =
        !nombre ||
        evento.evento.titulo.toLowerCase().includes(nombre.toLowerCase());

      // Verificar tipo de evento
      const coincideTipo =
        !tipo || evento.evento.tipoEvento.id === Number(tipo);

      // Verificar fecha de inicio
      const coincideFecha =
        !fecha || evento.evento.fechaInicio.startsWith(fecha);

      // Verificar instalación
      const coincideInstalacion =
        !instalacion || evento.evento.instalacion.id === Number(instalacion);

      // Verificar si el evento está activo
      const coincideActivo = !activo || String(evento.activo) === activo;

      // Verificar categoría
      const coincideCategoria =
        !categoria || evento.evento.categoria.id === Number(categoria);

      // Verificar instalaciones
      const coincideInstalaciones =
        !instalaciones ||
        instalaciones.length === 0 ||
        instalaciones.some(
          (inst) => inst.value === evento.evento.disciplina.id,
        );

      return (
        coincideNombre &&
        coincideTipo &&
        coincideFecha &&
        coincideInstalacion &&
        coincideActivo &&
        coincideCategoria &&
        coincideInstalaciones
      );
    });

    const resultFilter =
      eventosFiltrados &&
      eventosFiltrados.map((vnt) => ({
        id: vnt.evento.id,
        nombre: vnt.evento.titulo,
        tipo: vnt.evento.tipoEvento.nombreTipoEvento,
        fecha: formatDate(vnt.evento.fechaInicio),
        hora: formatearHoras(vnt.evento.fechaInicio, vnt.evento.fechaFinEvento),
        instalacion: vnt?.evento?.instalacion?.nombre,
        disciplina: vnt?.evento?.disciplina?.nombre,
        categoria: `${vnt?.evento?.categoria?.genero} - ${vnt?.evento?.categoria?.nombre}`,
        acciones: ActionTab(
          eventos.find((disc) => disc.evento.id === vnt.evento.id),
        ),
      }));
    setEventosToShow(resultFilter);
  };

  return (
    <section>
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Eventos
      </div>
      <section>
        <form
          className="flex w-full flex-wrap items-center"
          onSubmit={applyFilters}
          id="filterEvents"
        >
          <div className="flex flex-row flex-wrap gap-5">
            <section className="flex flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Nombre:
              </label>
              <InputWithLabel name={'nombre'} type="text" ref={nombreRef} />
            </section>
            <div className="flex min-w-[170px] flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Tipo:
              </label>
              <div className="min-w-[170px]">
                <SelectWithLabel name="tipo" options={tipo} ref={tipoRef} />
              </div>
            </div>
            <section className="flex flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Fecha:
              </label>
              <InputWithLabel name={'fecha'} type="date" ref={fechaRef} />
            </section>
            <div className="flex min-w-[170px] flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Instalación:
              </label>
              <div className="min-w-[170px]">
                <SelectWithLabel
                  name="instalacion"
                  options={instalacion}
                  ref={instalacionRef}
                />
              </div>
            </div>
            <div className="flex min-w-[170px] flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Activo:
              </label>
              <div className="min-w-[170px]">
                <SelectWithLabel
                  name="activo"
                  options={ACTIVO_OPTIONS}
                  ref={activoRef}
                />
              </div>
            </div>
            <div className="flex min-w-[170px] flex-row items-center gap-3">
              <label className="mb-3 mt-5 block text-lg font-bold text-gray-900">
                Categoría:
              </label>
              <div className="min-w-[220px]">
                <SelectWithLabel
                  name="categoria"
                  options={categoria}
                  ref={categoriaRef}
                />
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
                  value={instalacionesSeleccionadas}
                  ref={disciplinasRef}
                  onChange={(e) => {
                    setInstalacionesSeleccionadas(e);
                  }}
                  isMulti
                />
              </div>
            </div>
            <Tooltip label="Limpiar Filtros">
              <PaintBrushIcon
                className="w-[50px] rounded-lg bg-blue-300 p-2 text-center text-xl text-white"
                type="button"
                onClick={(e) => {
                  limpiarFiltros();
                  const resultFilter =
                    eventos &&
                    eventos.map((vnt) => ({
                      id: vnt.evento.id,
                      nombre: vnt.evento.titulo,
                      tipo: vnt.evento.tipoEvento.nombreTipoEvento,
                      fecha: formatDate(vnt.evento.fechaInicio),
                      hora: formatearHoras(
                        vnt.evento.fechaInicio,
                        vnt.evento.fechaFinEvento,
                      ),
                      instalacion: vnt.evento.instalacion.nombre,
                      disciplina: vnt.evento.disciplina.nombre,
                      categoria: `${vnt.evento.categoria.genero} - ${vnt.evento.categoria.nombre}`,
                      acciones: ActionTab(
                        eventos.find(
                          (disc) => disc.evento.id === vnt.evento.id,
                        ),
                      ),
                    }));
                  setEventosToShow(resultFilter);
                }}
              />
            </Tooltip>
            <button
              className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
              type="submit"
            >
              Buscar
            </button>
          </div>
          {permisos.some(
            (perm) => perm.funcionalidades === 'Gestionar evento',
          ) && (
            <>
              <button
                className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
                type="button"
                onClick={() => {
                  router.push('eventos/equipos');
                }}
              >
                Equipos
              </button>
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
            </>
          )}
        </form>
        <section>
          <FlowTable Header={HEADER_TABLE} dataToShow={eventosToShow} />
        </section>
      </section>
      <Toaster />
      <FlowModal
        title={eventoSeleccionado?.id ? 'Editar Evento' : 'Crear Evento'}
        sx={{ minWidth: '90vw' }}
        modalBody={
          <CrearEditarModalEventos
            errors={errors}
            evento={eventoSeleccionado}
            instalacion={instalacionesActivasAdmin}
            categoria={categoria}
            disciplinas={disciplinas}
            tipo={tipo}
            setDisciplinasSeleccionadas={setDisciplinasSeleccionadas}
            defaultValueLocal={defaultValueLocal}
            defaultValueVisitante={defaultValueVisitante}
            setDefaultValueLocal={setDefaultValueLocal}
            setDefaultValueVisitante={setDefaultValueVisitante}
          />
        }
        primaryTextButton={eventoSeleccionado?.id ? 'Editar' : 'Crear'}
        isOpen={editCreateEvento}
        onAcceptModal={eventoSeleccionado?.id ? editarEvento : crearEvento}
        onCancelModal={() => {
          setEditCreateEvento(false);
          setErrors([]);
          setEventoSeleccionado({});
          setDisciplinasSeleccionadas({});
        }}
        type="submit"
        scrollBehavior="outside"
        size="xl"
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
