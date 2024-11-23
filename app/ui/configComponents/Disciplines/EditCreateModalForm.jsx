import React, { useEffect, useState } from 'react';
import { InputWithLabel } from '../../components/InputWithLabel/InputWithLabel';

const EditCreateDisciplineModalForm = ({
  disciplina = null,
  onChange,
  errors,
}) => {
  const [initialValues, setInitialValues] = useState(disciplina);
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    onChange((prevValues) => ({
      ...prevValues,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
    setInitialValues((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    setInitialValues(disciplina);
    onChange(disciplina);
  }, []);
  return (
    <form onInput={handleChange}>
      <InputWithLabel
        label="Nombre"
        name={'nombre'}
        defaultValue={initialValues?.nombre}
        type="text"
        required
      />
      <InputWithLabel
        label="Cantidad Jugadores"
        name={'cantJugadores'}
        defaultValue={initialValues?.cantJugadores}
        type="number"
        min={1}
        required
      />
      <InputWithLabel
        label="Cantidad Jugadores en banca"
        name={'cantJugadoresEnBanca'}
        type="number"
        defaultValue={initialValues?.cantJugadoresEnBanca}
        min={1}
        required
      />
      <InputWithLabel
        label="Cantidad de periodos"
        name={'periodosMax'}
        defaultValue={initialValues?.periodosMax}
        type="number"
        min={1}
        required
      />
      <InputWithLabel
        label="Tarjetas de advertencia"
        name={'tarjetasAdvertencia'}
        defaultValue={initialValues?.tarjetasAdvertencia}
        type="number"
        min={1}
        required
      />
      <InputWithLabel
        label="Tarjetas expulsión"
        name={'tarjetasExpulsion'}
        type="number"
        defaultValue={initialValues?.tarjetasExpulsion}
        min={1}
        required
      />
      <InputWithLabel
        label="Descripción"
        name={'descripcion'}
        type="text"
        defaultValue={initialValues?.descripcion}
      />
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
    </form>
  );
};

export default EditCreateDisciplineModalForm;
