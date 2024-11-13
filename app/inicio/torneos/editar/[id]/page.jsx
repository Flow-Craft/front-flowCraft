'use client';
import {
  AltaDeTorneo,
  EditarTorneo,
  getCategoriasActivasAdmin,
  getDisciplinasctionAction,
  getInstalacionesAdmin,
  getTorneoById,
} from '@/app/utils/actions';
import withAuthorization from '../../../../../app/utils/autorization';
import { useEffect, useState } from 'react';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import { Fases } from '../../components/Fases';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const CANTIDAD_EQUIPOS = [
  { value: 2, label: 4 },
  { value: 3, label: 8 },
  { value: 4, label: 16 },
];
function Page() {
  const [instalacion, setInstalacion] = useState([]);
  const [torneoId, setTorneoId] = useState('');
  const [torneo, setTorneo] = useState({});
  const [categoria, setCategoria] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState({});
  const [disciplinaSeleccinada, setDisciplinaSeleccinada] = useState({});
  const [cantidadDeEquipos, setCantidadDeEquipos] = useState({});
  const [instalacionSeleccionada, setInstalacionSeleccionada] = useState({});
  const [equipos, setEquipos] = useState({});
  const handleFase = (nuevaFase) => {
    setEquipos(nuevaFase?.[0]?.partidos);
  };

  const router = useRouter();
  const crearTorneo = async (e) => {
    try {
      e.preventDefault();
      const IdEquipos = Object.values(equipos || {})
        .flatMap((partido) => [
          partido?.equipoLocal?.value
            ? String(partido.equipoLocal.value)
            : null,
          partido?.equipoVisitante?.value
            ? String(partido.equipoVisitante.value)
            : null,
        ])
        .filter(Boolean);
      const torneoACrear = {
        Id: torneoId,
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
      await EditarTorneo(torneoACrear);
      toast.success('torneo editado correctamente');
      router.back();
    } catch (error) {
      console.error(error);
      toast.error('Error al editar el torneo');
    }
  };

  const getAllFilters = async (idTorneo) => {
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
    const result = await getTorneoById(idTorneo);
    setTorneo(result);
  };

  useEffect(() => {
    const path = window.location.pathname;
    const idFromPath = path.split('/').pop();
    setTorneoId(idFromPath);
    getAllFilters(idFromPath);
  }, []);

  useEffect(() => {
    setCategoriaSeleccionada(
      categoria.find((option) => option.value === torneo?.categoria?.id),
    );
    setDisciplinaSeleccinada(
      disciplinas.find((option) => option.value === torneo?.disciplina?.id),
    );

    setCantidadDeEquipos(
      CANTIDAD_EQUIPOS.find((option) => option.label === torneo?.cantEquipos),
    );
    setInstalacionSeleccionada(
      instalacion.find((option) => option.value === torneo?.instalacion?.id),
    );
  }, [torneo]);

  return (
    <section>
      <div className="mt-3 self-start text-3xl font-bold">Editar Torneo</div>
      <Toaster />
      <form
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        onSubmit={crearTorneo}
      >
        <div className="flex flex-col space-y-4">
          <InputWithLabel
            label="Nombre"
            name="Nombre"
            type="text"
            defaultValue={torneo?.nombre}
            required
          />
          <SelectWithLabel
            name="IdInstalacion"
            options={instalacion}
            label="Instalacion"
            value={instalacionSeleccionada}
            onChange={setInstalacionSeleccionada}
            required
          />
          <InputWithLabel
            label="Condiciones"
            name="condiciones"
            type="text"
            defaultValue={torneo?.condiciones}
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
            label="Categoria"
            value={categoriaSeleccionada}
            onChange={setCategoriaSeleccionada}
            required
          />
          <SelectWithLabel
            name="IdDisciplina"
            options={disciplinas}
            label="Disciplinas"
            value={disciplinaSeleccinada}
            onChange={setDisciplinaSeleccinada}
            required
          />
          <SelectWithLabel
            name="CantEquipos"
            options={CANTIDAD_EQUIPOS}
            label="Cantidad de equipos del torneo"
            isDisabled={true}
            value={cantidadDeEquipos}
            onChange={setCantidadDeEquipos}
            required
          />
          <InputWithLabel
            label="Fecha y hora de inicio"
            name="FechaInicio"
            type="datetime-local"
            defaultValue={torneo?.fechaInicio}
            disabled={true}
            required
          />
          <label
            className="mb-3 mt-5 block text-lg font-medium text-gray-900"
            htmlFor={'descripcion'}
          >
            Descripcion
            <label className="text-red-600"> *</label>
            <textarea
              name="Descripcion"
              defaultValue={torneo?.descripcion}
              rows="5"
              cols="50"
              className={`w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
            />
          </label>
        </div>
        <div className="flex flex-col space-y-4">
          {cantidadDeEquipos && (
            <Fases
              cantidadDeFases={cantidadDeEquipos?.value}
              categoria={categoriaSeleccionada}
              disciplina={disciplinaSeleccinada}
              onChangeFase={handleFase}
              equiposDefault={torneo?.equipos?.map((eq) => ({
                value: eq.id,
                label: eq.nombre,
              }))}
            />
          )}
          <div className="flex w-full flex-row justify-end gap-4">
            <button
              className="rounded-lg bg-blue-600 p-2 text-center text-xl text-white"
              type="submit"
            >
              Editar Torneo
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
      </form>
    </section>
  );
}

export default withAuthorization(Page, 'Torneos');
