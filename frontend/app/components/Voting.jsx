
//     // Is owner
//     // function isOwner() {
//     //     if (!isConnected) {
//     //         return false
//     //     } else {
//     //         const { data: ownerAddress } = useContractRead({
//     //         address: contractAddress,
//     //         abi: contractAbi,
//     //         functionName: 'owner',
//     //         })
//     //         return ownerAddress === address;
//     //     }
//     // }

//     // Get voter data (not implemented yet)
//     // const { data: getVoterData, error: getVoterError, isPending: getVoterIsPending, refetch } = useReadContract({
//     //     address: contractAddress,
//     //     abi: contractAbi,
//     //     functionName: 'getVoter',
//     //     account: address,
//     //     args: [voterAddress]
//     // })

'use client'
import React, { useState, useEffect } from 'react';

import {
    Box,
    useToast,
    Step,
    Stepper,
    StepIndicator,
    StepNumber,
    StepStatus,
    StepSeparator,
    StepIcon,
    StepTitle,
    StepDescription,
    useSteps,
} from '@chakra-ui/react';

import { useReadContract, useAccount } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';
import { publicClient } from '@/network/client'
import WinningProposal from './WinningProposal';
import WorkflowStatusComponent from './WorkflowStatus';
import NextPhaseButton from './NextPhaseButton';
import AddVoter from './AddVoter';
import AddProposal from './AddProposal';
import Events from './Events'
import { parseAbiItem } from 'viem'

const workflowSteps = [
    { title: 'Registering Voters' },
    { title: 'Proposals Registration Started'},
    { title: 'Proposals Registration Ended'},
    { title: 'Voting Session Started'},
    { title: 'Voting Session Ended'},
    { title: 'Votes Tallied'},
];

const Voting = () => {
    const { address } = useAccount();
    const toast = useToast();
    const [events, setEvents] = useState([]);

    // Récupère le statut actuel du workflow
    const { data: getWorkflowStatus } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'workflowStatus',
        watch: true,
    });
    const { activeStep, setActiveStep } = useSteps({
        initialStep: 0,
    });
    useEffect(() => {
        if (typeof getWorkflowStatus !== 'undefined') {
            setActiveStep(getWorkflowStatus);
        }
    }, [getWorkflowStatus, setActiveStep]);
    // Get voter data (not implemented yet)
    // const { data: getVoterData, error: getVoterError, isPending: getVoterIsPending, refetch } = useReadContract({
    //     address: contractAddress,
    //     abi: contractAbi,
    //     functionName: 'getVoter',
    //     account: address,
    //     args: [voterAddress]
    // })

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

        const WorkflowStatusChangeEvent = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem('event WorkflowStatusChange(uint8 previousStatus, uint8 newStatus)'),
            // du premier bloc
            fromBlock: 0n,
            // jusqu'au dernier
            toBlock: 'latest'
        })
        console.log("WorkflowStatusChangeEvent", WorkflowStatusChangeEvent);

        const ProposalRegisteredEvent = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem('event ProposalRegistered(uint256 proposalId)'),
            // du premier bloc
            fromBlock: 0n,
            // jusqu'au dernier
            toBlock: 'latest' // Pas besoin valeur par défaut

        })

        const VotedEvent = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem('event Voted(address voter, uint256 proposalId)'),
            // du premier bloc
            fromBlock: 0n,
            // jusqu'au dernier
            toBlock: 'latest' // Pas besoin valeur par défaut
        })

        const combinedEvents = [...AddVoterEvents, ...WorkflowStatusChangeEvent, ...ProposalRegisteredEvent, ...VotedEvent].map(event => {
            let eventData = {
                type: 'Unknown',
                blockNumber: Number(event.blockNumber),
            };

            function shortenAddress(address) {
                return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
            }

            function shortenHash(hash) {
                return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
            }

            switch (event.eventName) {
                case 'VoterRegistered':
                    eventData.type = 'AddVoter';
                    eventData.description = "Voter Registered";
                    eventData.address = shortenAddress(event.args.voterAddress);
                    eventData.hash = shortenHash(event.transactionHash);
                    break;

                case 'WorkflowStatusChange':
                    eventData.type = 'StatusChange';
                    eventData.previousStatus = event.args.previousStatus;
                    eventData.newStatus = event.args.newStatus;
                    eventData.description = `Status changed from ${eventData.previousStatus} to ${eventData.newStatus}`;
                    eventData.hash = shortenHash(event.transactionHash);
                    break;

                case 'ProposalRegistered':
                    eventData.type = 'AddProposal';
                    eventData.proposalId = event.args.proposalId;
                    eventData.description = `Proposal ID: ${eventData.proposalId} registered`;
                    eventData.hash = shortenHash(event.transactionHash);
                    break;

                case 'Voted':
                    eventData.type = 'Vote';
                    eventData.voter = event.args.voter;
                    eventData.proposalId = event.args.proposalId;
                    eventData.description = `Voter ${eventData.voter} voted for proposal ${eventData.proposalId}`;
                    eventData.hash = shortenHash(event.transactionHash);
                    break;

            }

            return eventData;
        });

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
        <Box direction="column" width="100%">
            <WinningProposal workflowStatus={getWorkflowStatus || 0} winningProposalID={0} />
            <br />
            <br />
            <WorkflowStatusComponent workflowStatus={getWorkflowStatus || 0} />
            <br />
            <NextPhaseButton workflowStatus={getWorkflowStatus || 0} onSuccessfulNextPhase={getEvents} />
            <br />
            <br />
            <br />
            <br />
            {/* Intégration du Stepper */}
            <Box width="95%" m="auto" borderWidth='1px' borderRadius='lg' boxShadow='lg' p='6' rounded='md' bg='gray.50'>
            <Stepper index={activeStep}>
                {workflowSteps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus
                                complete={<StepIcon />}
                                incomplete={<StepNumber>{index + 1}</StepNumber>}
                                active={<StepNumber>{index + 1}</StepNumber>}
                            />
                        </StepIndicator>
                        <Box flexShrink='2'ml={1} mr={1}>
                            <StepTitle fontSize="xs" >{step.title}</StepTitle>
                           
                        </Box>
                    </Step>
                ))}
            </Stepper>
            </Box>
            <br />
            <AddVoter />
            <br />
            <hr />
            <br />
            <br />
            <AddProposal contractAddress={contractAddress} contractAbi={contractAbi} />
            <br />
            <hr />
            <br />
            <br />
            <Events events={events} />
        </Box>
    );
};

export default Voting;