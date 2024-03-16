import React, { useState } from 'react'

import { Button, Box, useToast, Spinner } from '@chakra-ui/react'

import { useWriteContract } from 'wagmi'

import { contractAddress, contractAbi } from '@/constants'

function VoteSelect({ options, address }) {

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
  const setVote = async() => {
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
      {options.map(option => (
        <Box
          as="button"
          key={option.id}
          type="button"
          display="block"
          w="full"
          textAlign="left"
          py={2}
          px={4}
          m={1}
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
      <Button {...selectedOption === null ? 'disabled' : ''} textAlign="left" mt={4} colorScheme="blue" onClick={setVote}>
        {setVoteIsPending ? <Spinner/> : 'Vote'}
      </Button>
    </Box>
  )
}

export default VoteSelect