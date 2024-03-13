'use client'

import { Box, useToast } from '@chakra-ui/react'

import { contractAddress, contractAbi } from '@/constants'

import { useReadContract, useAccount, useWriteContract } from 'wagmi'

import WorkflowStatus from './WorkflowStatus'
import NextPhaseButton from './NextPhaseButton'
import AddVoter from './AddVoter'
import AddProposal from './AddProposal'
import WinningProposal from './WinningProposal'

const Voting = () => {

    const { address, isConnected } = useAccount();

    const toast = useToast();

    // Is owner
    // function isOwner() {
    //     if (!isConnected) {
    //         return false
    //     } else {
    //         const { data: ownerAddress } = useContractRead({
    //         address: contractAddress,
    //         abi: contractAbi,
    //         functionName: 'owner',
    //         })
    //         return ownerAddress === address;
    //     }
    // }

    // Get voter data (not implemented yet)
    // const { data: getVoterData, error: getVoterError, isPending: getVoterIsPending, refetch } = useReadContract({
    //     address: contractAddress,
    //     abi: contractAbi,
    //     functionName: 'getVoter',
    //     account: address,
    //     args: [voterAddress]
    // })

    // Get workflow status
    const { data: getWorkflowStatus, isPending: getWorkflowStatusIsPending, refetch: refetchWorkflowStatus } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'workflowStatus',
        account: address
    })

    // Get winning proposal ID
    const { data: getWinningProposalID, isPending: getWinningProposalIsPending, refetch: refetchWinningProposal } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'winningProposalID',
        account: address
    })

    return (
        <Box
            direction="column"
            width="100%"
        >
            <WinningProposal workflowStatus={getWorkflowStatus || 0} winningProposalID={getWinningProposalID || 0}/>
            <br />
            <br />
            <WorkflowStatus pending={getWorkflowStatusIsPending} workflowStatus={getWorkflowStatus || 0}/>
            <br />
            <NextPhaseButton pending={getWorkflowStatusIsPending} workflowStatus={getWorkflowStatus || 0} onSuccessfulNextPhase={refetchWorkflowStatus} />
            <br />
            <br />
            <AddVoter />
            <br />
            <hr />
            <br />
            <br />
            <AddProposal contractAddress={contractAddress} contractAbi={contractAbi} voterAddress={address} />
        </Box>
    )
}

export default Voting