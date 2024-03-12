'use client';

import { Flex } from '@chakra-ui/react'

import Header from './Header'
import Footer from './Footer'
import AddProposal from '../components/AddProposal';

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
      <AddProposal/>
      <Flex grow="1"
        p="2rem">

      </Flex>
      <Footer />
    </Flex>
  )
}

export default Layout