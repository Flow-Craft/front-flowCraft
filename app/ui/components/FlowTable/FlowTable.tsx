import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';
export const FlowTable = ({
  TableCaption,
  Header = [],
  dataToShow = [],
  Footer = null,
}: any) => {
  return (
    <TableContainer>
      <Table variant="simple">
        {TableCaption && <TableCaption>{TableCaption}</TableCaption>}
        <Thead>
          <Tr>
            {Header.map((head: any) => {
              return <Td key={head.name}>{head.name}</Td>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {dataToShow.map((data: any) => {
            return (
              <Tr key={data.id}>
                {Object.keys(data).map((key) => {
                  if (key === 'id') {
                    return null;
                  }
                  return <Td key={key}>{data[key]}</Td>;
                })}
              </Tr>
            );
          })}
        </Tbody>
        {Footer && <Tfoot>{Footer}</Tfoot>}
      </Table>
    </TableContainer>
  );
};
