'use client';
import {
  getCategoriasActivasAdmin,
  getDisciplinasctionAction,
  getInstalacionesActivasAdmin,
  getInstalacionesAdmin,
  getTipoEventosAdmin,
} from '@/app/utils/actions';
import withAuthorization from '../../../../app/utils/autorization';
import { useEffect, useState } from 'react';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import { Fases } from '../components/Fases';

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

  return (
    <section>
      <div className="mt-3 self-start text-3xl font-bold">Crear Torneo</div>
      <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col space-y-4">
          <InputWithLabel label="Nombre" name="Titulo" type="text" required />
          <SelectWithLabel
            name="IdInstalacion"
            options={instalacion}
            label="Instalacion"
            required
          />
          <InputWithLabel label="Banner" name="Banner" type="file" required />
          <SelectWithLabel
            name="IdCategoria"
            options={categoria}
            label="Categoria"
            onChange={setCategoriaSeleccionada}
            required
          />
          <SelectWithLabel
            name="IdCategoria"
            options={disciplinas}
            label="Disciplinas"
            onChange={setDisciplinaSeleccinada}
            required
          />
          <SelectWithLabel
            name="cantidadDeEquipos"
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
            type="datetime-local"
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
              rows="5"
              cols="50"
              className={`w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
            />
          </label>
        </div>
        <div className="flex flex-col space-y-4">
          {cantidadDeEquipos && (
            <Fases cantidadDeFases={cantidadDeEquipos?.value} />
          )}
        </div>
      </form>
    </section>
  );
}

export default withAuthorization(Page, 'Torneos');
