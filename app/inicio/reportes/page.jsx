'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDaysIcon,
  ChartBarIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { Reservas } from './components/Reservas';
import { Eventos } from './components/Eventos';
import { Lecciones } from './components/Lecciones';
import withAuthorization from '@/app/utils/autorization';
import { StarIcon } from '@heroicons/react/20/solid';

function Page() {
  const [menuSelected, setMenuSelected] = useState('');
  const buttonsUser = useMemo(() => {
    return [
      {
        name: 'Reservas',
        icon: <CalendarDaysIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Lecciones',
        icon: <CheckIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Eventos',
        icon: <StarIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Estadisticas',
        icon: <ChartBarIcon className="h-[100px] w-[100px]" />,
      },
    ];
  }, []);

  const optionSelected = useMemo(() => {
    switch (menuSelected) {
      case 'Reservas':
        return <Reservas />;
      case 'Lecciones':
        return <Lecciones />;
      case 'Eventos':
        return <Eventos />;
      case 'Estadisticas':
        return <div>Proximamente</div>;
      default:
        <div />;
    }
  }, [menuSelected]);
  return (
    <section>
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Reportes
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

export default withAuthorization(Page, 'Reportes');
