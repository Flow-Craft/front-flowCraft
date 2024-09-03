import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from '@chakra-ui/react';

export const FlowCard = ({
  maxW = 'sm',
  CardBodyContent,
  CardHeaderContent,
  CardFooterContent,
  divider = false,
}: any) => {
  return (
    <>
      <Card
        maxW={maxW}
        className="transform transition-transform hover:-translate-y-2 hover:shadow-lg"
      >
        {CardHeaderContent && <CardHeader>{CardHeaderContent}</CardHeader>}
        {CardBodyContent && <CardBody>{CardBodyContent}</CardBody>}
        {divider && <Divider />}
        {CardFooterContent && <CardFooter>{CardFooterContent}</CardFooter>}
      </Card>
    </>
  );
};
