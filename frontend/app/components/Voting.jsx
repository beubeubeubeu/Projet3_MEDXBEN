'use client'

import { Box, useToast } from '@chakra-ui/react'

import { contractAddress, contractAbi } from '@/constants'

import { useReadContract, useAccount, useWriteContract } from 'wagmi'

import WorkflowStatus from './WorkflowStatus'
import NextPhaseButton from './NextPhaseButton'
import AddVoter from './AddVoter'
import AddProposal from './AddProposal'

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
    const { data: getWorkflowStatusData, isPending: getWorkflowStatusIsPending, refetch: refetchWorkflowStatus } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'workflowStatus',
        account: address
    })

    return (
        <Box
            direction="column"
            width="100%"
        >
            <WorkflowStatus pending={getWorkflowStatusIsPending} workflowStatus={getWorkflowStatusData || 0}/>
            <NextPhaseButton workflowStatus={getWorkflowStatusData || 0} onSuccessfulNextPhase={refetchWorkflowStatus} />
            <AddVoter />
            <AddProposal contractAddress={contractAddress} contractAbi={contractAbi} voterAddress={address} />
        </Box>
    )
}

export default Voting