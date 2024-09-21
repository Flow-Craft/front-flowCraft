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
  scrollBehavior = 'inside',
  disabled = false,
  type = 'button',
}: any) => {
  const onSubmitForm = (e: any) => {
    e.preventDefault();
    onAcceptModal(e);
  };
  return (
    <div className="overflow-x-hidden">
      <Modal
        isOpen={isOpen}
        onClose={onCancelModal}
        size={size}
        scrollBehavior={scrollBehavior}
        isCentered
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={type === 'submit' ? onSubmitForm : undefined}>
            <ModalBody>{modalBody}</ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                isDisabled={disabled}
                mr={3}
                type={type}
                onClick={type === 'submit' ? undefined : onAcceptModal}
              >
                {primaryTextButton}
              </Button>
              {secondaryTextButton && (
                <Button variant="ghost" onClick={onCancelModal}>
                  {secondaryTextButton}
                </Button>
              )}
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};
