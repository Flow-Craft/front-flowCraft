'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDaysIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/outline';
import { TiposAccionPartido } from '@/app/ui/tiposSistema/TiposAccionPartido';
import { TipoEventos } from '@/app/ui/tiposSistema/TipoEventos';
import usePermisos from '@/app/utils/permisos';

export default function Page() {
  const [menuSelected, setMenuSelected] = useState<string>('');
  const { getPermisosByNombre } = usePermisos();
  const permisos = getPermisosByNombre('Tipos');
  const buttonsUser = useMemo(() => {
    return [
      {
        name: 'ABM tipo evento',
        icon: <CalendarDaysIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'ABM tipo accion',
        icon: <ChartBarSquareIcon className="h-[100px] w-[100px]" />,
      },
    ];
  }, []);

  const optionSelected = useMemo(() => {
    switch (menuSelected) {
      case 'ABM tipo evento':
        return <TipoEventos />;
      case 'ABM tipo accion':
        return <TiposAccionPartido />;
      default:
        <div />;
    }
  }, [menuSelected]);
  return (
    <section>
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Tipos del sistema
      </div>
      <section>
        <div className="flex flex-row flex-wrap gap-7">
          {buttonsUser.map((bt) => {
            if (
              permisos.some((perm: any) => perm.funcionalidades === bt.name)
            ) {
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
