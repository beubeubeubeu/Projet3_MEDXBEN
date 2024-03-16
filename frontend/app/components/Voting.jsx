
//     // TODO Is owner
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


// TODO Is Voter

'use client'
import React, { useState, useEffect } from 'react';

import { Box, Flex, Heading, VStack, Divider, Center } from '@chakra-ui/react';

import { useReadContract, useAccount } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';
import { publicClient } from '@/network/client'

import WinningProposal from './WinningProposal';
import NextPhaseButton from './NextPhaseButton';
import AddVoter from './AddVoter';
import AddProposal from './AddProposal';
import Events from './Events'
import VoteSelect from './VoteSelect'
import WorkflowStepper from './WorkflowStepper'

import { parseAbiItem } from 'viem'

const Voting = () => {
    const { address } = useAccount();
    const [events, setEvents] = useState([]);
    const [refreshEvents, setRefreshEvents] = useState(false);

    // Récupère le statut actuel du workflow
    const { data: getWorkflowStatus } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'workflowStatus',
        watch: true,
    });

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
            fromBlock: 0n,
            toBlock: 'latest'
        })

        const WorkflowStatusChangeEvent = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem('event WorkflowStatusChange(uint8 previousStatus, uint8 newStatus)'),
            fromBlock: 0n,
            toBlock: 'latest'
        })

        const ProposalRegisteredEvent = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem('event ProposalRegistered(uint256 proposalId)'),
            fromBlock: 0n,
            toBlock: 'latest'

        })

        const VotedEvent = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem('event Voted(address voter, uint256 proposalId)'),
            fromBlock: 0n,
            toBlock: 'latest'
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

    // Voting
    const [voteOptions, setVoteOptions] = useState([{}])

    const getProposals = async () => {
        const tmpVoteOptions = []
        const proposalRegisteredEvent = await publicClient.getLogs({
            address: contractAddress,
            event: parseAbiItem('event ProposalRegistered(uint256 proposalId)'),
            fromBlock: 0n,
            toBlock: 'latest'
        })
        proposalRegisteredEvent.map(async event => {
            tmpVoteOptions.push({ id: event.args.proposalId, description: `Proposal ${event.args.proposalId}` })
        })
        setVoteOptions(tmpVoteOptions);
    }

    useEffect(() => {
        const getAllProposals = async () => {
            if (address !== 'undefined') {
                await getProposals();
            }
        }
        getAllProposals();
    }, [address])

    useEffect(() => {
        if (refreshEvents) {
          getEvents(); // Fonction pour récupérer les événements
          setRefreshEvents(false); // Réinitialise l'état pour les futurs rafraîchissements
        }
      }, [refreshEvents]);

    return (

        <Flex direction="column" justifyContent="center" width="100%">
            <Box
                p={5}
                shadow="md"
                borderWidth="1px"
                borderColor="gray50"
                bgColor="gray.50"
                borderRadius="lg"
                width="full"
                maxWidth="full"
            >
                <VStack spacing={4} align="stretch">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Heading size="lg" color="gray">Voting System</Heading>
                        <NextPhaseButton workflowStatus={getWorkflowStatus || 0} onSuccessfulNextPhase={getEvents}
                        />
                    </Flex>

                    <Divider />
                    <WinningProposal workflowStatus={getWorkflowStatus || 0} address={address} />
                    <WorkflowStepper workflowStatus={getWorkflowStatus || 0} />

                    <AddVoter setRefreshEvents={setRefreshEvents}/>

                    <AddProposal contractAddress={contractAddress} contractAbi={contractAbi} />

                    <VoteSelect options={voteOptions} address={address} />

                    <Events events={events} />
                </VStack>
            </Box>

        </Flex>
    );
};

export default Voting;