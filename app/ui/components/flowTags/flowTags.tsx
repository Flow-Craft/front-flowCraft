import React from 'react';
import { Tag } from '@chakra-ui/react';

export const FlowTags = ({ title, description }: any) => {
  return (
    <>
      <Tag size="lg" colorScheme="red" borderRadius="full">
        <div className="flex flex-col p-2 text-center">
          <span className="p-2 text-xl font-bold">{title}</span>
          <span className="p-2">{description}</span>
        </div>
      </Tag>
    </>
  );
};
