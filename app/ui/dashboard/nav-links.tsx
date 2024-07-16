'use client'
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
  PowerIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Noticias', href: '/dashboard', icon: NewspaperIcon },
  {
    name: 'Reservas',
    href: '/dashboard/invoices',
    icon: CalendarIcon,
  },
  { name: 'Instalaciones', href: '/dashboard/customers', icon: BuildingOffice2Icon },
  { name: 'Eventos', href: '/dashboard/customers', icon: CalendarDaysIcon },
  { name: 'Torneos', href: '/dashboard/customers', icon: TableCellsIcon },
  { name: 'Reportes', href: '/dashboard/customers', icon: DocumentIcon },
  { name: 'Configuracion del sistema', href: '/dashboard/customers', icon: CogIcon },
  { name: 'Lecciones', href: '/dashboard/customers', icon: AcademicCapIcon },
  { name: 'Backup', href: '/dashboard/customers', icon: ServerStackIcon },
  // { name: 'Estados', href: '/dashboard/customers', icon: ChatBubbleBottomCenterIcon },
  // { name: 'Tipos', href: '/dashboard/customers', icon: ChatBubbleLeftIcon },
  // { name: 'Mi Perfil', href: '/dashboard/customers', icon: UserCircleIcon },
  // { name: 'Partidos', href: '/dashboard/customers', icon: MegaphoneIcon },
  // { name: 'Disciplinas', href: '/dashboard/customers', icon: PaperAirplaneIcon },
  // { name: 'Estadisticas', href: '/dashboard/customers', icon: ChartBarIcon },
];

export default function NavLinks() {
  const pathname = usePathname() // para saber el path activo
  //            ${pathname === link.href ? 'bg-sky-100 text-blue-600' : '' }
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
            `}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
      <form>
        <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Sign Out</div>
        </button>
      </form>
    </>
  );
}
