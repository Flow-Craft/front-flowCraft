import React, { useEffect, useState } from 'react';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import toast from 'react-hot-toast';
import {
  gertPlanilleroYArbritroByPartidoId,
  getEquipoByDisciplinaYCategoria,
  getPartidoByIdAdmin,
  getPerfilByNombreAdmin,
  getPlanilleroYArbritroByPartidoId,
} from '@/app/utils/actions';
import { CircularProgress } from '@chakra-ui/react';

export const CrearEditarModalEventos = ({
  errors = [],
  evento,
  instalacion,
  categoria,
  disciplinas,
  tipo,
  setDisciplinasSeleccionadas,
  defaultValueLocal,
  defaultValueVisitante,
  setDefaultValueLocal,
  setDefaultValueVisitante,
}) => {
  const [minDate, setMinDate] = useState('');
  const [showPartido, setShowPartido] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState({});
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [equipoLocal, setEquipoLocal] = useState([]);
  const [equipoLocalOpciones, setEquipoLocalOpciones] = useState([]);
  const [equipoVisitante, setEquipoVisitante] = useState({});
  const [equipoVisitanteOpciones, setEquipoVisitanteOpciones] = useState([]);
  const [planilleros, setPlanilleros] = useState([]);
  const [arbitros, setArbitros] = useState([]);
  const [disableEventoPartido, setDisableEventoPartido] = useState(false);
  const [arbitroSeleccionado, setArbitroSeleccionado] = useState({});
  const [planilleroSeleccionado, setPlanilleroSeleccionado] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [arbitroDefault, setArbitroDefault] = useState({});
  const [disciplinaDelPartido, setDisciplinaDelPartido] = useState([]);
  const handleSelectTipo = (e) => {
    if (e.label === 'Partido' && !categoriaSeleccionada?.value) {
      toast.error(
        'por favor seleccione la categoria para poder mostrar las opciones del partido',
      );
      setTipoSeleccionado('Partido');
    } else {
      setShowPartido(e.label === 'Partido');
      setTipoSeleccionado('');
    }
  };

  const handleChangeCategoria = (e) => {
    setCategoriaSeleccionada(e);
    if (tipoSeleccionado === 'Partido') setShowPartido(true);
  };

  const mappearEquipos = (equipos) => {
    return equipos.map((eq) => ({
      value: eq.id,
      label: eq.nombre,
    }));
  };

  const getEquiposByCategoriaDisciplinaId = async (cat, dis) => {
    console.log('entre');
    console.log('cat', cat);
    console.log('dis', dis);
    if (cat?.value && dis?.value) {
      const result = await getEquipoByDisciplinaYCategoria(
        dis.value,
        cat.value,
      );
      console.log('ohla');
      setEquipoLocal(result);
      setEquipoVisitante(result);
      setEquipoLocalOpciones(mappearEquipos(result));
      setEquipoVisitanteOpciones(mappearEquipos(result));
    }
  };

  const getPlanillerosArbitros = async () => {
    const planilleros = await getPerfilByNombreAdmin('Planillero');
    setPlanilleros(
      planilleros.map((plan) => ({
        value: plan.id,
        label: `${plan.dni} - ${plan.nombre} ${plan.apellido}`,
      })),
    );
    const arbitros = await getPerfilByNombreAdmin('Arbitro');
    setArbitros(
      arbitros.map((plan) => ({
        value: plan.id,
        label: `${plan.dni} - ${plan.nombre} ${plan.apellido}`,
      })),
    );
  };

  const handleChangeEquipoLocal = (e) => {
    const nuevoEquipoVisitante = equipoVisitante.filter(
      (eq) => eq.id !== e.value,
    );
    setEquipoVisitanteOpciones(mappearEquipos(nuevoEquipoVisitante));
    setDefaultValueLocal(e);
  };

  const handleChangeEquipoVisitante = (e) => {
    const nuevoEquipoLocal = equipoLocal.filter((eq) => eq.id !== e.value);
    setEquipoLocalOpciones(mappearEquipos(nuevoEquipoLocal));
    setDefaultValueVisitante(e);
  };

  useEffect(() => {
    // Obtener la fecha actual
    const now = new Date();
    const offset = -3; // UTC-3
    now.setHours(now.getHours() + offset);
    const formattedNow = now.toISOString().slice(0, 16);
    setMinDate(formattedNow);
  }, []);

  const getDataDelPartido = async (id) => {
    setisLoading(true);
    const result = await getPartidoByIdAdmin(id);
    const planilleroYArbitro = await getPlanilleroYArbritroByPartidoId(id);
    const arbitro = planilleroYArbitro.find(
      (user) => user.perfil === 'Arbitro',
    );
    if (arbitro) {
      setArbitroSeleccionado({
        value: arbitro.id,
        label: `${arbitro.dni} - ${arbitro.nombre} ${arbitro.apellido}`,
      });
    }

    const planillero = planilleroYArbitro.find(
      (user) => user.perfil === 'Planillero',
    );
    if (planillero) {
      setPlanilleroSeleccionado({
        value: planillero.id,
        label: `${planillero.dni} - ${planillero.nombre} ${planillero.apellido}`,
      });
    }
    const equipos = await getEquipoByDisciplinaYCategoria(
      result?.disciplina?.id,
      result?.categoria?.id,
    );
    setEquipoLocal(equipos);
    setEquipoVisitante(equipos);
    setEquipoLocalOpciones(mappearEquipos(equipos));
    setEquipoVisitanteOpciones(mappearEquipos(equipos));
    const equipoLocal = {
      value: result?.local?.equipo?.id,
      label: result?.local?.equipo?.nombre,
    };
    const equipoVisitante = {
      value: result?.visitante?.equipo?.id,
      label: result?.visitante?.equipo?.nombre,
    };
    if (equipoLocal.value) setDefaultValueLocal(equipoLocal);
    if (equipoVisitante.value) setDefaultValueVisitante(equipoVisitante);
    setisLoading(false);
  };

  useEffect(() => {
    if (evento?.tipoEvento?.nombreTipoEvento) {
      setShowPartido(evento?.tipoEvento?.nombreTipoEvento === 'Partido');
    }

    if (evento?.tipoEvento?.nombreTipoEvento === 'Partido') {
      setDisableEventoPartido(true);
      getDataDelPartido(evento.id);
    }
  }, [evento]);

  useEffect(() => {
    if (evento?.categoria?.id && categoria) {
      setCategoriaSeleccionada(
        categoria.find((option) => option.value === evento?.categoria?.id),
      );
    }
  }, [evento, categoria]);

  useEffect(() => {
    getPlanillerosArbitros();
  }, []);

  useEffect(() => {
    setDefaultValueLocal({});
    setDefaultValueVisitante({});
    getEquiposByCategoriaDisciplinaId(
      categoriaSeleccionada,
      disciplinaDelPartido,
    );
  }, [categoriaSeleccionada, disciplinaDelPartido]);

  useEffect(() => {
    setDisciplinaDelPartido(
      disciplinas.find((option) => option.value === evento?.disciplina?.id),
    );
  }, [disciplinas, evento]);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <section className=" flex w-full flex-col md:flex-row md:justify-evenly">
        <div className="w-full md:w-[40%]">
          <InputWithLabel
            label="Nombre"
            name="Titulo"
            type="text"
            defaultValue={evento?.titulo}
            wrong={!!errors.find((e) => e.path[0] === 'Titulo')}
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
              defaultValue={evento?.descripcion}
              className={`w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
            />
          </label>
          <InputWithLabel
            label="Link stream"
            name="LinkStream"
            type="text"
            required
            defaultValue={evento?.linkStream}
            wrong={!!errors.find((e) => e.path[0] === 'LinkStream')}
          />
          <SelectWithLabel
            name="IdInstalacion"
            options={instalacion}
            defaultValue={instalacion.find(
              (option) => option.value === evento?.instalacion?.id,
            )}
            label="Instalación"
            required
            wrong={!!errors.find((e) => e.path[0] === 'IdInstalacion')}
          />
          <InputWithLabel
            label="Fecha y hora de inicio"
            name="FechaInicio"
            type="datetime-local"
            min={minDate}
            defaultValue={evento?.fechaInicio}
            wrong={!!errors.find((e) => e.path[0] === 'FechaInicio')}
            required
          />
          <InputWithLabel
            label="Fecha y hora de finalización"
            name="FechaFinEvento"
            type="datetime-local"
            min={minDate}
            defaultValue={evento?.fechaFinEvento}
            wrong={!!errors.find((e) => e.path[0] === 'FechaFinEvento')}
            required
          />
          <InputWithLabel
            label="Cupo Máximo"
            name="CupoMaximo"
            type="number"
            min={0}
            defaultValue={evento.cupoMaximo}
            wrong={!!errors.find((e) => e.path[0] === 'CupoMaximo')}
            required
          />
        </div>
        <div className="w-full md:w-[40%]">
          <InputWithLabel
            label="Banner"
            name="Banner"
            type="file"
            wrong={!!errors.find((e) => e.path[0] === 'Banner')}
            required
          />
          <SelectWithLabel
            name="IdCategoria"
            options={categoria}
            value={categoriaSeleccionada}
            label="Categoría"
            required
            wrong={!!errors.find((e) => e.path[0] === 'IdCategoria')}
            onChange={(e) => {
              handleChangeCategoria(e);
            }}
          />
          <SelectWithLabel
            name="IdTipoEvento"
            options={tipo}
            defaultValue={tipo.find(
              (option) => option.value === evento?.tipoEvento?.id,
            )}
            label="Tipo"
            required
            isDisabled={disableEventoPartido}
            onChange={(e) => {
              handleSelectTipo(e);
            }}
            wrong={!!errors.find((e) => e.path[0] === 'IdTipoEvento')}
          />
          {!showPartido && (
            <SelectWithLabel
              name="IdsDisciplinas"
              options={disciplinas}
              defaultValue={disciplinas.find(
                (option) => option.value === evento?.disciplina?.id,
              )}
              label="Disciplina del evento"
              required
              onChange={(selected) => setDisciplinasSeleccionadas(selected)}
              wrong={!!errors.find((e) => e.path[0] === 'IdsDisciplinas')}
            />
          )}
          {showPartido && (
            <>
              <label
                className={
                  'mb-3 mt-5 block text-xl font-medium text-orange-400'
                }
              >
                Datos del partido
              </label>
              <SelectWithLabel
                name="IdsDisciplinaPartido"
                options={disciplinas}
                defaultValue={disciplinaDelPartido}
                label="Disciplina del partido"
                required
                onChange={(e) => {
                  setDisciplinaDelPartido(e);
                }}
                wrong={
                  !!errors.find((e) => e.path[0] === 'IdsDisciplinaPartido')
                }
              />
              <SelectWithLabel
                name="equipoLocal"
                options={equipoLocalOpciones}
                value={defaultValueLocal}
                onChange={(e) => {
                  handleChangeEquipoLocal(e);
                }}
                label="Equipo Local"
                required
                wrong={!!errors.find((e) => e.path[0] === 'EquipoLocal')}
              />
              <SelectWithLabel
                name="equipoVisitante"
                options={equipoVisitanteOpciones}
                value={defaultValueVisitante}
                onChange={(e) => {
                  handleChangeEquipoVisitante(e);
                }}
                label="Equipo Visitante"
                required
                wrong={!!errors.find((e) => e.path[0] === 'EquipoVisitante')}
              />
              <SelectWithLabel
                name="arbitro"
                options={arbitros}
                value={arbitroSeleccionado}
                label="Árbtitro"
                onChange={(e) => {
                  setArbitroSeleccionado(e);
                }}
                required
                wrong={!!errors.find((e) => e.path[0] === 'Arbitro')}
              />
              <SelectWithLabel
                name="planillero"
                options={planilleros}
                value={planilleroSeleccionado}
                onChange={(e) => {
                  setPlanilleroSeleccionado(e);
                }}
                label="Planillero"
                required
                wrong={!!errors.find((e) => e.path[0] === 'Planillero')}
              />
            </>
          )}
          <div className="mt-9 flex w-full content-between justify-between">
            {isLoading && (
              <div>
                <CircularProgress isIndeterminate color="green.300" /> Cargando
              </div>
            )}
            <div aria-live="polite" aria-atomic="true" className="mr-4">
              {errors.length > 0 && (
                <p className="mt-2 text-sm font-bold text-red-500">
                  Alguno de los campos no fue enviado o tiene un error.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
