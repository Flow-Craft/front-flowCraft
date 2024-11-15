import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  getInstalacionesActionAdmin,
  getUsersAdmin,
  ReporteReservasByInstalacionPeriodo,
  ReporteReservasByPeriodo,
  ReporteReservasByUsuarioPeriodo,
} from '@/app/utils/actions';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const OPTIONS_PER_SAVE = [
  {
    label: 'Por periodo',
    value: 1,
  },
  {
    label: 'Por instalación y periodo',
    value: 2,
  },
  {
    label: 'Por usuario y periodo',
    value: 3,
  },
];
export const Reservas = () => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState({
    label: 'Por periodo',
    value: 1,
  });
  const [usuarios, setUsuarios] = useState([]);
  const [instalaciones, setInstalaciones] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({});
  const [instalacionSeleccionada, setInstalacionSeleccionada] = useState({});
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const handleCambiarOpcion = (opcion) => {
    setOpcionSeleccionada(opcion);
    setUsuarioSeleccionado({});
    setInstalacionSeleccionada({});
  };
  const opcionAmostrar = useMemo(() => {
    switch (opcionSeleccionada.value) {
      case 1:
        return (
          <div className="max-w-[330px]">
            <InputWithLabel
              label="Fecha Desde"
              name="FechaInicio"
              type="date"
              onChange={(e) => {
                setFechaInicio(e.target.value);
              }}
            />
            <InputWithLabel
              label="Fecha Hasta"
              name="FechaFin"
              type="date"
              onChange={(e) => {
                setFechaFin(e.target.value);
              }}
            />
          </div>
        );
      case 2:
        return (
          <div className="max-w-[330px]">
            <InputWithLabel
              label="Fecha Desde"
              name="FechaInicio"
              type="date"
              onChange={(e) => {
                setFechaInicio(e.target.value);
              }}
            />
            <InputWithLabel
              label="Fecha Hasta"
              name="FechaFin"
              type="date"
              onChange={(e) => {
                setFechaFin(e.target.value);
              }}
            />
            <div className="min-w-[170px] max-w-[330px]">
              <SelectWithLabel
                label="Instalacion"
                name="filtro"
                value={instalacionSeleccionada}
                options={instalaciones}
                onChange={setInstalacionSeleccionada}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="max-w-[330px]">
            <InputWithLabel
              label="Fecha Desde"
              name="FechaInicio"
              type="date"
              onChange={(e) => {
                setFechaInicio(e.target.value);
              }}
            />
            <InputWithLabel
              label="Fecha Hasta"
              name="FechaFin"
              type="date"
              onChange={(e) => {
                setFechaFin(e.target.value);
              }}
            />
            <div className="min-w-[170px] max-w-[330px]">
              <SelectWithLabel
                label="Usuario"
                name="filtro"
                value={usuarioSeleccionado}
                options={usuarios}
                onChange={setUsuarioSeleccionado}
              />
            </div>
          </div>
        );
      default:
        return <div />;
    }
  }, [opcionSeleccionada, instalacionSeleccionada, usuarioSeleccionado]);

  const getOptions = async () => {
    const instalaciones = await getInstalacionesActionAdmin();
    const usuarios = await getUsersAdmin();
    const usuariosToShow = usuarios.usuarios.map((user) => {
      return {
        label: `${user.dni} - ${user.apellido} ${user.nombre}`,
        value: user.id,
      };
    });
    const instalacionesToShow = instalaciones.map((ins) => {
      return {
        label: ins.nombre,
        value: ins.id,
      };
    });
    setUsuarios(usuariosToShow);
    setInstalaciones(instalacionesToShow);
  };
  const handlePedirReporte = async () => {
    try {
      let pdf;
      switch (opcionSeleccionada.value) {
        case 1:
          pdf = await ReporteReservasByPeriodo({
            periodoInicio: `${fechaInicio}T00:00:00`,
            periodoFin: `${fechaFin}T23:59:59`,
          });
          break;
        case 2:
          pdf = await ReporteReservasByInstalacionPeriodo({
            IdInstalacion: instalacionSeleccionada.value,
            periodoInicio: `${fechaInicio}T00:00:00`,
            periodoFin: `${fechaFin}T23:59:59`,
          });
          break;
        case 3:
          usuarioSeleccionado;
          pdf = await ReporteReservasByUsuarioPeriodo({
            IdUsuario: usuarioSeleccionado.value.toString(),
            periodoInicio: `${fechaInicio}T00:00:00`,
            periodoFin: `${fechaFin}T23:59:59`,
          });
          break;
      }
      window.open(pdf, '_blank');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isDisable = () => {
    switch (opcionSeleccionada.value) {
      case 1:
        return fechaInicio === '' || fechaFin === '';
      case 2:
        return (
          fechaInicio === '' ||
          fechaFin === '' ||
          !instalacionSeleccionada.value
        );
      case 3:
        return (
          fechaInicio === '' || fechaFin === '' || !usuarioSeleccionado.value
        );
      default:
        return false;
    }
  };
  useEffect(() => {
    getOptions();
  }, []);
  return (
    <div className="mt-7">
      <section>
        <div className="min-w-[170px] max-w-[330px]">
          <SelectWithLabel
            label="Filtro"
            name="filtro"
            value={opcionSeleccionada}
            options={OPTIONS_PER_SAVE}
            onChange={handleCambiarOpcion}
          />
        </div>
        <div className="mt-7">{opcionAmostrar}</div>
        <div className="mt-7">
          <div className="ml-[300px]">
            <button
              onClick={() => handlePedirReporte()}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isDisable()}
            >
              Generar Reporte
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
