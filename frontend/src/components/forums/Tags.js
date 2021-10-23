import React from "react";
import { Flex, Tag } from "@chakra-ui/react";

function Tags({ tags, fromAnnouncement }) {
  return (
    <Flex>
      {fromAnnouncement && (
        <Tag my="8px" mx="4px" px="12px" borderRadius="full" variant="outline">
          Announcement
        </Tag>
      )}
      {tags &&
        tags[0] !== null &&
        tags.map((tag) => {
          if (tag === null) {
            return null;
          }

          const { id, name } = tag;
          return (
            <Tag
              key={id}
              my="8px"
              mx="4px"
              px="12px"
              borderRadius="full"
              variant="outline"
            >
              {name}
            </Tag>
          );
        })}
    </Flex>
  );
}

export default Tags;
