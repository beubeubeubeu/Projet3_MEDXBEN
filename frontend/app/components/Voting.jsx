'use client'
import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useReadContract, useAccount, useWatchContractEvent } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';
import { publicClient } from '@/network/client'

import NextPhaseButton from './NextPhaseButton';
import { parseAbiItem } from 'viem'

// VIEW ACCESS
import VoterAccess from './VoterAccess';
import RestrictedAccess from './RestrictedAccess';
import AdminAccess from './AdminAccess';
import NotConnected from './NotConnected';
import UnregisteredUser from './UnregisteredUser'

const Voting = () => {
    const { address } = useAccount();
    const [events, setEvents] = useState([]);
    const [refreshEvents, setRefreshEvents] = useState(false);
    const [userRights, setUserRights] = useState('loading');

    // Récupère le statut actuel du workflow
    const { data: getWorkflowStatus } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'workflowStatus',
        watch: true,
    });

    // Utilisation de useReadContract pour vérifier si l'utilisateur courant est l'owner du contrat
    const { data: isOwnerData } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'owner',

    });

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
            if (address !== undefined) {
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
            if (address !== undefined) {
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

    //////////////////////////////// ACCESS ///////////////////////////////////////////////

    const { data: getVoter } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'GetVoter',
        account: address,
        args: [address],
    });

    useEffect(() => {
        const addressLower = address?.toLowerCase();
        if (addressLower === isOwnerData?.toLowerCase()) {
            setUserRights('admin');
        } else if (getVoter?.isRegistered) {
            setUserRights('voter');
        } else if (addressLower) {
            setUserRights('unregistered');
        } else {
            setUserRights(null);
        }
    }, [address, getVoter, isOwnerData]);

    if (!address) {
        return <NotConnected />;
    } else if (userRights === 'admin') {
        return <AdminAccess
            NextPhaseButton={NextPhaseButton}
            getWorkflowStatus={getWorkflowStatus}
            onSuccessfulNextPhase={getEvents}
            address={address}
            setRefreshEvents={setRefreshEvents}
            events={events}
        />;
    } else if (userRights === 'loading') {
        return <Box>Loading...</Box>;

    } else if (userRights === 'voter') {
        return <VoterAccess
            workflowStatus={getWorkflowStatus}
            address={address}
            options={voteOptions}
            events={events}
        />;

    } else if (userRights === 'unregistered') {
        return <UnregisteredUser />;

    } else if (userRights === null) {
        return <RestrictedAccess
            workflowStatus={getWorkflowStatus}
        />;
    }

    return (
        <Text> something is wrong </Text>
    );

};

export default Voting;