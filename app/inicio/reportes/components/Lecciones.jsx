import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  getInstalacionesActionAdmin,
  getUsersAdmin,
  getEventosAdmin,
  getTipoEventosAdmin,
  getCategoriaAdmin,
  getDisciplinasAdmin,
  reporteLeccionUsuarioPeriodo,
  reporteLeccionDisciplinaCategoriaPeriodo,
} from '@/app/utils/actions';
import React, { useEffect, useMemo, useState } from 'react';

const OPTIONS_PER_SAVE = [
  {
    label: 'Por alumno y periodo',
    value: 1,
  },
  {
    label: 'Por disciplina, categoria y periodo',
    value: 2,
  },
];
export const Lecciones = () => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(
    OPTIONS_PER_SAVE[0],
  );
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({});
  const [disciplinas, setDisciplinas] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [disciplinaSeleccionada, setDisciplinaSeleccionada] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState({});
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [fechaUnica, setFechaUnica] = useState(false);
  const handleCambiarOpcion = (opcion) => {
    setOpcionSeleccionada(opcion);
    setUsuarioSeleccionado({});
  };
  const opcionAmostrar = useMemo(() => {
    switch (opcionSeleccionada.value) {
      case 1:
        return (
          <div className="max-w-[330px]">
            <InputWithLabel
              label="Fecha Desde"
              name="FechaInicio"
              type="date"
              onChange={(e) => {
                setFechaInicio(e.target.value);
              }}
            />
            <InputWithLabel
              label="Fecha Hasta"
              name="FechaFin"
              type="date"
              onChange={(e) => {
                setFechaFin(e.target.value);
              }}
            />
            <div className="min-w-[170px] max-w-[330px]">
              <SelectWithLabel
                label="Dni Alumno"
                name="filtro"
                value={usuarioSeleccionado}
                options={usuarios}
                onChange={setUsuarioSeleccionado}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="max-w-[330px]">
            <div className="min-w-[170px] max-w-[330px]">
              <SelectWithLabel
                label="Disciplina"
                name="filtro"
                value={disciplinaSeleccionada}
                options={disciplinas}
                onChange={setDisciplinaSeleccionada}
              />
            </div>
            <div className="min-w-[170px] max-w-[330px]">
              <SelectWithLabel
                label="Categoria"
                name="filtro"
                value={categoriaSeleccionada}
                options={categoria}
                onChange={setCategoriaSeleccionada}
              />
            </div>
            <div className="flex min-w-[170px] max-w-[600px] flex-row gap-4">
              <div className="min-w-[330px]">
                <InputWithLabel
                  label="Fecha Desde"
                  name="FechaInicio"
                  type="date"
                  onChange={(e) => {
                    setFechaInicio(e.target.value);
                  }}
                />
              </div>
              <div className="min-w-[220px]">
                <label className="mb-2 mt-6 block text-lg font-bold text-gray-900">
                  Fecha unica:
                </label>
                <InputWithLabel
                  name={'nombre'}
                  stylesInput="peer block rounded-md h-[37px] border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  type="checkbox"
                  onChange={(e) => {
                    setFechaUnica(e.target.checked);
                  }}
                />
              </div>
            </div>
            <InputWithLabel
              label="Fecha Hasta"
              name="FechaFin"
              type="date"
              disabled={fechaUnica}
              onChange={(e) => {
                setFechaFin(e.target.value);
              }}
            />
          </div>
        );
      default:
        return <div />;
    }
  }, [
    opcionSeleccionada,
    usuarioSeleccionado,
    usuarios,
    fechaUnica,
    disciplinaSeleccionada,
    categoriaSeleccionada,
  ]);

  const getOptions = async () => {
    const usuarios = await getUsersAdmin();
    const categorias = await getCategoriaAdmin();
    const disciplinas = await getDisciplinasAdmin();
    const disciplinasToShow = disciplinas.map((cat) => ({
      label: cat.nombre,
      value: cat.id,
    }));
    const categoriasToShow = categorias.map((cat) => ({
      label: cat.nombre,
      value: cat.id,
    }));
    const usuariosToShow = usuarios.usuarios.map((user) => {
      return {
        label: `${user.dni} - ${user.apellido} ${user.nombre}`,
        value: user.id,
      };
    });
    setUsuarios(usuariosToShow);
    setCategoria(categoriasToShow);
    setDisciplinas(disciplinasToShow);
  };
  const handlePedirReporte = async () => {
    let pdf;
    try {
      switch (opcionSeleccionada.value) {
        case 1:
          pdf = await reporteLeccionUsuarioPeriodo({
            idUsuario: usuarioSeleccionado.value.toString(),
            periodoInicio: `${fechaInicio}`,
            periodoFin: `${fechaFin}`,
          });
          break;
        case 2:
          reporteLeccionDisciplinaCategoriaPeriodo;
          pdf = await reporteLeccionDisciplinaCategoriaPeriodo({
            idUsuario: usuarioSeleccionado.value.toString(),
            periodoInicio: `${fechaInicio}`,
            periodoFin: `${fechaFin}`,
            idDisciplina: disciplinaSeleccionada.value,
            idCategoria: categoriaSeleccionada.value,
          });
          break;
        default:
          return false;
      }
      window.open(pdf, '_blank');
    } catch (error) {
      console.error(error.message);
    }
  };

  const isDisable = () => {
    switch (opcionSeleccionada.value) {
      case 1:
        return (
          fechaInicio === '' || fechaFin === '' || !usuarioSeleccionado.value
        );
      case 2:
        return (
          !disciplinaSeleccionada.value ||
          !categoriaSeleccionada.value ||
          (!fechaUnica && (fechaInicio === '' || fechaFin === '')) ||
          (fechaUnica && fechaInicio === '')
        );
      default:
        return false;
    }
  };
  useEffect(() => {
    getOptions();
  }, []);
  return (
    <div className="mt-7">
      <section>
        <div className="min-w-[170px] max-w-[330px]">
          <SelectWithLabel
            label="Filtro"
            name="filtro"
            value={opcionSeleccionada}
            options={OPTIONS_PER_SAVE}
            onChange={handleCambiarOpcion}
          />
        </div>
        <div className="mt-7">{opcionAmostrar}</div>
        <div className="mt-7">
          <div className="ml-[300px]">
            <button
              onClick={() => handlePedirReporte()}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isDisable()}
            >
              Generar Reporte
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
