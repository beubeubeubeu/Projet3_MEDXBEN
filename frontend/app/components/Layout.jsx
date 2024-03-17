'use client';

import { Flex } from '@chakra-ui/react'

import Header from './Header'

const Layout = ({ children }) => {
  return (
    <Flex
      direction="column"
      minH="100vh"
      justifyContent="center"
    >
      <Header />
      <Flex
        grow="1"
        p="2rem"
      >
        {children}
      </Flex>
    </Flex>
  )
}

export default Layout