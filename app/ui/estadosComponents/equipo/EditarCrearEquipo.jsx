import React from 'react';
import { InputWithLabel } from '../../components/InputWithLabel/InputWithLabel';

export const EditarCrearEquipo = ({ errors, equipo }) => {
  return (
    <div>
      <InputWithLabel
        label="Nombre"
        name={'nombre'}
        defaultValue={equipo?.nombreEstado}
        type="text"
        wrong={errors.some((error) => error.path.includes('NombreEstado'))}
        required
      />
      <label
        className="mb-3 mt-5 block text-lg font-medium text-gray-900"
        htmlFor={'descripcion'}
      >
        Descripción
        <textarea
          name="descripcion"
          rows="5"
          cols="50"
          defaultValue={equipo?.descripcionEstado}
          className={`w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
        />
      </label>
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
  );
};
