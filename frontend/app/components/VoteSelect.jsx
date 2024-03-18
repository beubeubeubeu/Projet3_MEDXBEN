import React, { useState } from 'react'

import { Button, Box, useToast, Spinner, Tag } from '@chakra-ui/react'

import { useWriteContract } from 'wagmi'

import { contractAddress, contractAbi } from '@/constants'

function VoteSelect({ options = [], address, refreshEvents }) {

  const [selectedOption, setSelectedOption] = useState(null);

  const toast = useToast();

  const handleOptionClick = (id) => {
    setSelectedOption(id);
  };

  const { isPending: setVoteIsPending, writeContract: setVoteCall } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Vote recorded 🗳️',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        refreshEvents();
      },
      onError: (error) => {
        toast({
          title: error.shortMessage,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    },
  });

  // Set vote call
  const setVote = async () => {
    setVoteCall({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'SetVote',
      account: address,
      args: [selectedOption],
    })
  }

  return (
    <Box>
      <Tag>Time to vote</Tag>
      {options.map(option => (
        <Box
          as="button"
          key={option.id} // génere 9 erreurs, j'ai essayer avec {index} et {crypto.randomUUID()} mais ca change rien
          type="button"
          display="block"
          w="full"
          textAlign="left"
          py={2}
          px={4}
          mb={1}
          mt={1}
          borderRadius="5px"
          borderWidth="1px"
          borderColor="gray.200"
          backgroundColor={selectedOption === option.id ? 'blue.500' : 'white'}
          color={selectedOption === option.id ? 'white' : 'black'}
          _hover={{
            bg: selectedOption === option.id ? 'blue.600' : 'gray.100',
          }}
          onClick={() => handleOptionClick(option.id)}
        >
          {option.description}
          <input type="hidden" />
        </Box>
      ))}
      <Button mb={5} {...selectedOption === null ? 'disabled' : ''} textAlign="left" mt={4} colorScheme="blue" onClick={setVote}>
        {setVoteIsPending ? <Spinner/> : 'Vote'}
      </Button>
    </Box>
  )
}

export default VoteSelect