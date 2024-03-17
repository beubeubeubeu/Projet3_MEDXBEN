
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import WinningProposal from './WinningProposal';


const UnregisteredUser = () => {
  return (
    <Alert
      status='info'
      variant='subtle'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      textAlign='center'
      height='400px'
    >
      <AlertIcon boxSize='40px' mr={0} />
      <AlertTitle mt={4} mb={4} fontSize='lg'>
        Compte Non Enregistré
      </AlertTitle>
      <AlertDescription maxWidth='sm'>
        Votre compte est connecté mais n'est pas encore enregistré comme électeur ou administrateur. Veuillez contacter l'administrateur à l'adresse suivante 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 pour plus d'informations.
      </AlertDescription>
    </Alert>
  );
}

export default UnregisteredUser;
