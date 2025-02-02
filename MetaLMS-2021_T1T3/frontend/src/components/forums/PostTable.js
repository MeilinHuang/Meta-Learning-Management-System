// Code based on sample code from https://codesandbox.io/s/mjk1v?file=/src/App.js
import React, { useContext, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTable, useSortBy } from "react-table";
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  Link,
  Table,
  Text,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { RiPushpin2Fill, RiPushpin2Line } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import UpvoteButton from "./UpvoteButton"
import { StoreContext } from "../../utils/store";
import { isStaff } from "../../utils/helpers"
import { backend_url } from "../../Constants"

function PostTable({ posts: postData, code }) {
  const context = useContext(StoreContext);
  const {
    posts: [, setPosts],
    pinnedPosts: [, setPinnedPosts],
    showPinned: [, setShowPinned],
  } = context;

  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "ispinned",
        Cell: ({
          cell: {
            row: {
              original: { post_id },
            },
            value,
          },
        }) => {
          const handlePinUnpin = () => {
            fetch(
              `${backend_url}${code}/forum/post/pin/${post_id}/${!value}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/JSON",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            ).then((r) => {
              if (r.status === 200) {
                fetch(`${backend_url}${code}/forum`, {
                  headers: {
                    "Content-Type": "application/JSON",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
                  .then((r) => r.json())
                  .then((data) => setPosts(data));
                fetch(`${backend_url}${code}/forum/pinned`, {
                  headers: {
                    "Content-Type": "application/JSON",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
                  .then((r) => r.json())
                  .then((data) => {
                    setPinnedPosts(data);
                    setShowPinned(!!data.length);
                  });
              }
            });
          };

          return isStaff() ? (
            <IconButton
              aria-label={value ? "Unpin post" : "Pin post"}
              icon={value ? <RiPushpin2Fill /> : <RiPushpin2Line />}
              backgroundColor="white"
              onClick={handlePinUnpin}
            />
          ) : null;
        },
        width: "10%",
      },
      {
        Header: "Post",
        accessor: "title",
        Cell: ({
          cell: {
            row: {
              original: { description, isendorsed, post_id },
            },
            value,
          },
        }) => {
          let unformattedDesc;
          if (description) {
            unformattedDesc = description.replace(/<[^>]+>/g, " ");
            unformattedDesc =
              unformattedDesc.length > 120
                ? unformattedDesc.substring(0, 119) + "..."
                : unformattedDesc;
            unformattedDesc = `<p>${unformattedDesc}</p>`;
          }

          return (
            <>
              <Flex alignItems="center">
                <Link
                  as={RouterLink}
                  color="blue.500"
                  lineHeight="18px"
                  to={`/course-page/${code}/forums/${post_id}`}
                >
                  {value}
                </Link>
                {isendorsed && (
                  <Tooltip
                    label="This post is endorsed by staff"
                    hasArrow
                    placement="bottom"
                    ml="8px"
                    w="90px"
                    textAlign="center"
                    fontSize="12px"
                  >
                    <Center as="span" verticalAlign="middle">
                      <Icon
                        h="13px"
                        w="13px"
                        ml="8px"
                        color="green"
                        as={FaCheckCircle}
                      />
                    </Center>
                  </Tooltip>
                )}
              </Flex>
              <Text
                fontSize="13px"
                lineHeight="16px"
                mt="4px"
                dangerouslySetInnerHTML={{ __html: unformattedDesc }}
              ></Text>
            </>
          );
        },
        width: '70%',
      },
      {
          Header: 'Date Created',
          accessor: 'published_date',
          Cell: (({ cell: { value } }) => {
              const date = new Date(value)
              const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
              return String(dateString)
          })
      },
      {
        Header: "Replies",
        accessor: "replies",
        Cell: ({ cell: { value } }) => {
          return (
            <Box textAlign="center">{value[0] === null ? 0 : value.length}</Box>
          );
        },
      },
      {
        Header: "Comments",
        accessor: "comments",
        Cell: ({ cell: { value } }) => {
          return (
            <Box textAlign="center">{value[0] === null ? 0 : value.length}</Box>
          );
        },
      },
      {
        Header: "Upvotes",
        accessor: "num_of_upvotes",
        Cell: ({ cell: 
          { 
            row: {
              original: { post_id },
            },
            value
          } }) => {
          // {/* if user is in upvoters list, show filled icon */}
          // {/* TODO: handle upvote click */}
          return (
            <UpvoteButton value={value} code={code} postId={post_id} />
          );
        },
      },
    ],
    [code, setPinnedPosts, setPosts, setShowPinned]
  );

  const orderedPosts = useMemo(() => postData, [postData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: orderedPosts,
        initialState: {
          sortBy: [
            {
              id: "published_date",
              desc: true,
            },
          ],
        },
      },
      useSortBy
    );

  return (
    <Table variant="simple" {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                userSelect="none"
                width={column.width}
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                <Flex alignItems="center" position="relative">
                  {column.render("Header")}
                  <span style={{ position: "absolute", right: "-16px" }}>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ChevronDownIcon ml={1} w={4} h={4} />
                      ) : (
                        <ChevronUpIcon ml={1} w={4} h={4} />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </Flex>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <Td {...cell.getCellProps()} fontSize="15px">
                    {cell.render("Cell")}
                  </Td>
                );
              })}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

export default PostTable;
