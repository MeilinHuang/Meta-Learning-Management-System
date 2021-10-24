import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import Announcement from "../components/dashboard/Announcement/Announcement";

function CourseAnnouncementPage({
  match: {
    params: { code, id },
  },
}) {
  const [post, setPost] = useState({});

  useEffect(() => {
    fetch(`http://localhost:8000/${code}/announcement/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        fetch(`http://localhost:8000/user/${data.author}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((r) => r.json())
          .then((author) => {
            const withAuthor = { ...data, username: author.user_name };
            setPost(withAuthor);
          });
      });
  }, [code, id]);

  return (
    <>
      <Breadcrumb separator=">">
        <BreadcrumbItem>
          <BreadcrumbLink
            as={RouterLink}
            to={`/course-page/${code}`}
            fontWeight="bold"
          >
            Announcements
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">{post.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Announcement announcement={post} course={code} isAnnouncementPage />
    </>
  );
}

export default CourseAnnouncementPage;
