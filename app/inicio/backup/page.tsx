'use client';
import { Flex, Text, Button, Input, useToast, Tooltip } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { AUTORIZATION_KEY } from '@/app/utils/const';
import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import { obtenerBackups, subirBackups } from '@/app/utils/actions';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/app/utils/functions';

const HEADER_TABLE = [
  { name: 'Fecha' },
  { name: 'Versión' },
  { name: 'Acciones' },
];

export default function Page() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);
  const [backups, setBackups] = useState([]);
  const [recuperacion, setRecuperacion] = useState([]);
  const toast = useToast();

  const token = window.localStorage.getItem(AUTORIZATION_KEY);

  const openPdfInNewTab = (base64Pdf: any) => {
    // Convertir el base64 a un Blob
    const byteCharacters = atob(base64Pdf); // Decodifica el string base64
    const byteNumbers = Array.from(byteCharacters, (char) =>
      char.charCodeAt(0),
    ); // Convierte cada carácter a su código ASCII
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Crear un URL temporal para el Blob
    const url = URL.createObjectURL(blob);

    // Abrir el PDF en una nueva pestaña
    window.open(url, '_blank');

    // Liberar el URL temporal después
    URL.revokeObjectURL(url);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };
  const handleButtonClick2 = () => {
    inputRef2.current?.click();
  };

  const getBackups = async () => {
    const res: any = await obtenerBackups();
    const backups = res.filter((back: any) => back.tipo === 'Backup');
    const backs = backups.map((back: any) => {
      return {
        id: back.id,
        fechaCreacion: formatDate(back.fechaCreacion),
        version: back.version,
        acciones: ActionTab(backups.find((disc: any) => disc.id === back.id)),
      };
    });
    setBackups(backs);
    const recu = res.filter((back: any) => back.tipo === 'Recuperacion');
    const recus = recu.map((back: any) => {
      return {
        id: back.id,
        fechaCreacion: formatDate(back.fechaCreacion),
        version: back.version,
        acciones: ActionTab(recu.find((disc: any) => disc.id === back.id)),
      };
    });
    setRecuperacion(recus);
    console.log('res', res);
  };

  const ActionTab = (backup: any) => {
    return (
      <div className="flex flex-row gap-4">
        <Tooltip label="Descargar">
          <ArrowDownTrayIcon
            onClick={() => {
              
              console.log('backup', backup)
              openPdfInNewTab(backup.pdf);
              console.log('backup', backup);
            }}
            className="w-[50px] cursor-pointer text-slate-500"
          />
        </Tooltip>
      </div>
    );
  };

  const handleFileChange =
    (expectedFileName: string) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileToSend = event.target.files?.[0];
      if (fileToSend) {
        if (fileToSend.type !== 'application/pdf') {
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

        console.log('fileToSend', fileToSend.size);

        if (fileToSend.name !== expectedFileName) {
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

        if (fileToSend.size > 1 * 1024 * 1024) {
          toast({
            title: 'Error',
            description: `El archivo debe pesar menos de 1MB.`,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
          return;
        }

        const formData = new FormData();
        formData.append('file', fileToSend);

        try {
          await fetch(
            `http://localhost:5148/api/Backup/SubirBackup?tipo=${expectedFileName === 'GENERAR_BACKUP.pdf' ? 'Backup' : 'Recuperacion'}`,
            {
              method: 'POST',
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          getBackups();
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

  useEffect(() => {
    getBackups();
  }, []);
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
            <FlowTable Header={HEADER_TABLE} dataToShow={recuperacion} />
            
          </section>
          <section>
            <div className="mt-6 self-start px-9 pb-9 text-2xl font-bold">
              Guía generar backup del sistema
            </div>
            <FlowTable Header={HEADER_TABLE} dataToShow={backups} />
          </section>
        </section>
      </section>
    </>
  );
}
