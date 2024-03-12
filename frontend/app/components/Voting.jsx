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

    // Get voter data (not implemented yet)
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
    const { data: addVoterTxhash, error: addVotererror, isPending: addVoterIsPending, writeContract: addVoterCall } = useWriteContract({
        mutation: {
            onSuccess: () => {
                toast({
                    title: "Voter has been added",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error) => {
                toast({
                    title: addVotererror.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            },
        },
    });

    // Add voter call
    const addVoter = async() => {
        addVoterCall({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'AddVoter',
            args: [voterAddress],
        })
    }

    const { data: startProposalRegistrationTxhash, error: startProposalRegistrationError, isPending: startProposalRegistrationIsPending, writeContract: startProposalRegistration } = useWriteContract({
        mutation: {
            onSuccess: () => {
                toast({
                    title: "Proposal registration started",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            },
            onError: (error) => {
                toast({
                    title: startProposalRegistrationError.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            },
        },
    })

    // Start proposal registration
    const handleStartProposalRegistration = async() => {
        console.log('toto')
        startProposalRegistration({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'StartProposalsRegistering',
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
            { workflowStatuses[getWorkflowStatusData] === "Registering voters" ? (
                <Flex>
                        <Button colorScheme='teal' size='lg' onClick={handleStartProposalRegistration}>
                            Start proposal registration
                        </Button>
                </Flex>
            ) : null }
        </Box>
    )
}

export default Voting