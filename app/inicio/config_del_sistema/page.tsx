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

export default function Page() {
  const [menuSelected, setMenuSelected] = useState<string>('');
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
        name: 'Parámetros',
        icon: <CpuChipIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Disciplinas',
        icon: <FireIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Lecciones',
        icon: <EyeSlashIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Categorias',
        icon: <FunnelIcon className="h-[100px] w-[100px]" />,
      },
    ];
  }, []);

  const optionSelected = useMemo(() => {
    switch (menuSelected) {
      case 'Usuario':
        return <UserTab />;
      case 'Disciplinas':
        return <DisciplinasTab />;
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
          })}
        </div>
        <section>{optionSelected}</section>
      </section>
    </section>
  );
}
