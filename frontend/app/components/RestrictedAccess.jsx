import React from 'react';
import { Box, Flex, Heading, VStack, Divider, Center, Text } from '@chakra-ui/react';

const RestrictedAccess = () => {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading as="h2" size="xl" mt={6} mb={2}>
                Accès Restreint
            </Heading>
            <Text color={'gray.500'}>
                Vous n'avez pas l'autorisation d'accéder à cette page. Veuillez vous connecter.
            </Text>
        </Box>
    );
};

export default RestrictedAccess;
