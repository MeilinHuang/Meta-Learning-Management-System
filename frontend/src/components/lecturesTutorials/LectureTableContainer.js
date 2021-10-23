import React from "react"
import { 
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
} from "@chakra-ui/react"
import LectureTable from './LectureTable'

function LectureTableContainer({ lectures, code }) {
  return (
      <Accordion allowMultiple defaultIndex={[0, 1]} mx="auto" width={{ base: '100%', lg: '80%' }} height="50%" borderColor="white" paddingTop="2%">
          <AccordionItem>
              <h2>
              {/* Loop through array for week buttons */}
              {lectures ? 
              lectures.map( lecture => (
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                        Week {lecture.week}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton> 
                  <AccordionPanel pb={4} px={0} overflowX={{ base: 'scroll', md: 'initial' }}>
                  <LectureTable lecture={lecture} code={code} />
                  </AccordionPanel>
                </AccordionItem>
              ))
              : console.log("error")}
              </h2>
              <AccordionPanel pb={4} px={0} overflowX={{ base: 'scroll', md: 'initial' }}>
                <LectureTable lectures={lectures} code={code} />
              </AccordionPanel>
          </AccordionItem>
      </Accordion>
  )
}

export default LectureTableContainer