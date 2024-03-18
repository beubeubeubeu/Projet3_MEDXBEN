
import {
    Alert,
    AlertIcon,
    Card,
    CardHeader,
    Flex,
    Heading,
} from '@chakra-ui/react'

const NotConnected = () => {
    return (
        <>
        <Flex direction="column" justifyContent="center" width="100%">
            <Card bg="orange.100" align='center'>
                <CardHeader>
                    <Heading size='md'>
                        <Alert status='warning'>
                            <AlertIcon />
                            Please connect your Wallet.
                        </Alert>
                    </Heading>
                </CardHeader>
            </Card>
        </Flex>
        </>
    )
}

export default NotConnected;
