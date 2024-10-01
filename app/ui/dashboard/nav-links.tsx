'use client';
import {
  UserGroupIcon,
  NewspaperIcon,
  CalendarIcon,
  BuildingOffice2Icon,
  CogIcon,
  DocumentIcon,
  TableCellsIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ServerStackIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  MegaphoneIcon,
  PaperAirplaneIcon,
  ChartBarIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { AquiVieneFlow } from '../components/AquiVieneFlow/AquiVieneFlow';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: 'Noticias',
    href: '/inicio/noticias',
    icon: NewspaperIcon,
    nombrePermiso: 'Noticias',
  },
  {
    name: 'Reservas',
    href: '/inicio/reservas',
    icon: CalendarIcon,
    nombrePermiso: 'Reservas',
  },
  {
    name: 'Instalaciones',
    href: '/inicio/instalaciones',
    icon: BuildingOffice2Icon,
    nombrePermiso: 'Instalaciones',
  },
  {
    name: 'Eventos',
    href: '/inicio/eventos',
    icon: CalendarDaysIcon,
    nombrePermiso: 'Eventos',
  },
  {
    name: 'Torneos',
    href: '/inicio/torneos',
    icon: TableCellsIcon,
    nombrePermiso: 'Torneos',
  },
  {
    name: 'Reportes',
    href: '/inicio/reportes',
    icon: DocumentIcon,
    nombrePermiso: 'Reportes',
  },
  {
    name: 'Configuracion del sistema',
    href: '/inicio/config_del_sistema',
    icon: CogIcon,
    nombrePermiso: 'Configuracion del sistema',
  },
  {
    name: 'Lecciones',
    href: '/inicio/lecciones',
    icon: AcademicCapIcon,
    nombrePermiso: 'Lecciones',
  },
  {
    name: 'Backup',
    href: '/inicio/backup',
    icon: ServerStackIcon,
    nombrePermiso: 'Backup',
  },
  {
    name: 'Estados',
    href: '/inicio/estados',
    icon: ChatBubbleBottomCenterIcon,
    nombrePermiso: 'Estados',
  },
  {
    name: 'Tipos',
    href: '/inicio/tipos',
    icon: ChatBubbleLeftIcon,
    nombrePermiso: 'Tipos',
  },
  {
    name: 'Mi Perfil',
    href: '/inicio/perfil',
    icon: UserCircleIcon,
    nombrePermiso: 'Mi perfil',
  },
  {
    name: 'Partidos',
    href: '/inicio/partido',
    icon: MegaphoneIcon,
    nombrePermiso: 'Partidos',
  },
  {
    name: 'Estadisticas',
    href: '/inicio/estadisticas',
    icon: ChartBarIcon,
    nombrePermiso: 'Estadisticas',
  },
  {
    name: 'Disciplinas',
    href: '/inicio/estadisticas',
    icon: PaperAirplaneIcon,
    nombrePermiso: 'Disciplina',
  },
];

export default function NavLinks({ onClose = () => {} }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const logOut = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    window.localStorage.clear();
    router.push('/');
  };

  const MenuNuevo = useMemo(() => {
    if (window?.localStorage?.permisos) {
      const permisos =
        window?.localStorage?.permisos &&
        JSON.parse(window?.localStorage?.permisos);
      const permisosNombres = new Set(
        permisos.map((permiso: any) => permiso.nombrePermiso),
      );
      let linksFiltrados = links.filter((link) =>
        permisosNombres.has(link.nombrePermiso),
      );
      linksFiltrados = [
        {
          name: 'Noticias',
          href: '/inicio/noticias',
          icon: NewspaperIcon,
          nombrePermiso: 'Noticias',
        },
        ...linksFiltrados,
      ];
      return linksFiltrados || [];
    }
    return [];
  }, [window.localStorage.permisos]);

  return (
    <>
      {isLoading && <AquiVieneFlow />}
      {MenuNuevo.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onClose}
            className={`
            flex h-[48px] grow items-center gap-2 rounded-md
            p-3 text-sm font-medium hover:bg-sky-100
            hover:text-blue-600 md:flex-none 
            md:justify-start md:bg-gray-50 md:p-2 md:px-3
            ${pathname === link.href ? 'bg-sky-100 text-blue-600' : ''}
            `}
          >
            <LinkIcon className="w-6" />
            <p>{link.name}</p>
          </Link>
        );
      })}
      <form>
        <button
          onClick={logOut}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <PowerIcon className="w-6" />
          <div>Sign Out</div>
        </button>
      </form>
    </>
  );
}
