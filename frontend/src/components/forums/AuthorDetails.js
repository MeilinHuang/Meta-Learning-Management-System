import React from "react";
import { Flex, Heading, Icon, Text, Tooltip } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

function AuthorDetails({ author, date, isEndorsed }) {
  const dateString = new Date(date).toLocaleString("en-AU");

  return (
    <Flex
      alignItems={{ base: "unset", md: "center" }}
      justifyContent="space-between"
      flexDirection={{ base: "column", md: "row" }}
      mb="8px"
    >
      <Heading size="sm">{author}</Heading>
      <Flex alignItems="baseline">
        {isEndorsed && (
          <Tooltip
            label="This comment is endorsed by staff"
            hasArrow
            placement="bottom"
            mr="8px"
            w="90px"
            textAlign="center"
            fontSize="12px"
          >
            <span>
              <Icon
                h="12px"
                w="12px"
                mr="8px"
                color="green"
                as={FaCheckCircle}
              />
            </span>
          </Tooltip>
        )}
        <Text fontSize="13px">{dateString}</Text>
      </Flex>
    </Flex>
  );
}

export default AuthorDetails;
