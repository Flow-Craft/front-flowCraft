import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import {Bars3Icon} from '@heroicons/react/24/outline';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="mb-2 flex h-50 items-end justify-start text-white rounded-md bg-blue-600 p-4 md:h-20">
          <Link
            href="/"
          >
            <div className="w-32 text-white md:w-40">
              <AcmeLogo />
            </div>
        </Link>
        <div>
          <div>Hola Mario!!!</div>
          <div className='font-bold'>Administrativo</div>
        </div>
        <div className='md:hidden'>
            <Bars3Icon/>
        </div>
      </div>
      <div className=" hidden md:flex grow flex-row justify-between space-x-2  md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
      </div>
    </div>
  );
}
