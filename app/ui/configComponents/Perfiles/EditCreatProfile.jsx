import React, { useState } from 'react';
import { SelectWithLabel } from '../../components/SelectWithLabel/SelectWithLabel';
import { InputWithLabel } from '../../components/InputWithLabel/InputWithLabel';

export const EditCreatProfile = ({
  permisos,
  permisosSelected,
  setPermisosSelected,
  errors,
  perfil,
}) => {
  return (
    <div>
      <InputWithLabel
        label="Nombre"
        name={'nombre'}
        defaultValue={perfil?.nombre}
        type="text"
        wrong={errors.some((error) => error.path.includes('NombrePerfil'))}
        required
      />
      <InputWithLabel
        label="Descripción"
        name={'descripcion'}
        type="text"
        defaultValue={perfil?.descripcion}
        wrong={errors.some((error) => error.path.includes('DescripcionPerfil'))}
        required
      />
      <SelectWithLabel
        name="permisos"
        label="Permisos"
        isMulti
        options={permisos}
        value={permisosSelected}
        onChange={(selected) => setPermisosSelected(selected)}
        required
        wrong={errors.some((error) => error.path.includes('Permisos'))}
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
    </div>
  );
};
