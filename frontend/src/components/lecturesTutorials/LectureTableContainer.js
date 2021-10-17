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

  /* const lectureItems = Object.keys(lectures).map(key => 
    <div value={key}>{console.log(lectures[key])}</div>
  ) */

  return (
      <Accordion allowMultiple defaultIndex={[0, 1]} mx="auto" width={{ base: '100%', lg: '80%' }} height="50%" borderColor="white">
          <AccordionItem>
              <h2>
              {/* Loop through array for week buttons */}
              {lectures ? 
              lectures.map( lecture => (
                <h1>
                  {console.log(lecture)}
                </h1>
              ))
              : console.log("error")}
              <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="bold">
                      Week 1
                  </Box>
                  <AccordionIcon />
              </AccordionButton> 
              </h2>
              <AccordionPanel pb={4} px={0} overflowX={{ base: 'scroll', md: 'initial' }}>
                <LectureTable lectures={lectures} code={code} />
              </AccordionPanel>
          </AccordionItem>
      </Accordion>
  )
}

export default LectureTableContainer