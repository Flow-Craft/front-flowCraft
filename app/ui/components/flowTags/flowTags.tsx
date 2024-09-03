import React from 'react';
import { Tag } from '@chakra-ui/react';

export const FlowTags = ({ title, description }: any) => {
  return (
    <>
      <Tag size="lg" colorScheme="red" borderRadius="full">
        <div className="p-2">
          <span className="p-2 font-bold">{title}</span>
          {description}
        </div>
      </Tag>
    </>
  );
};
