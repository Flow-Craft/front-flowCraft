'use client'
import AcmeLogo from '@/app/ui/acme-logo';
import Link from 'next/link';
import { Button } from '../button';
import { usePathname } from 'next/navigation';

const LOGIN_HREF = "/login"

export default function MenuPrincipal() {
    const pathname = usePathname()
  return (
    <div className="flex h-20 shrink-0 items-end justify-between rounded-lg bg-blue-500 p-4 md:h-40">
        <AcmeLogo />
        <div className='flex flex-row'>
            <Button className='font-medium mx-3' >DISCIPLINAS</Button>
            <Button className='font-medium mx-3' >INSTALACIONES</Button>
            <Button className='font-medium mx-3' >NOTICIAS</Button>
            <Button className='font-medium mx-3' >¿QUIENES SOMOS?</Button>
        </div>
        <div className='flex flex-row'>
            <Button className={`${pathname === LOGIN_HREF ? 'bg-blue-400' : '' } font-bold`}>
                <Link href={LOGIN_HREF}>
                    INICIAR SESIÓN
                </Link>
            </Button>
            <Button className='font-bold'>
                <Link href={LOGIN_HREF}>
                    REGISTRARME
                </Link>
            </Button>
        </div>
    </div>
  );
}