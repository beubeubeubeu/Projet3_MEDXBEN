'use client'

import { Box, useToast } from '@chakra-ui/react'

import { contractAddress, contractAbi } from '@/constants'

import { useReadContract, useAccount, useWriteContract } from 'wagmi'

import WorkflowStatus from './WorkflowStatus'
import NextPhaseButton from './NextPhaseButton'
import AddVoter from './AddVoter'
import AddProposal from './AddProposal'
<<<<<<< HEAD
import WinningProposal from './WinningProposal'
=======


// import { publicClient } from '../network/client'
>>>>>>> e50d72d (ajout events)

const Voting = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(false); ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const { address, isConnected } = useAccount();

    const toast = useToast();

<<<<<<< HEAD
=======
    const [voterAddress, setVoterAddress] = useState('');
    
>>>>>>> e50d72d (ajout events)
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

<<<<<<< HEAD
    // Get winning proposal ID
    const { data: getWinningProposalID, isPending: getWinningProposalIsPending, refetch: refetchWinningProposal } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'winningProposalID',
        account: address
    })
=======
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
            onSuccess: () => {
                const triggerRefresh = () => {
                    setRefreshTrigger(prev => !prev); // Bascule l'état pour déclencher un effet
                  } // Change refreshTrigger pour déclencher une mise à jour //////////////////////////////////////////////////////////////////////////////////////////////////
              }
        })
    }
>>>>>>> e50d72d (ajout events)

    return (
        <Box
            direction="column"
            width="100%"
        >
<<<<<<< HEAD
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
=======
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
            <NextPhaseButton workflowStatus={getWorkflowStatusData || 0} onSuccessfulNextPhase={refetchWorkflowStatus} />

            <AddProposal contractAddress={contractAddress} contractAbi={contractAbi} voterAddress={address} refreshTrigger={refreshTrigger} />      
  {/* <AddProposal contractAddress={contractAddress} contractAbi={contractAbi} voterAddress={address} /> */}


>>>>>>> e50d72d (ajout events)
        </Box>
    )
}

export default Voting