import React, { useEffect, useState } from 'react';
import { InputWithLabel } from '../../components/InputWithLabel/InputWithLabel';

const EditCreateDisciplineModalForm = ({ disciplina = null, onChange }) => {
  const [initialValues, setInitialValues] = useState(disciplina);
  const handleChange = (e) => {
    onChange((current) => ({
      ...current,
      [e.target.name]: e.target.value,
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
        min="1"
        required
      />
      <InputWithLabel
        label="Cantidad Jugadores en banca"
        name={'cantJugadoresEnBanca'}
        type="number"
        defaultValue={initialValues?.cantJugadoresEnBanca}
        min="1"
        required
      />
      <InputWithLabel
        label="Cantidad de periodos"
        name={'periodosMax'}
        defaultValue={initialValues?.periodosMax}
        type="number"
        min="1"
        required
      />
      <InputWithLabel
        label="Tarjetas de advertencia"
        name={'tarjetasAdvertencia'}
        defaultValue={initialValues?.tarjetasAdvertencia}
        type="number"
        min="1"
        required
      />
      <InputWithLabel
        label="Tarjetas expulsión"
        name={'tarjetasExpulsion'}
        type="number"
        defaultValue={initialValues?.tarjetasExpulsion}
        min="1"
        required
      />
      <InputWithLabel
        label="Descripción"
        name={'descripcion'}
        type="text"
        defaultValue={initialValues?.descripcion}
      />
    </form>
  );
};

export default EditCreateDisciplineModalForm;
