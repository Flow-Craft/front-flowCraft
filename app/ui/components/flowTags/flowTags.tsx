import React from 'react';
import { Tag } from '@chakra-ui/react';

export const FlowTags = ({ title, description }: any) => {
  return (
    <>
      <Tag size="lg" colorScheme="red" borderRadius="full">
        <div className="p-2 flex flex-col text-center">
          <span className="p-2 font-bold text-xl">{title}</span>
          <span className="p-2">{description}</span>
        </div>
      </Tag>
    </>
  );
};
