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

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Noticias', href: '/v1/noticias', icon: NewspaperIcon },
  {
    name: 'Reservas',
    href: '/inicio/reservas',
    icon: CalendarIcon,
  },
  {
    name: 'Instalaciones',
    href: '/inicio/instalaciones',
    icon: BuildingOffice2Icon,
  },
  // { name: 'Eventos', href: '/inicio/eventos', icon: CalendarDaysIcon },
  // { name: 'Torneos', href: '/inicio/torneos', icon: TableCellsIcon },
  // { name: 'Reportes', href: '/inicio/reportes', icon: DocumentIcon },
  // { name: 'Configuracion del sistema', href: '/inicio/config_del_sistema', icon: CogIcon },
  // { name: 'Lecciones', href: '/inicio/lecciones', icon: AcademicCapIcon },
  // { name: 'Backup', href: '/inicio/backup', icon: ServerStackIcon },
  // { name: 'Estados', href: '/inicio/estados', icon: ChatBubbleBottomCenterIcon },
  // { name: 'Tipos', href: '/inicio/tipos', icon: ChatBubbleLeftIcon },
  // { name: 'Mi Perfil', href: '/inicio/perfil', icon: UserCircleIcon },
  // { name: 'Partidos', href: '/inicio/partido', icon: MegaphoneIcon },
  { name: 'Disciplinas', href: '/inicio/disciplinas', icon: PaperAirplaneIcon },
  { name: 'Estadisticas', href: '/inicio/estadisticas', icon: ChartBarIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const logOut = () => {
    window.localStorage.clear();
    router.push('/');
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`
            flex h-[48px] grow items-center justify-center gap-2 rounded-md
            bg-gray-50 p-3 text-sm font-medium
            hover:bg-sky-100 hover:text-blue-600 
            md:flex-none md:justify-start md:p-2 md:px-3
            ${pathname === link.href ? 'bg-sky-100 text-blue-600' : ''}
            `}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
      <form>
        <button
          onClick={logOut}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Sign Out</div>
        </button>
      </form>
    </>
  );
}
