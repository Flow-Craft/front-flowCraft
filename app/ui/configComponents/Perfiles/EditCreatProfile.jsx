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
    </div>
  );
};
