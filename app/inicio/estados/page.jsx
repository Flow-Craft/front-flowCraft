'use client';

import { useMemo, useState } from 'react';
import {
  UserCircleIcon,
  GiftTopIcon,
  InboxIcon,
  LightBulbIcon,
  MapPinIcon,
  RadioIcon,
} from '@heroicons/react/24/outline';
import { EquiposTab } from '@/app/ui/estadosComponents/equipo/EquipoTab';
import { EventosTab } from '@/app/ui/estadosComponents/evento/EventosTab';
import { UsuariosTab } from '@/app/ui/estadosComponents/usuario/UsuariosTab';
import { LeccionTab } from '@/app/ui/estadosComponents/leccion/LeccionTab';
import { InstalacionTab } from '@/app/ui/estadosComponents/instalacion/InstalacionTab';
import { TorneosTab } from '@/app/ui/estadosComponents/torneos/TorneosTab';
import withAuthorization from '@/app/utils/autorization';

function Page() {
  const [menuSelected, setMenuSelected] = useState('');
  const buttonsUser = useMemo(() => {
    return [
      {
        name: 'Equipo',
        icon: <GiftTopIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Evento',
        icon: <InboxIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Usuario',
        icon: <UserCircleIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Leccion',
        icon: <LightBulbIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Instalacion',
        icon: <MapPinIcon className="h-[100px] w-[100px]" />,
      },
      {
        name: 'Torneo',
        icon: <RadioIcon className="h-[100px] w-[100px]" />,
      },
    ];
  }, []);

  const optionSelected = useMemo(() => {
    switch (menuSelected) {
      case 'Equipo':
        return <EquiposTab />;
      case 'Evento':
        return <EventosTab />;
      case 'Usuario':
        return <UsuariosTab />;
      case 'Leccion':
        return <LeccionTab />;
      case 'Instalacion':
        return <InstalacionTab />;
      case 'Torneo':
        return <TorneosTab />;
      default:
        <div />;
    }
  }, [menuSelected]);
  return (
    <section>
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Estados del sistema
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

export default withAuthorization(Page, 'Estados');
