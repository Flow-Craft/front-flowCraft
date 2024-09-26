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
import { useRef, useEffect, useState } from 'react';
import FlowCraftAPI from '../../utils/request';
import { AUTORIZATION_KEY } from '@/app/utils/const';

export default function Page() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  const [RestaurarFile, setRestaurarFile] = useState(false);
  const [GenerarFile, setGenerarFile] = useState(false);

  const checkData = async (fileName: string) => {
    const res = await FlowCraftAPI.get(
      `Backup/VerificarArchivo?fileName=${fileName}`,
    );
    const data = res as { existe: boolean };
    return data.existe;
  };
  useEffect(() => {
    const filesExist = async () => {
      const generarExist = await checkData('GENERAR_BACKUP.pdf');
      const restaurarExist = await checkData('RESTAURAR_BACKUP.pdf');
      setGenerarFile(generarExist);
      setRestaurarFile(restaurarExist);
    };
    filesExist();
  }, []);

  const token = window.localStorage.getItem(AUTORIZATION_KEY)
  const downloadFile = async (fileName: string) => {
    try {
      const res = await fetch(
        `http://localhost:5148/api/backup/DescargarBackup?fileName=${fileName}`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      

      console.log('Respuesta de la solicitud:', res);

      if (!res) {
        throw new Error('La respuesta es null o undefined.');
      }

      const blob = await res.blob();

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // Nombre del archivo para la descarga
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Error durante la descarga del archivo:', error);
      toast({
        title: 'Error',
        description: 'No se pudo descargar el archivo.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

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
            position: 'top',
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
            position: 'top',
          });
          return;
        }
        if (file.name == 'GENERAR_BACKUP.pdf') {
          setGenerarFile(true);
        } else {
          setRestaurarFile(true);
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
          const res = await fetch(
            'http://localhost:5148/api/backup/subirbackup',
            {
              method: 'POST',
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
              },
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
            position: 'top',
          });
        } catch (error) {
          console.error('Error al subir el archivo:', error);
        }
      }
    };
  return (
    <Box minH="100vh" bg="white">
      <Flex>
        <Box as="main" flex="1" p={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Backup del sistema</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text>LINK A LA GUIA PARA GENERAR BACKUP DEL SISTEMA</Text>
                  {GenerarFile ? (
                    <>
                      <div className="flex gap-2 ">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile('GENERAR_BACKUP.pdf')}
                        >
                          DESCARGAR GENERAR.pdf
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleButtonClick}
                        >
                          ACTUALIZAR
                        </Button>
                        <Input
                          display="none"
                          type="file"
                          accept="application/pdf"
                          ref={inputRef}
                          onChange={handleFileChange('GENERAR_BACKUP.pdf')}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleButtonClick}
                      >
                        GENERAR BACKUP.PDF
                      </Button>
                      <Input
                        display="none"
                        type="file"
                        accept="application/pdf"
                        ref={inputRef}
                        onChange={handleFileChange('GENERAR_BACKUP.pdf')}
                      />
                    </>
                  )}
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text>
                    LINK A LA GUIA PARA RESTAURAR UN BACKUP EN EL SISTEMA
                  </Text>
                  {RestaurarFile ? (
                    <>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile('RESTAURAR_BACKUP.pdf')}
                        >
                          DESCARGAR RESTAURAR.pdf
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleButtonClick2}
                        >
                          ACTUALIZAR
                        </Button>
                        <Input
                          display="none"
                          type="file"
                          accept="application/pdf"
                          ref={inputRef2}
                          onChange={handleFileChange('RESTAURAR_BACKUP.pdf')}
                        />
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </Flex>
                <Flex justify="flex-end" mt={4}>
                  {/* <Button
                    bg="blue.500"
                    color="white"
                    _hover={{ bg: 'blue.700' }}
                    onClick={checkData}
                  >
                    Editar
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
