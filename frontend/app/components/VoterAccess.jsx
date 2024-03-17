import { Box, Flex, Heading, VStack, Divider, Center, Text } from '@chakra-ui/react';
import React from 'react';

const VoterAccess = ({ proposals, submitVote, getWorkflowStatus, onSuccessfulNextPhase, address, voteOptions, setRefreshEvents, events  }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderColor="gray.50" bgColor="gray.50" borderRadius="lg">
      <Heading as="h3" size="lg">Votez pour une proposition</Heading>
      {/* Affichez les propositions ici et permettez aux utilisateurs de voter */}
      {/* {proposals.map((proposal, index) => (
        <Box key={index} my={2}>
          <Text>{proposal.description}</Text>
          <Button colorScheme="blue" onClick={() => submitVote(index)}>Voter</Button>
        </Box>
      ))} */}
      <Text>Vous etes un voter enregistrer </Text>
    </Box>
  );
};

export default VoterAccess;