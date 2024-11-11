'use client';
import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import {
  GetEstadisticasByUsuarioDNI,
  GetEstadisticasByUsuarioLogin,
  getUsersAdmin,
} from '@/app/utils/actions';
import withAuthorization from '@/app/utils/autorization';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

const HEADER_TABLE = [
  { name: 'Accion' },
  { name: 'Marca' },
  { name: 'Puntos' },
  { name: 'Partido/Leccion' },
  { name: 'Fecha' },
  { name: 'Equipo' },
];

function Page() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({});
  const [estadisticasAMostrar, setEstadisticasAMostrar] = useState([]);
  const getUsuariosParaBuscarEstadisticas = async () => {
    const { usuarios } = await getUsersAdmin();
    const usuariosValue = usuarios.map((usr) => ({
      value: usr.dni,
      label: `${usr.dni} - ${usr.apellido} ${usr.nombre}`,
    }));
    setUsuarios([{ value: 0, label: 'Yo mismo' }, ...usuariosValue]);
  };

  const handleChangeUsuario = async (e) => {
    let result;
    if (e.value) {
      result = await GetEstadisticasByUsuarioDNI(e.value);
    } else {
      result = await GetEstadisticasByUsuarioLogin();
    }
    result = result.sort(
      (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion),
    );

    setEstadisticasAMostrar(
      result.map((est) => ({
        id: est.id,
        accion: est.tipoAccionPartido.nombreTipoAccion,
        marca: est.marcaEstadistica,
        puntosTotales: est.puntajeTipoAccion,
        esPartido: est.partido ? 'Partido' : 'Leccion',
        fecha: est.fechaCreacion.split('T')[0],
        equipo: est.equipo ? `${est.equipo.nombre}` : ``,
      })),
    );
  };

  useEffect(() => {
    getUsuariosParaBuscarEstadisticas();
  }, []);

  return (
    <section>
      <Toaster />
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Estadisticas
      </div>
      <div className="ml-8 flex flex-row items-center gap-3">
        <div className="min-w-[500px]">
          <SelectWithLabel
            label="Seleccionar el jugador a visualizar"
            options={usuarios}
            value={usuarioSeleccionado}
            onChange={(e) => {
              setUsuarioSeleccionado(e);
              handleChangeUsuario(e);
            }}
          />
        </div>
      </div>
      <section className="mt-4">
        <FlowTable Header={HEADER_TABLE} dataToShow={estadisticasAMostrar} />
      </section>
    </section>
  );
}

export default withAuthorization(Page, 'Estadisticas');
