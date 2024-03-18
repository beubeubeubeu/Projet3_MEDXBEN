import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';

const RestrictedAccess = () => {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" p={5} shadow="md" borderWidth="1px" borderColor="gray.50" bgColor="gray.50" borderRadius="lg" width="full" maxWidth="full">
            <Flex direction="column" justifyContent="center" alignItems="center">
                <Heading as="h2" size="xl">
                    Veuillez vous connecter
                </Heading>
            </Flex>
        </Box>
    );
};

export default RestrictedAccess;
