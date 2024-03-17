import { Box, Flex, Heading, VStack, Divider } from '@chakra-ui/react';
import React from 'react';
import WinningProposal from './WinningProposal';
import AddProposal from './AddProposal';
import VoteSelect from './VoteSelect';
import WorkflowStepper from './WorkflowStepper';
import Events from './Events';
import { contractAddress, contractAbi } from '@/constants';

const VoterAccess = ({ workflowStatus, address, options, events }) => {
    return (
        <Flex direction="column" justifyContent="center" width="100%">
            <Box p={5} shadow="md" borderWidth="1px" borderColor="gray.50" bgColor="gray.50" borderRadius="lg" width="full" maxWidth="full">
                <VStack spacing={4} align="stretch">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Heading size="lg" color="gray">Voter Access - Voting System</Heading>
                    </Flex>
                    <Divider />
                    <WinningProposal isVoter={true} workflowStatus={workflowStatus} address={address} />
                    <WorkflowStepper workflowStatus={workflowStatus} />
                    { workflowStatus === 1 ? (
                            <AddProposal contractAddress={contractAddress} contractAbi={contractAbi} />
                        ) : (
                            null
                        )
                    }
                    { workflowStatus === 3 ? (
                            <VoteSelect options={options} address={address} />
                        ) : (
                            null
                        )
                    }
                </VStack>
                <Box m={5} />
                <Events events={events} />
            </Box>
        </Flex>
    );

};

export default VoterAccess;