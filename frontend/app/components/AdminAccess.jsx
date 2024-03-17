import React from 'react';
import { Box, Flex, Heading, VStack, Divider } from '@chakra-ui/react';
import WinningProposal from './WinningProposal';
import AddVoter from './AddVoter';
import Events from './Events';
import WorkflowStepper from './WorkflowStepper';

const AdminAccess = ({ getWorkflowStatus, onSuccessfulNextPhase, address, setRefreshEvents, events, NextPhaseButton  }) => {
    return (
        <Flex direction="column" justifyContent="center" width="100%">
            <Box p={5} shadow="md" borderWidth="1px" borderColor="gray.50" bgColor="gray.50" borderRadius="lg" width="full" maxWidth="full">
                <VStack spacing={4} align="stretch">

                    <Flex justifyContent="space-between" alignItems="center">
            <Heading size="lg" color="gray">Admin Access - Voting System</Heading>
            <NextPhaseButton
                workflowStatus={getWorkflowStatus || 0}
                onSuccessfulNextPhase={events}
            />
            </Flex>
                    <WinningProposal isVoter={false} workflowStatus={getWorkflowStatus} address={address} />
                    <Divider />
                    <WorkflowStepper workflowStatus={getWorkflowStatus} />
                    { getWorkflowStatus === 0 ? (
                            <AddVoter setRefreshEvents={setRefreshEvents} />
                        ) : (
                            null
                        )
                    }
                    <Events events={events} />
                </VStack>
            </Box>
        </Flex>
    );
};
export default AdminAccess;