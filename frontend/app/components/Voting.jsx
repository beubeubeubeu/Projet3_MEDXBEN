'use client'

import { useEffect, useState } from 'react'

import { Box, Flex, Text, Input, Button, useToast, Heading, Spinner } from '@chakra-ui/react'

import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'

import { contractAddress, contractAbi, workflowStatuses } from '@/constants'

import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi'

import { parseAbiItem } from 'viem'

// import { publicClient } from '../network/client'

// l’enregistrement d’une liste blanche d'électeurs.

// à l'administrateur de commencer la session d'enregistrement de la proposition.

// aux électeurs inscrits d’enregistrer leurs propositions.

// à l'administrateur de mettre fin à la session d'enregistrement des propositions.

// à l'administrateur de commencer la session de vote.

// aux électeurs inscrits de voter pour leurs propositions préférées.

// à l'administrateur de mettre fin à la session de vote.

// à l'administrateur de comptabiliser les votes.

// à tout le monde de consulter le résultat.

// Lister les événements.

const Voting = () => {

    const { address, isConnected } = useAccount();

    const toast = useToast();

    const [voterAddress, setVoterAddress] = useState('');

    // Is owner
    function isOwner() {
    if (!isConnected) {
        return false
    } else {
        const { data: ownerAddress } = useContractRead({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'owner',
        })
        return ownerAddress === address;
    }
    }

    // Get voter data (not tested yet)
    const { data: getVoterData, error: getVoterError, isPending: getVoterIsPending, refetch } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'getVoter',
        account: address,
        args: [voterAddress]
    })

    // Get workflow status
    const { data: getWorkflowStatusData, error: getWorkflowStatusError, isPending: getWorkflowStatusIsPending } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'workflowStatus',
        account: address
    })

    // Add voter
    const { data: hash, error, isPending: addVoterIsPending, writeContract: addVoterCall } = useWriteContract({
        mutation: {
            onSuccess: () => {
                toast({
                    title: "Le voter a bien été ajouté",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error) => {
                toast({
                    title: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            },
        },
    });


  // Add voter
    const addVoter = async() => {
        addVoterCall({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'addVoter',
            args: [voterAddress],
        })
    }

    return (
    <Box
        direction="column"
        width="100%"
    >
        <Flex width="100%">
        {getWorkflowStatusIsPending ? (
                    <Spinner />
                ) : (
                    <Text><b>Workflow status :</b> {workflowStatuses[getWorkflowStatusData]}</Text>
            )}
        </Flex>
        <Flex>
            <Input placeholder='New voter address' onChange={(e) => setVoterAddress(e.target.value)} />
            <Button disabled={addVoterIsPending} onClick={addVoter}>{addVoterIsPending ? 'Confirming...' : 'Add voter'} </Button>
        </Flex>
    </Box>
    )
    }

export default Voting