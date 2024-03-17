
import {
    Alert,
    AlertIcon,
    Card,
    CardHeader,
    Flex,
    Heading,
} from '@chakra-ui/react'
import WinningProposal from './WinningProposal';

const NotConnected = (getWorkflowStatus, address) => {
    return (
        <>
        <Flex direction="column" justifyContent="center" width="100%">
            <Card align='center'>
                <CardHeader>
                    <Heading size='md'>
                        <Alert status='warning'>
                            <AlertIcon />
                            Please connect your Wallet.
                        </Alert>
                    </Heading>
                    <WinningProposal workflowStatus={getWorkflowStatus} address={address} />
                </CardHeader>
            </Card>
            </Flex>
        </>
    )
}

export default NotConnected