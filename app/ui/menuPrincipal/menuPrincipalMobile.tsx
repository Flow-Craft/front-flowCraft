'use client';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import React from 'react';
export default function MenuPrincipalMobile({
  isOpen,
  onClose,
  children,
}: any) {
  return (
    <>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size={'full'}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>FlowCraft</DrawerHeader>

          <DrawerBody className="bg-blue-500 text-white ">
            {children}
          </DrawerBody>

          <DrawerFooter className="bg-blue-500 text-white">
            Power by group 6
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
