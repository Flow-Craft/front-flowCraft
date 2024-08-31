import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from '@chakra-ui/react';

export const FlowModal = ({
  maxW = 'sm',
  CardBodyContent,
  CardHeaderContent,
  CardFooterContent,
  divider = true,
}: any) => {
  return (
    <>
      <Card maxW={maxW}>
        {CardHeaderContent && <CardHeader>{CardHeaderContent}</CardHeader>}
        <CardBody>{CardBodyContent}</CardBody>
        {divider && <Divider />}
        {CardFooterContent && <CardFooter>{CardFooterContent}</CardFooter>}
      </Card>
    </>
  );
};
