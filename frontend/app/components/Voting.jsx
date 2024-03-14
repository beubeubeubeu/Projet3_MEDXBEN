'use client'

import { Box, useToast } from '@chakra-ui/react'

import { contractAddress, contractAbi } from '@/constants'

import { useReadContract, useAccount, useWriteContract } from 'wagmi'

import { publicClient } from '@/network/client'

import { useState, useEffect } from 'react'
import { parseAbiItem } from 'viem'

import WorkflowStatus from './WorkflowStatus'
import NextPhaseButton from './NextPhaseButton'
import AddVoter from './AddVoter'
import AddProposal from './AddProposal'
import WinningProposal from './WinningProposal'
import Events from './Events'
// import { getEventParameters } from 'viem/_types/actions/getContract'
// import { getEventSelector } from 'viem'


const Voting = () => {
    const { address, isConnected } = useAccount();
    const [events, setEvents] = useState([])
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
    // Get addvoter
    const { refetch: refetchAddVoter } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'AddVoter',
        account: address
    })

    const getEvents = async () => {
        const AddVoterEvents = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem('event VoterRegistered(address voterAddress)'),
            // du premier bloc
            fromBlock: 0n,
            // jusqu'au dernier
            toBlock: 'latest' // Pas besoin valeur par défaut
        })
        console.log("AddVoterEvents", AddVoterEvents);

        // const WorkflowStatusChangeEvent = await publicClient.getLogs({
        //     address: contractAddress,
        //     event: parseAbiItem('event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus)'),
        //     // du premier bloc
        //     fromBlock: 0n,
        //     // jusqu'au dernier
        //     toBlock: 'latest' // Pas besoin valeur par défaut
        // })

        const ProposalRegisteredEvent = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem('event ProposalRegistered(uint256 proposalId)'),
            // du premier bloc
            fromBlock: 0n,
            // jusqu'au dernier
            toBlock: 'latest' // Pas besoin valeur par défaut
            
        })
        console.log("ProposalRegisteredEvent", ProposalRegisteredEvent);

        const VotedEvent = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem('event Voted(address voter, uint256 proposalId)'),
            // du premier bloc
            fromBlock: 0n,
            // jusqu'au dernier
            toBlock: 'latest' // Pas besoin valeur par défaut
        })
        console.log("VotedEvent", VotedEvent);

        // ...WorkflowStatusChangeEvent,
        const combinedEvents = [...AddVoterEvents, ...ProposalRegisteredEvent, ...VotedEvent].map(event => {
            let eventData = {
                type: 'Unknown', // Type par défaut, sera écrasé selon le cas
                blockNumber: Number(event.blockNumber),
            };
        
            switch (event.eventName) { 
                case 'VoterRegistered':
                    eventData.type = 'AddVoter';
                    // eventData.description = "Voter Registered";
                    if (event.args.voterAddress) {
                        const address = event.args.voterAddress;
                        eventData.address = `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
                    }
                    break;
                case 'WorkflowStatusChange':
                    eventData.type = 'StatusChange';
                    eventData.previousStatus = event.args.previousStatus; 
                    eventData.newStatus = event.args.newStatus; 
                    eventData.description = `Status changed from ${eventData.previousStatus} to ${eventData.newStatus}`;
                    break;
                case 'ProposalRegistered':
                    eventData.type = 'AddProposal';
                    eventData.proposalId = event.args.proposalId; 
                    eventData.description = `Proposal ID: ${eventData.proposalId} registered`;
                    break;
                case 'Voted':
                    eventData.type = 'Vote';
                    eventData.voter = event.args.voter; 
                    eventData.proposalId = event.args.proposalId; 
                    eventData.description = `Voter ${eventData.voter} voted for proposal ${eventData.proposalId}`;
                    break;
                
            }
        
            return eventData;
        });
        




        // const combinedEvents = AddVoterEvents.map((event) => ({
        //     type: 'AddVoter',
        //     address: event.args.account,
        //     // amount: event.args.amount,
        //     blockNumber: Number(event.blockNumber)
        // })).concat(ProposalRegisteredEvent.map((event) => ({
        //     type: 'AddProposal',
        //     address: event.args.account,
        //     // amount: event.args.amount,
        //     blockNumber: Number(event.blockNumber)
        // })))

        // sort by value
        combinedEvents.sort(function (a, b) {
            return b.blockNumber - a.blockNumber;
        });

        setEvents(combinedEvents)
    }



    useEffect(() => {
    const getAllEvents = async () => {
        if (address !== 'undefined') {
            await getEvents();
        }
    }
    getAllEvents();
    }, [address])

    return (
    <Box
        direction="column"
        width="100%"
    >
        <WinningProposal workflowStatus={getWorkflowStatus || 0} winningProposalID={getWinningProposalID || 0} />
        <br />
        <br />
        <WorkflowStatus pending={getWorkflowStatusIsPending} workflowStatus={getWorkflowStatus || 0} />
        <br />
        <NextPhaseButton pending={getWorkflowStatusIsPending} workflowStatus={getWorkflowStatus || 0} onSuccessfulNextPhase={refetchWorkflowStatus} />
        <br />
        <br />
        <AddVoter refetch={refetchAddVoter} getEvents={getEvents} />
        <br />
        <hr />
        <br />
        <br />
        <AddProposal contractAddress={contractAddress} contractAbi={contractAbi} voterAddress={address} />
        <br />
        <hr />
        <br />
        <br />
        <Events events={events} />
    </Box>
)
}

export default Voting