import React from 'react'

import { Box, Flex, Spinner, Text, Badge } from '@chakra-ui/react'

import { workflowStatuses } from '@/constants'

const WorkflowStatus = ({pending, workflowStatus}) => {
  return (
    <Box>
      <Flex width="100%">
        { pending ?
          <Spinner /> : <Badge colorScheme="purple">{workflowStatuses[workflowStatus]}</Badge>
        }
      </Flex>
    </Box>
  )
}

export default WorkflowStatus
