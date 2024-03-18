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
    Button,
    Flex
} from '@chakra-ui/react';

const getStatusDescription = (status) => {
    switch (status) {
        case 0:
            return 'RegisteringVoters';
        case 1:
            return 'ProposalsRegistrationStarted';
        case 2:
            return 'ProposalsRegistrationEnded';
        case 3:
            return 'VotingSessionStarted';
        case 4:
            return 'VotingSessionEnded';
        case 5:
            return 'VotesTallied';
        default:
            return 'UnknownStatus';
    }
};

const Events = ({ events }) => {
    return (
        <>
            <Flex justifyContent="center" alignItems="center" p="2rem">
                <Heading as='h2' size='xl' mt="1rem">
                    Events
                </Heading>
            </Flex>
            {
                events.length > 0 ? (
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Type</Th>
                                    <Th>Description</Th>
                                    <Th>Details</Th>
                                    <Th>Hash</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {events.map((event, index) => (
                                    <Tr key={index}>
                                        <Td>
                                            <Badge colorScheme={event.type === 'AddProposal' ? 'green' : event.type === 'Vote' ? 'blue' : event.type === 'AddVoter' ? 'blue' : event.type === 'StatusChange' ? 'purple' : 'red'}>
                                                {event.type}
                                            </Badge>
                                        </Td>
                                        <Td fontSize="xs" >
                                            {event.address ? `Address: ${event.address}` : ''}
                                            {event.proposalId ? ` Proposal ID: ${event.proposalId}` : ''}
                                            {event.newStatus !== undefined ? `New Status: ${getStatusDescription(event.newStatus)}` : ''}
                                        </Td>
                                        <Td fontSize="xs">{event.description}</Td>
                                        <Td><Button colorScheme='gray' size="xs">{event.hash ? `Hash: ${event.hash}` : ''}</Button></Td>

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
                )
            }
        </>
    );

};

export default Events;
