import React from 'react'

import { Box, Flex, Spinner, Text } from '@chakra-ui/react'

import { workflowStatuses } from '@/constants'

const WorkflowStatus = ({pending, workflowStatus}) => {
  return (
    <Box>
      <Flex width="100%">
        <Text><b>Workflow status : </b></Text>
        { pending ?
          <Spinner /> : <Text>{workflowStatuses[workflowStatus]}</Text>
        }
      </Flex>
    </Box>
  )
}

export default WorkflowStatus
