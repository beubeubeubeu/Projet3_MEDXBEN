import React, { useEffect, useState } from 'react'

import { Box, Badge, Spinner } from '@chakra-ui/react'

import { useReadContract } from 'wagmi'

import { contractAddress, contractAbi } from '@/constants';

const WinningProposal = ({isVoter, workflowStatus, address}) => {

  const [votesTallied, setvotesTallied] = useState(false);

  useEffect(() => {
    setvotesTallied(workflowStatus === 5)
    refetchProposal()
  }, [workflowStatus])

  const { data: getWinningProposalID, isLoading: isLoadingWinningProposalID  }  = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'winningProposalID',
    account: address,
    watch: true
  })

  const { data: winningProposal, refetch: refetchProposal } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'GetOneProposal',
    account: address,
    args: [getWinningProposalID]
  })

  if (!votesTallied) {
    return (
      <Box>
        <Badge>No winning proposal yet</Badge>
      </Box>
    )
  } else if (votesTallied && isVoter) {
    return (
      <Box>
        {(winningProposal === undefined) ? (<Spinner />) :
          <Badge colorScheme={'green'}>Winning proposal ID is {getWinningProposalID.toString()}, winning proposal vote count is {winningProposal.voteCount.toString()}, and its description is: {winningProposal.description}</Badge>
        }
      </Box>
    )
  } else {
    return (
      <Box>
      {(isLoadingWinningProposalID) ? (<Spinner />) :
        <Badge colorScheme={'green'}>Winning proposal ID is {getWinningProposalID.toString()}</Badge>
      }
      </Box>
    )
  }
}

export default WinningProposal
