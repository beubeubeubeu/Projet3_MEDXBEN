'use client';

import { Flex } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  return (
    <Flex
        justifyContent="flex-end"
        alignItems="center"
        p="2rem"
    >
        <ConnectButton />
    </Flex>
  )
}

export default Header