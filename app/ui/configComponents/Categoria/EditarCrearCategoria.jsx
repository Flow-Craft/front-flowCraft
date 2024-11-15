import React from 'react';
import { SelectWithLabel } from '../../components/SelectWithLabel/SelectWithLabel';
import { InputWithLabel } from '../../components/InputWithLabel/InputWithLabel';
import { SEX_CATEGORIA_SELECT_OPTIONS } from '@/app/utils/const';

export const EditarCrearCategoria = ({ errors, categoria }) => {
  return (
    <div>
      <InputWithLabel
        label="Nombre"
        name={'nombre'}
        defaultValue={categoria?.nombre}
        type="text"
        wrong={errors.some((error) => error.path.includes('Nombre'))}
        required
      />
      <InputWithLabel
        label="Edad Minima"
        name={'edadMinima'}
        type="number"
        min={1}
        defaultValue={categoria?.edadMinima}
        wrong={errors.some((error) => error.path.includes('EdadMinima'))}
        required
      />
      <InputWithLabel
        label="Edad Maxima"
        name={'edadMaxima'}
        type="number"
        min={1}
        defaultValue={categoria?.edadMaxima}
        wrong={errors.some((error) => error.path.includes('EdadMaxima'))}
        required
      />
      <SelectWithLabel
        name="genero"
        label="Genero"
        options={SEX_CATEGORIA_SELECT_OPTIONS}
        defaultValue={SEX_CATEGORIA_SELECT_OPTIONS.find(
          (option) => option.value === categoria?.genero,
        )}
        required
        wrong={errors.some((error) => error.path.includes('Genero'))}
      />
      <label
        className="mb-3 mt-5 block text-lg font-medium text-gray-900"
        htmlFor={'descripcion'}
      >
        Descripcion
        <textarea
          name="descripcion"
          rows="5"
          cols="50"
          defaultValue={categoria?.descripcion}
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
