import React, { useEffect, useState } from 'react'

import { Box, Badge, Text } from '@chakra-ui/react'

// import { contractAddress, contractAbi } from '@/constants'

// import { useReadContract } from 'wagmi'

const WinningProposal = ({workflowStatus, winningProposalID}) => {

  // Get winning proposal
  // Only works if workflowStatus current user is a voter
  // TODO
  // const { data: getWinningProposal, isPending: getWinningProposalIsPending, refetch: refetchWinningProposal } = useReadContract({
  //     address: contractAddress,
  //     abi: contractAbi,
  //     functionName: 'GetOneProposal',
  //     args: [winningProposalID]
  // })

  const [votesTallied, setvotesTallied] = useState(false);

  useEffect(() => {
    setvotesTallied(workflowStatus === 5)
  }, [workflowStatus])

  return (
    <Box>
      { !votesTallied ? (
          <Badge>No winning proposal</Badge>
        ) : (
          <Badge colorScheme={'green'}>Winning proposal ID is {winningProposalID}</Badge>
        )
      }
    </Box>
  )
}

export default WinningProposal
