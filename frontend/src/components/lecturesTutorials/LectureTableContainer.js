import React from "react"
import { 
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Link
} from "@chakra-ui/react"
import LectureTable from './LectureTable'

function LectureTableContainer({ lectures, code, searchFiles }) {

  function compare( a, b ) {
    if ( a.week < b.week ){
      return -1;
    }
    if ( a.week > b.week ){
      return 1;
    }
    return 0;
  }
  
  if (lectures) lectures.sort(compare);

  return (
      <Accordion allowMultiple defaultIndex={[0, 1]} mx="auto" width={{ base: '100%', lg: '80%' }} height="50%" borderColor="white" paddingTop="2%">
          <AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    Lecture Videos
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} px={0} overflowX={{ base: 'scroll', md: 'initial' }}>
                  { /* Add new database lecture-information panel */ }
                  <Box flex="1" textAlign="left" padding="1%">
                    Lecture videos playlist at: 
                    <Link href="https://www.youtube.com" padding="1%" color="blue">
                       www.youtube.com
                    </Link>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
              <h2>
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
              : console.log("No lectures") }
              {
                searchFiles && 
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Results
                    </Box>
                    <AccordionIcon />
                  </AccordionButton> 
                  <AccordionPanel pb={4} px={0} overflowX={{ base: 'scroll', md: 'initial' }}>
                  <LectureTable lecture={lectures} searchFiles={searchFiles} code={code} />
                  </AccordionPanel>
                </AccordionItem>
              }
              </h2>
          </AccordionItem>
      </Accordion>
  )
}

export default LectureTableContainer