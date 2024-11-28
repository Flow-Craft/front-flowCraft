'use client';
import {
  AltaDeTorneo,
  getCategoriasActivasAdmin,
  getDisciplinasctionAction,
  getInstalacionesAdmin,
} from '@/app/utils/actions';
import withAuthorization from '../../../../app/utils/autorization';
import { useEffect, useState } from 'react';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import { Fases } from '../components/Fases';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const CANTIDAD_EQUIPOS = [
  { value: 2, label: 4 },
  { value: 3, label: 8 },
  { value: 4, label: 16 },
];
function Page() {
  const [instalacion, setInstalacion] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState({});
  const [disciplinaSeleccinada, setDisciplinaSeleccinada] = useState({});
  const [cantidadDeEquipos, setCantidadDeEquipos] = useState({});
  console.log('cantidadDeEquipos', cantidadDeEquipos);
  const [instalacionSeleccionada, setInstalacionSeleccionada] = useState({});
  const [fase, setFase] = useState({});
  const router = useRouter();

  const crearTorneo = async (e) => {
    try {
      const IdEquipos = Object.values(fase?.[0]?.partidos || {})
        .flatMap((partido) => [
          partido?.equipoLocal?.value
            ? String(partido.equipoLocal.value)
            : null,
          partido?.equipoVisitante?.value
            ? String(partido.equipoVisitante.value)
            : null,
        ])
        .filter(Boolean);

      e.preventDefault();
      const torneoACrear = {
        Nombre: e?.target?.Nombre?.value,
        Descripcion: e?.target?.Descripcion?.value,
        IdDisciplina: disciplinaSeleccinada?.value?.toString(),
        IdCategoria: categoriaSeleccionada?.value?.toString(),
        IdInstalacion: instalacionSeleccionada?.value?.toString(),
        CantEquipos: cantidadDeEquipos?.label,
        Condiciones: e?.target?.condiciones?.value,
        FechaInicio: e?.target?.FechaInicio?.value,
        BannerNo64: e.target.BannerNo64.files[0],
        IdEquipos: IdEquipos,
      };
      const tieneValoresValidos = Object.entries(torneoACrear).every(
        ([key, value]) => {
          if (key === 'IdEquipos') return true; // Ignorar validación para IdEquipos
          return value !== undefined && value !== null && value !== '';
        },
      );
      if (!tieneValoresValidos) {
        toast.error(
          'Error al crear el torneo, todos los campos son obligatorios',
        );
        return;
      }
      await AltaDeTorneo(torneoACrear);
      toast.success('torneo creado correctamente');
      router.back();
    } catch (error) {
      const errorMessage = error.message.split(',Exception')[0];
      toast.error(errorMessage || 'Error al crear torneo', {
        autoClose: 5000,
        toastId: 'unique-error-id',
      });
    }
  };

  const getAllFilters = async () => {
    const inst = await getInstalacionesAdmin();
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

    const instalacionesOptions =
      inst &&
      inst
        .map((ins) => {
          if (ins.activo) {
            return { label: ins.instalacion.nombre, value: ins.instalacion.id };
          }
        })
        .filter(Boolean);
    setInstalacion(instalacionesOptions);
    setCategoria(catOptions);
    setDisciplinas(disOptions);
  };

  useEffect(() => {
    getAllFilters();
  }, []);

  const [minDateTime, setMinDateTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const offset = -3; // UTC-3
    now.setHours(now.getHours() + offset);
    const formattedNow = now.toISOString().slice(0, 16);
    setMinDateTime(formattedNow);
  }, []); // Solo se ejecuta una vez al montar el componente

  return (
    <section>
      <div className="mt-3 self-start text-3xl font-bold">Crear Torneo</div>
      <Toaster />
      <form
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        onSubmit={crearTorneo}
      >
        <div className="flex flex-col space-y-4">
          <InputWithLabel label="Nombre" name="Nombre" type="text" required />
          <SelectWithLabel
            name="IdInstalacion"
            options={instalacion}
            label="Instalación"
            value={instalacionSeleccionada}
            onChange={setInstalacionSeleccionada}
            required
          />
          <InputWithLabel
            label="Condiciones"
            name="condiciones"
            type="text"
            required
          />
          <InputWithLabel
            label="Banner"
            name="BannerNo64"
            type="file"
            required
          />
          <SelectWithLabel
            name="IdCategoria"
            options={categoria}
            label="Categoría"
            onChange={setCategoriaSeleccionada}
            required
          />
          <SelectWithLabel
            name="IdDisciplina"
            options={disciplinas}
            label="Disciplinas"
            onChange={setDisciplinaSeleccinada}
            required
          />
          <SelectWithLabel
            name="CantEquipos"
            options={CANTIDAD_EQUIPOS}
            label="Cantidad de equipos del torneo"
            isDisabled={
              !categoriaSeleccionada?.value || !disciplinaSeleccinada?.value
            }
            onChange={setCantidadDeEquipos}
            required
          />
          <InputWithLabel
            label="Fecha y hora de inicio"
            name="FechaInicio"
            min={minDateTime}
            type="datetime-local"
            required
          />
          <label
            className="mb-3 mt-5 block text-lg font-medium text-gray-900"
            htmlFor={'descripcion'}
          >
            Descripción
            <label className="text-red-600"> *</label>
            <textarea
              name="Descripcion"
              rows="5"
              cols="50"
              className={`w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
            />
          </label>
          <div className="flex w-full flex-row justify-end gap-4">
            <button
              className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
              type="submit"
            >
              Crear Torneo
            </button>
            <button
              className="rounded-lg bg-gray-600 p-2 text-center text-xl text-white"
              type="button"
              onClick={() => {
                router.back();
              }}
            >
              Volver
            </button>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          {cantidadDeEquipos && (
            <Fases
              cantidadDeFases={cantidadDeEquipos?.value}
              categoria={categoriaSeleccionada}
              disciplina={disciplinaSeleccinada}
              onChangeFase={setFase}
            />
          )}
        </div>
      </form>
    </section>
  );
}

export default withAuthorization(Page, 'Torneos');
