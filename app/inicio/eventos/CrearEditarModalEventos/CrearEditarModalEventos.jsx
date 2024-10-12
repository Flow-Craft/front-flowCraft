import React, { useEffect, useState } from 'react';
import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import toast from 'react-hot-toast';
import { getEquipoByDisciplinaYCategoria } from '@/app/utils/actions';

export const CrearEditarModalEventos = ({
  errors = [],
  evento,
  instalacion,
  categoria,
  disciplinas,
  tipo,
  setDisciplinasSeleccionadas,
}) => {
  const [minDate, setMinDate] = useState('');
  const [showPartido, setShowPartido] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState({})
  const [tipoSeleccionado, setTipoSeleccionado] = useState("")
  const [equipoLocal, setEquipoLocal] = useState([]);
  const [equipoLocalOpciones, setEquipoLocalOpciones] = useState([]);
  const [equipoVisitante, setEquipoVisitante] = useState({});
  const [equipoVisitanteOpciones, setEquipoVisitanteOpciones] = useState([])
  const handleSelectTipo = (e) => {
    if(e.label === 'Partido' && !categoriaSeleccionada?.value){
      toast.error("por favor seleccione la categoria para poder mostrar las opciones del partido");
      setTipoSeleccionado("Partido");
    }else{
      setShowPartido(e.label === 'Partido');
      setTipoSeleccionado("")
    }
    
  };

  const handleChangeCategoria = (e) =>{
    setCategoriaSeleccionada(e);
    if(tipoSeleccionado === "Partido") setShowPartido(true)
  }

  const mappearEquipos = (equipos)=>{
    return equipos.map((eq)=>({
      value:eq.id,
      label:eq.nombre
    }))
  }

  const getEquiposByCategoriaDisciplina = async(e) =>{
    const result  = await getEquipoByDisciplinaYCategoria(e.value,categoriaSeleccionada.value)
    setEquipoLocal(result)
    setEquipoVisitante(result)
    setEquipoLocalOpciones(mappearEquipos(result))
    setEquipoVisitanteOpciones(mappearEquipos(result))
  }

  const handleChangeEquipoLocal = (e) =>{
    const nuevoEquipoVisitante = equipoVisitante.filter((eq)=>eq.id !== e.value )
    setEquipoVisitanteOpciones(mappearEquipos(nuevoEquipoVisitante))
  }

  const handleChangeEquipoVisitante = (e) =>{
    const nuevoEquipoLocal = equipoLocal.filter((eq)=>eq.id !== e.value )
    setEquipoLocalOpciones(mappearEquipos(nuevoEquipoLocal))
  }

  useEffect(() => {
    // Obtener la fecha actual
    const today = new Date();
    // Establecer la hora a las 00:01
    today.setHours(0, 1, 0, 0); // Hora: 00, Minutos: 01, Segundos: 00, Milisegundos: 00

    // Formatear la fecha en el formato 'YYYY-MM-DDTHH:MM'
    const formattedDate = today.toISOString().slice(0, 16);
    setMinDate(formattedDate);
  }, []);

  useEffect(() => {
    if (evento?.tipoEvento?.nombreTipoEvento)
      setShowPartido(evento?.tipoEvento?.nombreTipoEvento === 'Partido');
  }, [evento]);

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
            Descripcion
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
            label="Instalacion"
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
            label="Fecha y hora de finalizacion"
            name="FechaFinEvento"
            type="datetime-local"
            min={minDate}
            defaultValue={evento?.fechaFinEvento}
            wrong={!!errors.find((e) => e.path[0] === 'FechaFinEvento')}
            required
          />
          <InputWithLabel
            label="Cupo Maximo"
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
            defaultValue={categoria.find(
              (option) => option.value === evento?.categoria?.id,
            )}
            label="Categoria"
            required
            wrong={!!errors.find((e) => e.path[0] === 'IdCategoria')}
            onChange={(e)=>{
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
            onChange={(e) => {
              handleSelectTipo(e);
            }}
            wrong={!!errors.find((e) => e.path[0] === 'IdTipoEvento')}
          />
          {!showPartido && (
            <SelectWithLabel
              name="IdsDisciplinas"
              options={disciplinas}
              defaultValue={evento?.disciplinas?.map((dis) => {
                return disciplinas.find((option) => option.value === dis.id);
              })}
              label="Disciplina del evento"
              isMulti
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
                defaultValue={evento?.disciplinas?.map((dis) => {
                  return disciplinas.find((option) => option.value === dis.id);
                })}
                label="Disciplina del partido"
                required
                onChange={(e)=>{
                  getEquiposByCategoriaDisciplina(e);
                }}
                // wrong={!!errors.find((e) => e.path[0] === 'IdsDisciplinas')}
              />
              <SelectWithLabel
                name="equipoLocal"
                options={equipoLocalOpciones}
                //   defaultValue={SEX_SELECT_OPTIONS.find(
                //     (option) => option.value === user.sexo,
                //   )}
                onChange={(e)=>{
                  handleChangeEquipoLocal(e);
                }}
                label="Equipo Local"
                required
                wrong={!!errors.find((e) => e.path[0] === 'Sexo')}
              />
              <SelectWithLabel
                name="equipoVisitante"
                options={equipoVisitanteOpciones}
                //   defaultValue={SEX_SELECT_OPTIONS.find(
                //     (option) => option.value === user.sexo,
                //   )}
                onChange={(e)=>{
                  handleChangeEquipoVisitante(e)
                }}
                label="Equipo Visitante"
                required
                wrong={!!errors.find((e) => e.path[0] === 'Sexo')}
              />
              <SelectWithLabel
                name="arbitro"
                options={[]}
                //   defaultValue={SEX_SELECT_OPTIONS.find(
                //     (option) => option.value === user.sexo,
                //   )}
                label="Arbitro"
                required
                wrong={!!errors.find((e) => e.path[0] === 'Sexo')}
              />
              <SelectWithLabel
                name="planillero"
                options={[]}
                //   defaultValue={SEX_SELECT_OPTIONS.find(
                //     (option) => option.value === user.sexo,
                //   )}
                label="Planillero"
                required
                wrong={!!errors.find((e) => e.path[0] === 'Sexo')}
              />
            </>
          )}
          <div className="mt-9 flex w-full content-between justify-between">
            <div aria-live="polite" aria-atomic="true" className="mr-4">
              {errors &&
                errors.map((error) => (
                  <p
                    className="mt-2 text-sm font-bold text-red-500"
                    key={error.message}
                  >
                    {error.message}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
