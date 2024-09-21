'use client';
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { Bars3Icon } from '@heroicons/react/24/outline';
import UserName from './userName';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

export default function SideNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider>
      <div className="mix-w-full flex h-full w-full flex-col px-3 py-4 md:px-2">
        <div className="h-50 mb-2 flex w-full flex-row justify-between gap-2 rounded-md bg-blue-600 p-4 text-white md:h-60 md:flex-col">
          <Link href="/">
            <div className=" text-white md:w-40">
              <AcmeLogo />
            </div>
          </Link>
          <div className="hidden md:block">
            <UserName />
          </div>
          <div className="w-10 md:hidden">
            <Bars3Icon onClick={onOpen} />
          </div>
        </div>
        <div className=" hidden grow flex-row justify-between space-x-2 md:flex  md:flex-col md:space-x-0 md:space-y-2 md:overflow-y-scroll">
          <NavLinks />
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        </div>
      </div>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader className="bg-blue-500 text-white">
            <UserName />
          </DrawerHeader>
          <DrawerBody>
            <NavLinks onClose={onClose} />
          </DrawerBody>

          <DrawerFooter className="bg-blue-500 text-white">
            Power by group 6
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </ChakraProvider>
  );
}
