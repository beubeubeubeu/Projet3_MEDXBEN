import { useState } from 'react';
import { ethers } from 'ethers';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { useReadContract } from 'wagmi';



function AddProposal({ contractAddress, contractAbi, voterAddress }) {
  const [proposalDescription, setProposalDescription] = useState(''); 
  const { data: getVoterData, error: getVoterError, isPending: getVoterIsPending } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getVoter',
    args: [voterAddress]
  });

  const handleProposalSubmission = async () => {
    if (!proposalDescription.trim()) return;

    try {
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      const transaction = await contract.AddProposal(proposalDescription);
      console.log('Submitting proposal:', proposalDescription);
      await transaction.wait();
      console.log("Proposition submitted");
    } catch (error) {
      console.error("Something wrong:", error);
    }
  };

  if (getVoterIsPending) {
    return <Text>Loading...</Text>;
  }
  if (getVoterError) {
    return <Text>Error: {getVoterError.message}</Text>;
  }
  if (!getVoterData || !getVoterData.isRegistered) {
    return <Text>You're not a voter</Text>;
  }

  return (
    <Box>
      <Text>Add proposal</Text>
      <Input
        placeholder='Description'
        value={proposalDescription}
        onChange={(e) => setProposalDescription(e.target.value)}
      />
      <Button 
        colorScheme='teal' 
        size='sm'
        onClick={handleProposalSubmission}
      >Add my proposal
      </Button>
    </Box>
  );
}

export default AddProposal; 