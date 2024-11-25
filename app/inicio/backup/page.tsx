'use client';
import { Flex, Text, Button, Input, useToast } from '@chakra-ui/react';
import { useRef } from 'react';
import { AUTORIZATION_KEY } from '@/app/utils/const';
import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';

const HEADER_TABLE = [
  { name: 'Fecha' },
  { name: 'Versión' },
  { name: 'Acciones' },
];

export default function Page() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  const token = window.localStorage.getItem(AUTORIZATION_KEY);
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
      toast({
        title: 'Éxito',
        description: `El archivo se ha descargado correctamente.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
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
    <>
      <section>
        <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
          Backup del sistema
        </div>
        <section>
          <Flex justify="space-between" align="center">
            <Text>LINK A LA GUÍA PARA GENERAR BACKUP DEL SISTEMA</Text>
            <div className="flex gap-2 ">
              <Button
                variant="outline"
                size="sm"
                textColor={'white'}
                bg={'blue.300'}
                _hover={{
                  bg: 'blue.400',
                }}
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
          </Flex>
          <Flex justify="space-between" align="center">
            <Text>LINK A LA GUÍA PARA RESTAURAR UN BACKUP EN EL SISTEMA</Text>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                textColor={'white'}
                bg={'blue.300'}
                _hover={{
                  bg: 'blue.400',
                }}
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
          </Flex>
        </section>
        <section>
          <section>
            <div className="mt-6 self-start px-9 pb-9 text-2xl font-bold">
              Guía restauración del sistema
            </div>
            <FlowTable Header={HEADER_TABLE} dataToShow={[]} />
          </section>
          <section>
            <div className="mt-6 self-start px-9 pb-9 text-2xl font-bold">
              Guía generar backup del sistema
            </div>
            <FlowTable Header={HEADER_TABLE} dataToShow={[]} />
          </section>
        </section>
      </section>
    </>
  );
}
