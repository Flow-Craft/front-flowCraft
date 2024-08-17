'use client';
import { useCallback, useEffect, useState } from 'react';
import AcmeLogo from '@/app/ui/acme-logo';
import Link from 'next/link';
import { Button } from '../button';
import { usePathname } from 'next/navigation';
import { LOGIN_HREF, QUIENES_SOMOS_HREF, SING_UP_HREF } from '@/app/lib/const';
import { checkJWTSession } from '@/app/lib/actions';
import { AquiVieneFlow } from '../components/AquiVieneFlow/AquiVieneFlow';
import { XMarkIcon ,Bars3Icon } from '@heroicons/react/24/outline';
import MenuPrincipalMobile from './menuPrincipalMobile';
import { useDisclosure } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';

export default function MenuPrincipal() {
  const [isLoading, setIsLoading] = useState(true);
  const [burgerOpen, setBurgerOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const verifySession = async () => {
    await checkJWTSession();
  };

  const handleMenu = useCallback(()=>{
    setBurgerOpen(!burgerOpen)
  },[burgerOpen])

  useEffect(() => {
    verifySession();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <AquiVieneFlow />;
  }

  const pathname = usePathname();
  return (
    <ChakraProvider>
      <div className="flex h-20 shrink-0 items-end justify-between rounded-lg bg-blue-500 p-4 md:h-40">
        <AcmeLogo />
        <div className=" hidden min-[1100px]:flex flex-row">
          <Button className="mx-3 font-medium">DISCIPLINAS</Button>
          <Button className="mx-3 font-medium">INSTALACIONES</Button>
          <Button className="mx-3 font-medium">NOTICIAS</Button>
          <Button
            className={` mx-3 font-medium ${pathname === QUIENES_SOMOS_HREF ? 'bg-blue-400' : ''} font-bold`}
          >
            <Link href={QUIENES_SOMOS_HREF}>¿QUIENES SOMOS?</Link>
          </Button>
        </div>
        <div className=" hidden min-[1100px]:flex flex-row">
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
        <div className="min-[1100px]:hidden">
          {!isOpen ? 
            <Bars3Icon onClick={onOpen} className='cursor-pointer h-[40px] w-[40px] text-white'/>
            :
            <XMarkIcon className='cursor-pointer h-[40px] w-[40px] text-white'/>
          }
        </div>
      </div>
      <MenuPrincipalMobile isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <ul>
          <li className='my-6'><Button className="mx-3 font-semibold text-xl">DISCIPLINAS</Button></li>
          <li className='my-6'><Button className="mx-3 font-semibold text-xl">INSTALACIONES</Button></li>
          <li className='my-6'> 
            <Button className={` mx-3 font-semibold text-xl ${pathname === QUIENES_SOMOS_HREF ? 'bg-blue-400 font-bold ' : ''} `}>
              <Link href={QUIENES_SOMOS_HREF}>¿QUIENES SOMOS?</Link>
            </Button>
          </li>
          <li className='my-6'> 
            <Button className={`mx-3 font-semibold text-xl ${pathname === LOGIN_HREF ? 'bg-blue-400 font-bold ' : ''}`}>
              <Link href={LOGIN_HREF}>INICIAR SESIÓN</Link>
            </Button>
          </li>
          <li className='my-6'> 
            <Button className={` mx-3 font-semibold text-xl ${pathname === SING_UP_HREF ? 'bg-blue-400 font-bold ' : ''}`}>
              <Link href={SING_UP_HREF}>REGISTRARME</Link>
            </Button>
          </li>
        </ul>
      </MenuPrincipalMobile>
    </ChakraProvider>
  );
}
