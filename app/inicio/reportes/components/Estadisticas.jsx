import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  getUsersAdmin,
  getDisciplinasAdmin,
  reporteEstadisticasByDiscUsuPeriodo,
  getLeccionesAdmin,
  reporteEstadisticasByDiscUsuLeccionPeriodo,
  getEquiposActivos,
  reporteEstadisticasByDiscEquipoPeriodo,
} from '@/app/utils/actions';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const OPTIONS_PER_SAVE = [
  {
    label: 'Por alumno, periodo y disciplina',
    value: 1,
  },
  {
    label: 'Por disciplina, usuario, leccion y periodo',
    value: 2,
  },
  ,
  {
    label: 'Por disciplina, equipo y periodo',
    value: 3,
  },
];
export const Estadisticas = () => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(
    OPTIONS_PER_SAVE[0],
  );
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({});
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinaSeleccionada, setDisciplinaSeleccionada] = useState({});
  const [lecciones, setLecciones] = useState([]);
  const [leccionSeleccionada, setLeccionSeleccionada] = useState({});
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState({});

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
                label="Disciplina"
                name="filtro"
                value={disciplinaSeleccionada}
                options={disciplinas}
                onChange={setDisciplinaSeleccionada}
              />
            </div>
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
                label="Dni Alumno"
                name="filtro"
                value={usuarioSeleccionado}
                options={usuarios}
                onChange={setUsuarioSeleccionado}
              />
            </div>
            <div className="min-w-[170px] max-w-[330px]">
              <SelectWithLabel
                label="Leccion"
                name="filtro"
                value={leccionSeleccionada}
                options={lecciones}
                onChange={setLeccionSeleccionada}
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
            </div>
            <InputWithLabel
              label="Fecha Hasta"
              name="FechaFin"
              type="date"
              onChange={(e) => {
                setFechaFin(e.target.value);
              }}
            />
          </div>
        );
      case 3:
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
              <SelectWithLabel
                label="Equipo"
                name="filtro"
                value={equipoSeleccionado}
                options={equipos}
                onChange={setEquipoSeleccionado}
              />
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
            </div>
          </div>
        );
      default:
        return <div />;
    }
  }, [
    opcionSeleccionada,
    usuarioSeleccionado,
    usuarios,
    disciplinaSeleccionada,
    leccionSeleccionada,
    equipos,
    equipoSeleccionado,
  ]);

  const getOptions = async () => {
    const usuarios = await getUsersAdmin();
    const disciplinas = await getDisciplinasAdmin();
    const lecciones = await getLeccionesAdmin();
    const leccionesToShow = lecciones.map((cat) => ({
      label: cat.nombre,
      value: cat.id,
    }));
    const disciplinasToShow = disciplinas.map((cat) => ({
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
    setDisciplinas(disciplinasToShow);
    setLecciones(leccionesToShow);
  };
  const handlePedirReporte = async () => {
    try {
      let pdf;
      switch (opcionSeleccionada.value) {
        case 1:
          pdf = await reporteEstadisticasByDiscUsuPeriodo({
            idUsuario: usuarioSeleccionado.value.toString(),
            IdDisciplina: disciplinaSeleccionada.value.toString(),
            periodoInicio: `${fechaInicio}T00:00:00`,
            periodoFin: `${fechaFin}T23:59:59`,
          });
          break;
        case 2:
          pdf = await reporteEstadisticasByDiscUsuLeccionPeriodo({
            idUsuario: usuarioSeleccionado.value.toString(),
            IdDisciplina: disciplinaSeleccionada.value.toString(),
            periodoInicio: `${fechaInicio}T00:00:00`,
            periodoFin: `${fechaFin}T23:59:59`,
            IdLeccion: leccionSeleccionada.value.toString(),
          });
          break;
        case 3:
          pdf = await reporteEstadisticasByDiscEquipoPeriodo({
            IdEquipo: equipoSeleccionado.value.toString(),
            IdDisciplina: disciplinaSeleccionada.value.toString(),
            periodoInicio: `${fechaInicio}T00:00:00`,
            periodoFin: `${fechaFin}T23:59:59`,
          });
          break;
        default:
          return false;
      }
      window.open(pdf, '_blank');
    } catch (error) {
      console.error(error);
    }
  };

  const isDisable = () => {
    switch (opcionSeleccionada.value) {
      case 1:
        return (
          fechaInicio === '' ||
          fechaFin === '' ||
          !usuarioSeleccionado.value ||
          !disciplinaSeleccionada.value
        );
      case 2:
        return (
          !disciplinaSeleccionada.value ||
          !leccionSeleccionada.value ||
          !usuarioSeleccionado.value ||
          fechaInicio === '' ||
          fechaFin === ''
        );
      case 3:
        return (
          !disciplinaSeleccionada.value ||
          fechaInicio === '' ||
          fechaFin === '' ||
          !equipoSeleccionado.value
        );
      default:
        return false;
    }
  };

  const getEquiposByDisciplina = async () => {
    try {
      const equipos = await getEquiposActivos();
      setEquipos(
        equipos
          .filter((eq) => eq.disciplina.id === disciplinaSeleccionada.value)
          .map((eq) => ({ value: eq.id, label: eq.nombre })),
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (disciplinaSeleccionada.value && opcionSeleccionada.value === 2) {
      getEquiposByDisciplina();
    }
    if (disciplinaSeleccionada.value && opcionSeleccionada.value === 3) {
      getEquiposByDisciplina();
    }
  }, [disciplinaSeleccionada]);
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
