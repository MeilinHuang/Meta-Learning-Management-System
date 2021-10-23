import React from "react";
import { 
  Link,
  AccordionPanel,
  Flex,
  Button
} from "@chakra-ui/react";
import { DownloadIcon } from '@chakra-ui/icons'

function LectureTable({ isAdmin, lecture, code }) {

    /* const renderLectureFiles = (lectures) => {
      if (lectures) {
        for (const lecture of lectures) {
          if (lecture.lecture_files) {
            lecture.lecture_files.map( file => (
              <Link href={file.file}>
                {file.name} 
              </Link>
            ))
          }
        }
      }
    } */

    const isLectureFiles = (lecture) => {
      if (lecture) if (lecture.lecture_files) return true
      return false;
    }

    return (
      <Button>
        {
          isLectureFiles(lecture) ? lecture.lecture_files.map( file => (
            <Link href={file.file} margin-right="50%">
              {file.name} <DownloadIcon />
            </Link>
          )) : console.log("No lecture files")
        }
      </Button>
    )
}

export default LectureTable;