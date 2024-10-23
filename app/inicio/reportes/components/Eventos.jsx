import { InputWithLabel } from '@/app/ui/components/InputWithLabel/InputWithLabel';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  getInstalacionesActionAdmin,
  getUsersAdmin,
  getEventosAdmin,
  getTipoEventosAdmin,
  getReporteByUsuarioYPeriodo,
  getReporteByEvento,
  getReporteByPeriodoTipoEvento,
  getReporteByPeriodoInstalacion,
} from '@/app/utils/actions';
import React, { useEffect, useMemo, useState } from 'react';

const OPTIONS_PER_SAVE = [
  {
    label: 'Por usuario y periodo',
    value: 1,
  },
  {
    label: 'Por evento',
    value: 2,
  },
  {
    label: 'Por tipo de evento y periodo',
    value: 3,
  },
  {
    label: 'Por instalacion y periodo',
    value: 4,
  },
];
export const Eventos = () => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(
    OPTIONS_PER_SAVE[0],
  );
  const [usuarios, setUsuarios] = useState([]);
  const [instalaciones, setInstalaciones] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({});
  const [instalacionSeleccionada, setInstalacionSeleccionada] = useState({});
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [eventoSeleccionado, setEventoSeleccionado] = useState({});
  const [tiposEvento, setTiposEvento] = useState([]);
  const [tipoEventoSeleccionado, setTipoEventoSeleccionado] = useState({});
  const handleCambiarOpcion = (opcion) => {
    setOpcionSeleccionada(opcion);
    setUsuarioSeleccionado({});
    setInstalacionSeleccionada({});
    setEventoSeleccionado({});
    setTipoEventoSeleccionado({});
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
      case 2:
        return (
          <div className="max-w-[330px]">
            <div className="min-w-[170px] max-w-[330px]">
              <SelectWithLabel
                label="Nombre del Evento"
                name="filtro"
                value={eventoSeleccionado}
                options={eventos}
                onChange={setEventoSeleccionado}
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
                label="Tipo Evento"
                name="filtro"
                value={tipoEventoSeleccionado}
                options={tiposEvento}
                onChange={setTipoEventoSeleccionado}
              />
            </div>
          </div>
        );
      case 4:
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
      default:
        return <div />;
    }
  }, [
    opcionSeleccionada,
    instalacionSeleccionada,
    usuarioSeleccionado,
    usuarios,
    eventoSeleccionado,
    tiposEvento,
    tipoEventoSeleccionado,
    instalaciones,
    instalacionSeleccionada,
  ]);

  const getOptions = async () => {
    const instalaciones = await getInstalacionesActionAdmin();
    const usuarios = await getUsersAdmin();
    const eventos = await getEventosAdmin();
    const tipoEventos = await getTipoEventosAdmin();
    const tipoEventoShow = tipoEventos.map((evento) => ({
      label: evento.nombreTipoEvento,
      value: evento.id,
    }));
    const eventosToShow = eventos.map((evento) => ({
      label: evento.evento.titulo,
      value: evento.evento.id,
    }));
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
    setEventos(eventosToShow);
    setTiposEvento(tipoEventoShow);
  };
  const handlePedirReporte = async () => {
    let pdf;
    switch (opcionSeleccionada.value) {
      case 1:
        pdf = await getReporteByUsuarioYPeriodo({
          idUsuario: usuarioSeleccionado.value.toString(),
          periodoInicio: `${fechaInicio}T00:00:00`,
          periodoFin: `${fechaFin}T23:59:59`,
        });
        break;
      case 2:
        pdf = await getReporteByEvento({
          idEvento: eventoSeleccionado.value.toString(),
        });
        break;
      case 3:
        pdf = await getReporteByPeriodoTipoEvento({
          idTipoEvento: tipoEventoSeleccionado.value.toString(),
          periodoInicio: `${fechaInicio}T00:00:00`,
          periodoFin: `${fechaFin}T23:59:59`,
        });
        break;
      case 4:
        pdf = await getReporteByPeriodoInstalacion({
          idInstalacion: instalacionSeleccionada.value.toString(),
          periodoInicio: `${fechaInicio}T00:00:00`,
          periodoFin: `${fechaFin}T23:59:59`,
        });
        break;
    }
    window.open(pdf, '_blank');
  };

  const isDisable = () => {
    switch (opcionSeleccionada.value) {
      case 1:
        return (
          fechaInicio === '' || fechaFin === '' || !usuarioSeleccionado.value
        );
      case 2:
        return !eventoSeleccionado.value;
      case 3:
        return (
          fechaInicio === '' || fechaFin === '' || !tipoEventoSeleccionado.value
        );
      case 4:
        return (
          fechaInicio === '' ||
          fechaFin === '' ||
          !instalacionSeleccionada.value
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
