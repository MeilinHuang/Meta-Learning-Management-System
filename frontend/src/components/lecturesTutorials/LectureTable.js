import React from "react";
import { 
  Link,
  Button,
  AccordionItem,
  Flex
} from "@chakra-ui/react";
import { DownloadIcon } from '@chakra-ui/icons'

function LectureTable({ isAdmin, lecture, code, searchFiles}) {

  const isLectureFiles = (lecture) => {
    if (lecture) if (lecture.lecture_files) return true
    return false;
  }
    
  const isSearchFiles = (searchFiles) => {
    if (searchFiles) return true
    return false;
  }

  return (
    <Flex align-items="center" text-align="center"> 
      <AccordionItem width="100%" text-align="left" padding="1%">
        {
          isLectureFiles(lecture) ? lecture.lecture_files.map( file => (
            <> 
              <Link href={file.file} download>
                {file.name} <DownloadIcon cursor="pointer"/>
              </Link>
              <br/>
            </>
          )) : console.log("No lectures")
        }
        {
          isSearchFiles(searchFiles) ? searchFiles.map( file => (
            <>
              <Link href={file.file} key={file.id} download>
                {file.name} <DownloadIcon cursor="pointer"/>
              </Link>
              <br/>
            </>
          )) : console.log("No search files")
        }
        
      </AccordionItem>
    </Flex>
  )
}

export default LectureTable;