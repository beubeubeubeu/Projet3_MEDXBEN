import React from 'react';
import { Box, Flex, Heading, VStack, Divider } from '@chakra-ui/react';
import WinningProposal from './WinningProposal';
import NextPhaseButton from './NextPhaseButton';
import AddVoter from './AddVoter';
import AddProposal from './AddProposal';
import Events from './Events';
import VoteSelect from './VoteSelect';
import WorkflowStepper from './WorkflowStepper';
import { contractAddress, contractAbi } from '@/constants';



const AdminView = ({ getWorkflowStatus, onSuccessfulNextPhase, address, voteOptions, setRefreshEvents, events, NextPhaseButton  }) => {
    return (
        <Flex direction="column" justifyContent="center" width="100%">
            <Box p={5} shadow="md" borderWidth="1px" borderColor="gray.50" bgColor="gray.50" borderRadius="lg" width="full" maxWidth="full">
                <VStack spacing={4} align="stretch">

                    <Flex justifyContent="space-between" alignItems="center">
            <Heading size="lg" color="gray">Admin View - Voting System</Heading>
            <NextPhaseButton
                workflowStatus={getWorkflowStatus || 0}
                onSuccessfulNextPhase={events}
            />
            </Flex>
                    <Divider />
                    <WinningProposal workflowStatus={getWorkflowStatus} address={address} />
                    <WorkflowStepper workflowStatus={getWorkflowStatus} />
                    <AddVoter setRefreshEvents={setRefreshEvents} />
                    <AddProposal contractAddress={contractAddress} contractAbi={contractAbi} />
                    <VoteSelect options={voteOptions} address={address} />
                    <Events events={events} />
                </VStack>
            </Box>
        </Flex>
    );
    
};
export default AdminView;