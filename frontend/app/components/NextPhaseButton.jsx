import React from 'react'

import { Button } from '@chakra-ui/react'

import { useWriteContract } from 'wagmi'

import { currentPhaseNextPhase, contractAbi, contractAddress } from '@/constants'

const NextPhaseButton = ({workflowStatus, onSuccessfulNextPhase}) => {

  const { data: setNextPhaseTxhash, error: setNextPhaseError, isPending: setNextPhaseIsPending, writeContract: setNextPhase } = useWriteContract({
    mutation: {
        onSuccess: () => {
            onSuccessfulNextPhase();
            toast({
                title: currentPhaseNextPhase[workflowStatus].message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        },
        onError: (error) => {
            toast({
                title: setNextPhaseError.message,
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
      colorScheme='teal'
      size='lg'
      onClick={handleSetNextPhase}
      isDisabled={workflowStatus === 5}
    >
      { currentPhaseNextPhase[workflowStatus].btnText }
    </Button>
  )
}

export default NextPhaseButton
