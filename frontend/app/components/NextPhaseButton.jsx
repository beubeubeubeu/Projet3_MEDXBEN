import React from 'react'

import { Button, Spinner, useToast } from '@chakra-ui/react'

import { useWriteContract } from 'wagmi'

import { currentPhaseNextPhase, contractAbi, contractAddress } from '@/constants'

const NextPhaseButton = ({workflowStatus, onSuccessfulNextPhase, pending}) => {

  const toast = useToast();

  const { isPending: nextPhaseIsPending, writeContract: setNextPhase } = useWriteContract({
    mutation: {
      onSuccess: () => {
        onSuccessfulNextPhase();
        toast({
          title: currentPhaseNextPhase[workflowStatus].message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // setRefreshEvents(true);
      },
      onError: (error) => {
        toast({
          title: error.shortMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    },
  })

  const handleSetNextPhase = async() => {
    setNextPhase({
      address: contractAddress,
      abi: contractAbi,
      functionName: currentPhaseNextPhase[workflowStatus].function,
    })
  }

  return (
    <Button
      colorScheme='purple'
      size='lg'
      onClick={handleSetNextPhase}
      isDisabled={workflowStatus === 5}
    >
      { nextPhaseIsPending ? <Spinner /> : currentPhaseNextPhase[workflowStatus].btnText }
    </Button>
  )
}

export default NextPhaseButton
