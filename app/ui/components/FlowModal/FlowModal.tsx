import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

export const FlowModal = ({
  title,
  modalBody,
  isOpen,
  onAcceptModal,
  onCancelModal,
  primaryTextButton = 'Aceptar',
  secondaryTextButton = 'Cancelar',
  size = 'xl',
}: any) => {
  return (
    <>
      <Modal
        blockScrollOnMount={true}
        isOpen={isOpen}
        onClose={onCancelModal}
        size={size}
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalBody}</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onAcceptModal}>
              {primaryTextButton}
            </Button>
            {secondaryTextButton && (
              <Button variant="ghost" onClick={onCancelModal}>
                {secondaryTextButton}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};