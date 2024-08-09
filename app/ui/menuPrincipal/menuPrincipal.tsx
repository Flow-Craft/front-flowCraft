'use client';
import { useEffect, useState } from 'react';
import AcmeLogo from '@/app/ui/acme-logo';
import Link from 'next/link';
import { Button } from '../button';
import { usePathname } from 'next/navigation';
import { LOGIN_HREF, QUIENES_SOMOS_HREF, SING_UP_HREF } from '@/app/lib/const';
import { checkJWTSession } from '@/app/lib/actions';
import { AquiVieneFlow } from '../components/AquiVieneFlow/AquiVieneFlow';

export default function MenuPrincipal() {
  const [isLoading, setIsLoading] = useState(true);
  const verifySession = async () => {
    await checkJWTSession();
  };

  useEffect(() => {
    verifySession();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <AquiVieneFlow />;
  }

  const pathname = usePathname();
  return (
    <div className="flex h-20 shrink-0 items-end justify-between rounded-lg bg-blue-500 p-4 md:h-40">
      <AcmeLogo />
      <div className="flex flex-row">
        <Button className="mx-3 font-medium">DISCIPLINAS</Button>
        <Button className="mx-3 font-medium">INSTALACIONES</Button>
        <Button className="mx-3 font-medium">NOTICIAS</Button>
        <Button
          className={` mx-3 font-medium ${pathname === QUIENES_SOMOS_HREF ? 'bg-blue-400' : ''} font-bold`}
        >
          <Link href={QUIENES_SOMOS_HREF}>¿QUIENES SOMOS?</Link>
        </Button>
      </div>
      <div className="flex flex-row">
        <Button
          className={`${pathname === LOGIN_HREF ? 'bg-blue-400' : ''} font-bold`}
        >
          <Link href={LOGIN_HREF}>INICIAR SESIÓN</Link>
        </Button>
        <Button
          className={`${pathname === SING_UP_HREF ? 'bg-blue-400' : ''} font-bold`}
        >
          <Link href={SING_UP_HREF}>REGISTRARME</Link>
        </Button>
      </div>
    </div>
  );
}
