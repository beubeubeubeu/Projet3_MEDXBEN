import { Box, Flex, Heading, VStack, Divider, Center, Text } from '@chakra-ui/react';
import React from 'react';
import WinningProposal from './WinningProposal';
import AddProposal from './AddProposal';
import VoteSelect from './VoteSelect';
import WorkflowStepper from './WorkflowStepper';
import { contractAddress, contractAbi } from '@/constants';

const VoterAccess = ({ getWorkflowStatus, address, voteOptions }) => {
    return (
<Flex direction="column" justifyContent="center" width="100%">
            <Box p={5} shadow="md" borderWidth="1px" borderColor="gray.50" bgColor="gray.50" borderRadius="lg" width="full" maxWidth="full">
                <VStack spacing={4} align="stretch">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Heading size="lg" color="gray">Voter View - Voting System</Heading>
                    </Flex>
                    <Divider />
                    <WinningProposal workflowStatus={getWorkflowStatus} address={address} />
                    <WorkflowStepper workflowStatus={getWorkflowStatus} />
                    <AddProposal contractAddress={contractAddress} contractAbi={contractAbi} />
                    <VoteSelect options={voteOptions} address={address} />
                </VStack>
            </Box>
        </Flex>
    );
    
};

export default VoterAccess;