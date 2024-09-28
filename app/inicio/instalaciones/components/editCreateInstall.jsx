import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import React from 'react';

export const EditCreateInstall = ({ instalacionSeleccionada, errors }) => {
  return (
    <div>
      <InputWithLabel
        name={'nombre'}
        type="text"
        label="Nombre"
        defaultValue={instalacionSeleccionada?.nombreTipoEvento}
        required
      />
      <InputWithLabel
        name={'ubicacion'}
        type="text"
        label="Ubicacion"
        defaultValue={instalacionSeleccionada?.nombreTipoEvento}
        required
      />
      <InputWithLabel
        name={'precio'}
        type="number"
        label="Precio por hora"
        defaultValue={instalacionSeleccionada?.nombreTipoEvento}
        required
      />
      <InputWithLabel
        name={'inicio'}
        type="time"
        min="00:00"
        max="23:59"
        label="Hora de apertura"
        defaultValue={instalacionSeleccionada?.nombreTipoEvento}
        required
      />
      <InputWithLabel
        name={'cierre'}
        type="time"
        min="00:00"
        max="23:59"
        label="Hora de cierre"
        defaultValue={instalacionSeleccionada?.nombreTipoEvento}
        required
      />
      <label
        className="mb-3 mt-5 block text-lg font-medium text-gray-900"
        htmlFor={'descripcion'}
      >
        Condiciones
        <label className="text-red-600"> *</label>
        <textarea
          name="descripcion"
          rows="5"
          cols="50"
          defaultValue={instalacionSeleccionada?.descripcion}
          className={`w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
        />
      </label>
      {errors.length > 0 && (
        <div className="text-red-600">Todos los campos son obligatorios</div>
      )}
    </div>
  );
};
