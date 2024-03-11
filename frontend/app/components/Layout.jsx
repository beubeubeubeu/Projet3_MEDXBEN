'use client';

import { Flex } from '@chakra-ui/react'

import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <Flex
      direction="column"
      h="100vh"
      justifyContent="center"
    >
      <Header />
      <Flex
        grow="1"
        p="2rem"
      >
        {children}
      </Flex>
      <Footer />
    </Flex>
  )
}

export default Layout