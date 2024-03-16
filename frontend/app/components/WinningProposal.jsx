import React, { useEffect, useState } from 'react'

import { Box, Badge, Spinner } from '@chakra-ui/react'

import { useReadContract } from 'wagmi'

import { contractAddress, contractAbi } from '@/constants';

const WinningProposal = ({workflowStatus, address}) => {

  const [votesTallied, setvotesTallied] = useState(false);

  useEffect(() => {
    setvotesTallied(workflowStatus === 5)
    refetchProposal()
  }, [workflowStatus])

  const { data: getWinningProposalID, refetch: refetchWinningProposalId }  = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'winningProposalID',
    account: address,
    watch: true
  })

  const { data: winningProposal, refetch: refetchProposal }  = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'GetOneProposal',
    account: address,
    watch: true,
    args: [getWinningProposalID]
  })

  return (
    <Box>
      { !votesTallied ? (
          <Badge>No winning proposal yet</Badge>
        ) : winningProposal === undefined ? (<Spinner />) :
        (
          <Badge colorScheme={'green'}>Winning proposal ID is {getWinningProposalID.toString()}, winning proposal vote count is {winningProposal.voteCount.toString()}, and its description is: {winningProposal.description}</Badge>
        )
      }
    </Box>
  )
}

export default WinningProposal
