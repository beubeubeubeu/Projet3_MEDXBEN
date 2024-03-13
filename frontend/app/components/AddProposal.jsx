import { useState } from 'react';
import { Box, Button, Input, Text, useToast, Flex } from '@chakra-ui/react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';

function AddProposal() {
  const [proposalDescription, setProposalDescription] = useState('');
  const { address, isConnected } = useAccount();
  const toast = useToast();


  // Lire les données du votant pour vérifier s'il est enregistré
  const { data: voterData, isFetching: isVoterFetching, isError: isVoterError } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'GetVoter',
    args: [address],
  });

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

  // if (!isConnected) {
  //   return <Text>Please connect your wallet.</Text>;
  // }

  // if (isVoterFetching) {
  //   return <Text>Loading voter data...</Text>;
  // }

  // if (isVoterError || !voterData?.isRegistered) {
  //   return <Text>You're not a registered voter.</Text>;
  // }

  return (
    <Box>
      <Text fontSize="xl" mb="4">Add a new proposal</Text>
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
        { proposalAddError && <Text color="red.500">Error: {proposalAddError.message}</Text> }
      </Flex>
    </Box>
  );
}

export default AddProposal;
