import React from 'react';
import { Box, Flex, Heading, VStack } from '@chakra-ui/react';
import WinningProposal from './WinningProposal';
import AddVoter from './AddVoter';
import Events from './Events';
import WorkflowStepper from './WorkflowStepper';
import NextPhaseButton from './NextPhaseButton';

const AdminAccess = ({ workflowStatus, onSuccessfulNextPhase, setRefreshEvents, address, events,   }) => {
    return (
        <Flex direction="column" justifyContent="center" width="100%">
            <Box p={5} shadow="md" borderWidth="1px" borderColor="gray.50" bgColor="gray.50" borderRadius="lg" width="full" maxWidth="full">
                <VStack spacing={4} align="stretch">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Heading size="lg" color="gray">Admin</Heading>
                        <NextPhaseButton
                            workflowStatus={workflowStatus || 0}
                            onSuccessfulNextPhase={onSuccessfulNextPhase}
                        />
                    </Flex>
                    <WinningProposal isVoter={false} workflowStatus={workflowStatus} address={address} />
                    <WorkflowStepper workflowStatus={workflowStatus} />
                    { workflowStatus === 0 ? (
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