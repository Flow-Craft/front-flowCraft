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
} from '@chakra-ui/react';
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputRef2 = useRef<HTMLInputElement | null>(null);

  //TODO arreglar la condicional
  const handleButtonClick = () => {
    inputRef.current?.click();
  };
  const handleButtonClick2 = () => {
    inputRef2.current?.click();
  };

  // Función para manejar el archivo subido
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:5148/api/backup/subirbackup', {
        method: 'POST',
        body: formData,
      });
      console.log(await res.json())
    }
  };

  const handleFileChange2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('http://localhost:5148/api/backup/subirbackup', {
        method: "POST",
        body: formData
      })
      console.log( await res.json())
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
                    onChange={handleFileChange}
                  />
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text>
                    LINK A LA GUIA PARA RESTAURAR UN BACKUP EN EL SISTEMA
                  </Text>
                  <Input
                    display="none"
                    type="file"
                    accept="application/pdf"
                    ref={inputRef2}
                    onChange={handleFileChange2}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleButtonClick2}
                  >
                    RESTAURAR BACKUP.PDF
                  </Button>
                </Flex>
                <Flex justify="flex-end" mt={4}>
                  <Button
                    bg="blue.500"
                    color="white"
                    _hover={{ bg: 'blue.700' }}
                  >
                    Guardar
                  </Button>
                </Flex>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
}
