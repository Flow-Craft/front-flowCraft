import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import React, { useMemo } from 'react';

export const EditCreateInstall = ({
  instalacionSeleccionada,
  errors,
  disable,
  estadoInstalacion = [],
}) => {
  const defaultEstadoInstalacion = useMemo(() => {
    if (!estadoInstalacion || !instalacionSeleccionada) {
      return null;
    } else {
      const { instalacionEstado } =
        instalacionSeleccionada?.instalacion?.instalacionHistoriales?.find(
          (e) => !e.fechaBaja,
        );
      return estadoInstalacion?.find((e) => e.value === instalacionEstado?.id);
    }
  }, [estadoInstalacion, instalacionSeleccionada]);
  return (
    <div>
      <InputWithLabel
        name={'nombre'}
        type="text"
        label="Nombre"
        defaultValue={instalacionSeleccionada?.instalacion?.nombre}
        readOnly={disable}
        required
      />
      <InputWithLabel
        name={'ubicacion'}
        type="text"
        label="Ubicación"
        defaultValue={instalacionSeleccionada?.instalacion?.ubicacion}
        readOnly={disable}
        required
      />
      <InputWithLabel
        name={'precio'}
        type="number"
        min={0}
        label="Precio por hora"
        defaultValue={instalacionSeleccionada?.instalacion?.precio}
        readOnly={disable}
        required
      />
      <InputWithLabel
        name={'inicio'}
        type="time"
        min="00:00"
        max="23:59"
        label="Hora de apertura"
        defaultValue={instalacionSeleccionada?.instalacion?.horaInicio}
        readOnly={disable}
        required
      />
      <InputWithLabel
        name={'cierre'}
        type="time"
        min="00:00"
        max="23:59"
        label="Hora de cierre"
        defaultValue={instalacionSeleccionada?.instalacion?.horaCierre}
        readOnly={disable}
        required
      />
      <SelectWithLabel
        name={'estadoInstalacion'}
        label="Estado Instalación"
        options={estadoInstalacion}
        defaultValue={defaultEstadoInstalacion}
        isDisabled={disable}
        required
      />
      <label
        className="mb-3 mt-5 block text-lg font-medium text-gray-900"
        htmlFor={'descripcion'}
      >
        Condiciones
        <label className="text-red-600"> *</label>
        <textarea
          name="condiciones"
          rows="5"
          cols="50"
          defaultValue={instalacionSeleccionada?.instalacion?.condiciones}
          readOnly={disable}
          className={`w-full resize-none rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none`}
        />
      </label>
      {errors.length > 0 && errors.find((e) => e.path[0] === 'HoraFin') ? (
        <div className="text-red-600">
          Las horas seleccionadas son incompatibles
        </div>
      ) : (
        errors.length > 0 && (
          <div className="text-red-600">Todos los campos son obligatorios</div>
        )
      )}
    </div>
  );
};
