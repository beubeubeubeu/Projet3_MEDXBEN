'use client';

import { useState } from 'react';
import { Box, Button, Input, Text, useToast, Flex, Tag, Divider, AbsoluteCenter } from '@chakra-ui/react';
import { useAccount, useWriteContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';

function AddProposal() {
  const [proposalDescription, setProposalDescription] = useState('');
  const toast = useToast();

  // Écrire une nouvelle proposition
  const { writeContract: addProposal, isLoading: isProposalAdding, error: proposalAddError } = useWriteContract({
    mutation: {
      onSuccess(data) {
        toast({
          title: "Proposal added successfully.",
          description: `Transaction hash: ${data.hash}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setProposalDescription('');
      },
      onError(error) {
        toast({
          title: "Failed to add proposal.",
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      },
    }
  });

  const handleProposalSubmission = () => {
    if (!proposalDescription.trim()) {
      toast({
        title: 'Description cannot be empty.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    addProposal({
      address: contractAddress,
      abi: contractAbi,
      functionName: "AddProposal",
      args: [proposalDescription]
    });
  };

  return (
    <Box>

      <Tag>Add a new proposal</Tag>
      <Flex>
        <Input
          placeholder="Describe your proposal"
          value={proposalDescription}
          onChange={(e) => setProposalDescription(e.target.value)}
          mb="4"
        />
        <Button
          onClick={handleProposalSubmission}
          isLoading={isProposalAdding}
        >
          Add Proposal
        </Button>
        {proposalAddError && <Text color="red.500">Error: {proposalAddError.message}</Text>}
      </Flex>

    </Box>

  );
}

export default AddProposal;
