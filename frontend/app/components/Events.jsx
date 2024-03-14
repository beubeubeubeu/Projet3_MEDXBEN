import React from 'react';
import {
  Alert,
  AlertIcon,
  Badge,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

const Events = ({ events }) => {
  return (
    <>
      <Heading as='h2' size='xl' mt="2rem" mb='1rem'>
        Events
      </Heading>
      {events.length > 0 ? (
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>Description</Th>
                <Th>Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.map((event, index) => (
                <Tr key={index}> {crypto.randomUUID()}
                  <Td>
                    <Badge colorScheme={event.type === 'AddProposal' ? 'green' : event.type === 'Vote' ? 'blue' : event.type === 'AddVoter' ? 'blue' :'red'}>
                      {event.type}
                    </Badge>
                  </Td>
                  <Td>
                    {event.address ? `Address: ${event.address}` : ''}
                    {event.proposalId ? `, Proposal ID: ${event.proposalId}` : ''}
                    {event.previousStatus || event.newStatus ? `, Status Change: ${event.previousStatus} to ${event.newStatus}` : ''}
                  </Td>
                  <Td>{event.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Alert status='info'>
          <AlertIcon />
          No events found.
        </Alert>
      )}
    </>
  );
};

export default Events;

