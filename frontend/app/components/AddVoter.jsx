import React from 'react'

import { useState } from 'react'

import { Box, Button, Flex, Input, Text, useToast } from '@chakra-ui/react'

import { useWriteContract } from 'wagmi'

import { contractAddress, contractAbi } from '@/constants'

const AddVoter = () => {

  const [voterAddress, setVoterAddress] = useState('');

  const toast = useToast();

  // Add voter hook
  const { error: addVotererror, isPending: addVoterIsPending, writeContract: addVoterCall } = useWriteContract({
    mutation: {
        onSuccess: () => {
            toast({
                title: 'Voter has been added',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        },
        onError: (error) => {
            toast({
                title: addVotererror.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        },
    },
  });

  // Add voter call
  const addVoter = async() => {
      addVoterCall({
          address: contractAddress,
          abi: contractAbi,
          functionName: 'AddVoter',
          args: [voterAddress],
      })
  }

  return (
    <Box>
      <Text fontSize="xl" mb="4">Add a new voter</Text>
      <Flex>
        <Input placeholder='New voter address' onChange={(e) => setVoterAddress(e.target.value)} />
        <Button disabled={addVoterIsPending} onClick={addVoter}>{addVoterIsPending ? 'Confirming...' : 'Add voter'} </Button>
      </Flex>
    </Box>
  )
}

export default AddVoter
