'use client';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { getQuienesSomosAction } from '../utils/actions';

export default function Page() {
  const [quierenSomos, setQuierenSomos] = useState<any>();
  const getQuienesSomos = useCallback(async () => {
    const result: any = await getQuienesSomosAction();
    setQuierenSomos(result);
  }, []);
  useEffect(() => {
    getQuienesSomos();
  }, []);
  return (
    <section className="">
      <Accordion defaultIndex={[0]} allowMultiple className="p-6">
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="center"
                className="py-5 text-lg font-bold text-blue-500"
              >
                {quierenSomos?.tituloQuienesSomos}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className="mx-3 my-3">
            {quierenSomos?.descripcionQuienesSomos}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
