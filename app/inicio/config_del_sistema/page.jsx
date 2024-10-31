'use client';

import { useMemo, useState } from 'react';
import {
  UserCircleIcon,
  UserGroupIcon,
  FolderIcon,
  CpuChipIcon,
  FireIcon,
  EyeSlashIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { UserTab } from '@/app/ui/configComponents/User';
import { DisciplinasTab } from '@/app/ui/configComponents/Disciplines';
import { ProfilesTab } from '@/app/ui/configComponents/Profiles';
import { SolicitudesTab } from '@/app/ui/configComponents/Solicitudes';
import { CategoriasTab } from '@/app/ui/configComponents/Categorias';
import { ParametrosTab } from '@/app/ui/configComponents/Parametros';
import usePermisos from '@/app/utils/permisos';
import withAuthorization from '@/app/utils/autorization';

function Page() {
  const [menuSelected, setMenuSelected] = useState('');
  const { getPermisosByNombre } = usePermisos();
  const permisos = getPermisosByNombre('Configuracion del sistema');
  console.log('permisos', permisos);
  const buttonsUser = useMemo(() => {
    return [
      {
        name: 'Usuario',
        icon: <UserCircleIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Perfiles',
        icon: <UserGroupIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Solicitudes',
        icon: <FolderIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Configuraciones generales',
        icon: <CpuChipIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Disciplina',
        icon: <FireIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Categoria',
        icon: <FunnelIcon className="h-[100px] w-[100px]" />,
      },
    ];
  }, []);

  const optionSelected = useMemo(() => {
    switch (menuSelected) {
      case 'Usuario':
        return <UserTab />;
      case 'Disciplina':
        return <DisciplinasTab />;
      case 'Perfiles':
        return <ProfilesTab />;
      case 'Solicitudes':
        return <SolicitudesTab />;
      case 'Categoria':
        return <CategoriasTab />;
      case 'Configuraciones generales':
        return <ParametrosTab />;
      default:
        <div />;
    }
  }, [menuSelected]);
  return (
    <section>
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Configuracion del sistema
      </div>
      <section>
        <div className="flex flex-row flex-wrap gap-7">
          {buttonsUser.map((bt) => {
            if (permisos.some((permiso) => permiso.modulo === bt.name)) {
              return (
                <div
                  className={`flex 
                    h-[150px] 
                    w-[140px] cursor-pointer flex-col items-center rounded-lg bg-blue-300 p-4 text-center text-white
                    ${menuSelected === bt.name && 'bg-blue-600 shadow-lg shadow-cyan-500/50'}
                  `}
                  onClick={() => {
                    setMenuSelected(bt.name);
                  }}
                  key={bt.name}
                >
                  {bt.icon}
                  {bt.name}
                </div>
              );
            }
          })}
        </div>
        <section>{optionSelected}</section>
      </section>
    </section>
  );
}

export default withAuthorization(Page, 'Configuracion del sistema');
