'use client';
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  Heading,
  VStack,
  HStack,
  Spacer,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useToast,
} from '@chakra-ui/react';
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  const handleButtonClick = () => {
    inputRef.current?.click();
  };
  const handleButtonClick2 = () => {
    inputRef2.current?.click();
  };

  const handleFileChange =
    (expectedFileName: string) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.type !== 'application/pdf') {
          toast({
            title: 'Error',
            description: 'El archivo debe ser un PDF.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        if (file.name !== expectedFileName) {
          toast({
            title: 'Error',
            description: `El archivo debe llamarse "${expectedFileName}".`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
          const res = await fetch(
            'http://localhost:5148/api/backup/subirbackup',
            {
              method: 'POST',
              body: formData,
            },
          );
          const result = await res.json();
          console.log(result);
          toast({
            title: 'Éxito',
            description: `El archivo "${expectedFileName}" se ha subido correctamente.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } catch (error) {
          console.error('Error al subir el archivo:', error);
        }
      }
    };
  return (
    <Box minH="100vh" bg="white">
      <Flex>
        {/* Barra lateral */}

        {/* Contenido principal */}
        <Box as="main" flex="1" p={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Backup del sistema</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text>LINK A LA GUIA PARA GENERAR BACKUP DEL SISTEMA</Text>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleButtonClick}
                  >
                    GENERAR BACKUP.PDF
                  </Button>
                  {/* Input de archivo oculto */}
                  <Input
                    display="none"
                    type="file"
                    accept="application/pdf"
                    ref={inputRef}
                    onChange={handleFileChange('GENERAR_BACKUP.pdf')}
                  />
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text>
                    LINK A LA GUIA PARA RESTAURAR UN BACKUP EN EL SISTEMA
                  </Text>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleButtonClick2}
                  >
                    RESTAURAR BACKUP.PDF
                  </Button>
                  <Input
                    display="none"
                    type="file"
                    accept="application/pdf"
                    ref={inputRef2}
                    onChange={handleFileChange('RESTAURAR_BACKUP.pdf')}
                  />
                </Flex>
                <Flex justify="flex-end" mt={4}>
                  {/* <Button
                    bg="blue.500"
                    color="white"
                    _hover={{ bg: 'blue.700' }}
                  >
                    Guardar
                  </Button> */}
                </Flex>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
}
