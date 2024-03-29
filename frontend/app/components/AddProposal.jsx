'use client';

import { useState } from 'react';
import { Box, Button, Input, Text, useToast, Flex, Tag } from '@chakra-ui/react';
import { useWriteContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';

function AddProposal({address, onSuccessAddProposal}) {

  const [proposalDescription, setProposalDescription] = useState('');

  const toast = useToast();

  // Écrire une nouvelle proposition
  const { writeContract: addProposal, isLoading: isProposalAdding } = useWriteContract({
    mutation: {
      onSuccess() {
        toast({
          title: "Proposal added successfully.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setProposalDescription('');
        onSuccessAddProposal();
      },
      onError(error) {
        toast({
          title: "Failed to add proposal.",
          description: error.shortMessage,
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
      account: address,
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
      </Flex>
    </Box>
  );
}

export default AddProposal;
