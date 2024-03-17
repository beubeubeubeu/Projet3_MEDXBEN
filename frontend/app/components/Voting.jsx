'use client'
import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, VStack, Divider, Center } from '@chakra-ui/react';
import { useReadContract, useAccount, useWatchContractEvent } from 'wagmi';
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


// VIEW ACCESS
import VoterAccess from './VoterAccess';
import RestrictedAccess from './RestrictedAccess';
import AdminView from './AdminView';

const Voting = () => {
    const { address } = useAccount();
    const [events, setEvents] = useState([]);
    const [refreshEvents, setRefreshEvents] = useState(false);
    const [userRights, setUserRights] = useState('loading');
    const [isVoter, setIsVoter] = useState(false);
    const [registeredVoters, setRegisteredVoters] = useState([]);


    // Récupère le statut actuel du workflow
    const { data: getWorkflowStatus } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'workflowStatus',
        watch: true,
    });

    // Utilisation de useReadContract pour vérifier si l'utilisateur courant est l'owner du contrat
    const { data: isOwnerData, isLoading: isOwnerLoading } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'owner',

    });

    // Utilisation de useReadContract pour vérifier si l'utilisateur courant est un électeur enregistré
    const { data: isVoterData, isLoading: isVoterLoading } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'GetVoter',
        args: [address],
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

    // const useVoterStatus = (contract) => {
    //     const { address } = useAccount();
    //     const [isVoter, setIsVoter] = useState(false);
    //     const [isLoading, setIsLoading] = useState(true);

    //     useEffect(() => {
    //         const fetchVoterStatus = async () => {
    //             setIsLoading(true);
    //             try {
    //                 // Création d'un filtre pour les événements VoterRegistered
    //                 const filter = contract.filters.VoterRegistered();
    //                 // Récupération des événements depuis le bloc de déploiement du contrat
    //                 const events = await contract.queryFilter(filter);

    //                 // Extraction des adresses des électeurs enregistrés
    //                 const voters = events.map(event => event.args.voterAddress);

    //                 // Vérification si l'utilisateur courant est un électeur enregistré
    //                 setIsVoter(voters.includes(address));
    //             } catch (error) {

    //             } finally {
    //                 setIsLoading(false);
    //             }
    //         };

    //         if (address) {
    //             fetchVoterStatus();
    //         }
    //     }, [address, contract]);

    //     return { isVoter, isLoading };
    //};

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

    // Gestionnaire d'événements pour VoterRegistered
    const handleVoterRegistered = (event) => {

        const voterAddress = event[0];

        setRegisteredVoters((current) => [...current, voterAddress]);
    };

    useEffect(() => {
        const unsubscribe = useWatchContractEvent({
          address: contractAddress,
          abi: contractAbi,
          eventName: 'VoterRegistered',
          listener: (event) => {
            console.log('New VoterRegistered event:', event);
            const newVoterAddress = event[0].toLowerCase();
            setRegisteredVoters(prevRegisteredVoters => {
              // Cette vérification évite d'ajouter des doublons
              if (!prevRegisteredVoters.includes(newVoterAddress)) {
                return [...prevRegisteredVoters, newVoterAddress];
              }
              return prevRegisteredVoters;
            });
          },
        });
      
        // Retourne une fonction de nettoyage qui arrête d'écouter les événements à la désinscription du composant
        return () => unsubscribe();
      }, [setRegisteredVoters]); 
      
    useEffect(() => {
        // Dépendance sur 'address' pour vérifier si l'utilisateur courant est un votant enregistré
        if (address) {
          setIsVoter(registeredVoters.includes(address.toLowerCase()));
        }
      }, [address, registeredVoters]); // Ajoutez 'registeredVoters' et 'address' dans la liste des dépendances

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


    // Logique pour déterminer les droits de l'utilisateur
    useEffect(() => {
        if (address === isOwnerData) {
            setUserRights('admin');
        } else if (isVoter) {

            setUserRights('voter');

        } else {
            setUserRights(null);
        }
    }, [address, isOwnerData, isVoter]);

    if (userRights === 'loading') {
        return <Box>Loading...</Box>;
    }

    if (userRights === 'admin') {
        return <AdminView
            NextPhaseButton={NextPhaseButton}
            getWorkflowStatus={getWorkflowStatus}
            onSuccessfulNextPhase={getEvents}
            address={address}
            voteOptions={voteOptions}
            setRefreshEvents={setRefreshEvents}
            events={events}
        />;
    } else if (userRights === 'voter') {
        return <VoterAccess />;

    } else if (userRights === null) {
        return <RestrictedAccess />;
    }


    return (

        // <Flex direction="column" justifyContent="center" width="100%">
        //     <Box
        //         p={5}
        //         shadow="md"
        //         borderWidth="1px"
        //         borderColor="gray50"
        //         bgColor="gray.50"
        //         borderRadius="lg"
        //         width="full"
        //         maxWidth="full"
        //     >
        //         <VStack spacing={4} align="stretch">
        //             <Flex justifyContent="space-between" alignItems="center">
        //                 <Heading size="lg" color="gray">Voting System</Heading>
        //                 <NextPhaseButton workflowStatus={getWorkflowStatus || 0} onSuccessfulNextPhase={getEvents}
        //                 />
        //             </Flex>

        //             <Divider />
        //             <WinningProposal workflowStatus={getWorkflowStatus || 0} address={address} />
        //             <WorkflowStepper workflowStatus={getWorkflowStatus || 0} />

        //             <AddVoter setRefreshEvents={setRefreshEvents} />

        //             <AddProposal contractAddress={contractAddress} contractAbi={contractAbi} />

        //             <VoteSelect options={voteOptions} address={address} />

        //             <Events events={events} />
        //             <Box p={5} shadow="md" borderWidth="1px" borderColor="gray.50" bgColor="gray.50" borderRadius="lg" width="full" maxWidth="full">
        //             </Box>
        //         </VStack>
        //     </Box>

        // </Flex>
        <Text> RETURN VOTING</Text>
    );
};

export default Voting;