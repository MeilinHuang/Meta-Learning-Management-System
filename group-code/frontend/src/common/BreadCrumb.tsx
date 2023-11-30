// import React, { useEffect, useState } from "react";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import { useNavigate } from "react-router-dom";
// import { useBreadcrumb } from "content/BreadCrumbContext";

// interface BreadCrumbProps {
//   currName: string;
//   currPath: string;
// }

// export default function BreadCrumb({ currName, currPath }: BreadCrumbProps) {
//   const navigate = useNavigate();
//   const { breadcrumbHistory, setBreadcrumbHistory } = useBreadcrumb()

//   useEffect(() => {
//     if (currName && currPath) {
//       // Push the current breadcrumb to the history
//       breadcrumbHistory.push({ name: currName, path: currPath })
//       setBreadcrumbHistory(breadcrumbHistory);
//     }
//   }, [currName, currPath]);

//   const handleClick = (
//     event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
//     path: string
//   ) => {
//     event.preventDefault();
//     console.info("You clicked a breadcrumb.");
//     navigate(path);
//   };

//   return (
//     <div role="presentation">
//       <Breadcrumbs aria-label="breadcrumb">
//         {breadcrumbHistory.map((elem, index) => (
//           <Link
//             key={elem.path}
//             onClick={(event) => handleClick(event, elem.path)}
//             underline="hover"
//             color={
//               index === breadcrumbHistory.length - 1
//                 ? "text.primary"
//                 : "inherit"
//             }
//             href={elem.path}
//             aria-current={
//               index === breadcrumbHistory.length - 1 ? "page" : undefined
//             }
//           >
//             {elem.name}
//           </Link>
//         ))}
//       </Breadcrumbs>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import Breadcrumbs from "@mui/material/Breadcrumbs";
// import Link from "@mui/material/Link";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useBreadcrumb } from "content/BreadCrumbContext";
// import { capitalise } from "content/contentHelpers";

// interface BreadCrumbProps {
//   currName: string;
//   currPath: string;
// }

// export default function BreadCrumb({ currName, currPath }: BreadCrumbProps) {
//   const navigate = useNavigate();

//   // const { breadcrumbHistory, setBreadcrumbHistory } = useBreadcrumb()
//   const param = useParams();

//   const path1 = [
//     { name: "Assessment Overview", path: "assessmentMain" },
//     { name: param.topicName || "", path: "assessmentDetail" },
//     { name: param.assessmentName || "", path: "assessmentAttemptsList" },
//   ]

//   const path2 = [
//     { name: "Topic Overview", path: "assessmentOverviewEdit" },
//     { name: param.topicName || "", path: "assessmentDetailEdit" },
//     { name: param.assessmentName || "", path: "assessmentAttempsTestOverview" }
//   ]

//   const [curr, setCurr] = useState([{ name: "", path: "" }])
//   const foundIndex1 = path1.findIndex((item) => item.path === currPath.split("/")[1]);
//   const foundIndex2 = path2.findIndex((item) => item.path === currPath.split("/")[1]);

//   if (foundIndex1 !== -1) {
//     setCurr(path1.slice(0, foundIndex1))
//   }

//   if (foundIndex2 !== -1) {
//     setCurr(path2.slice(0, foundIndex2))
//   }

//   const handleClick = (
//     event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
//     path: string
//   ) => {
//     event.preventDefault();
//     console.info("You clicked a breadcrumb.");
//     navigate(path);
//   };

//   return (
//     <div role="presentation">
//       <Breadcrumbs aria-label="breadcrumb">
//         {curr.map((elem, index) => (
//           <Link
//             key={elem.path}
//             onClick={(event) => handleClick(event, elem.path)}
//             underline="hover"
//             color={
//               index === curr.length - 1
//                 ? "text.primary"
//                 : "inherit"
//             }
//             href={elem.path}
//             aria-current={
//               index === curr.length - 1 ? "page" : undefined
//             }
//           >
//             {elem.name}
//           </Link>
//         ))}
//       </Breadcrumbs>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useBreadcrumb } from "content/BreadCrumbContext";
import { capitalise } from "content/contentHelpers";

export default function BreadCrumb() {
  const navigate = useNavigate(); // Get the history object

  const location = useLocation();
  // const [breadcrumbHistory, setBreadcrumbHistory] = useState([
  //   { name: "", path: "" },
  // ]);
  const {
    breadcrumbHistory,
    setBreadcrumbHistory,
    updateBreadcrumb,
  } = useBreadcrumb();
  // const currentPath = location.state || [];
  // const updatedPaths = [...currentPath, { name: "Assessment Overview", path: "/assessmentMain" }];
  // name: location.pathname.split('/').pop(), path: location.pathname

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    path: string
  ) => {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
    navigate(path);
  };

  // const currentPath = location.pathname;

  // const updateBreadcrumbs = () => {
  //   const newBreadcrumbHistory = breadcrumbHistory.slice();
  //   newBreadcrumbHistory.push({ name: currentPath, path: currentPath });
  //   updateBreadcrumb(newBreadcrumbHistory);
  // }

  const changeName = () => {
    const currentPath = location.pathname;
    const name = currentPath.split("/")[1].toString();

    if (name === "assessmentMain") {
      return "Assessment Overview";
    } else if (name === "assessmentOverviewEdit") {
      return "Topic Overview"
    } else if (name === "assessmentDetail") {
      return (
        capitalise(decodeURIComponent(currentPath.split("/")[3].toString())) +
        " Assessment"
      );
    } else if (name === "assessmentDetailEdit") {
      return (
        capitalise(decodeURIComponent(currentPath.split("/")[2].toString())));
    } else if (name === "assessmentAttemptsList") {
      console.log(
        "the fifth one is: " +
        decodeURIComponent(currentPath.split("/")[5].toString())
      );
      return capitalise(
        decodeURIComponent(currentPath.split("/")[5].toString())
      );
    } else if (name === "assessmentAttemptDetail") {
      return "Assessment Attempt Detail";
    } else if (name === "assessmentAttempsTestOverview") {
        return "Mark Assessment"
    }
    return name;
  };

  const currentBreadcrumbData = {
    name: changeName(),
    path: location.pathname,
  };

  useEffect(() => {
    if (currentBreadcrumbData.name === "Assessment Overview" && breadcrumbHistory.find((item) => item.name === "Topic Overview")) {
      updateBreadcrumb([currentBreadcrumbData])
    } else if (currentBreadcrumbData.name === "Topic Overview" && breadcrumbHistory.find((item) => item.name === "Assessment Overview")) {
      updateBreadcrumb([currentBreadcrumbData])
    } else if (currentBreadcrumbData.name === "Assessment Attempt Detail") {
      return;
    } else if (
      !breadcrumbHistory.find(
        (item) => item.name === currentBreadcrumbData.name
      )
    ) {
      updateBreadcrumb([...breadcrumbHistory, currentBreadcrumbData]);
    } else if (
      breadcrumbHistory.find((item) => item.name === currentBreadcrumbData.name)
    ) {
      const currentIndex = breadcrumbHistory.indexOf(currentBreadcrumbData);
      updateBreadcrumb(breadcrumbHistory.slice(0, currentIndex));
    }
  }, [location.pathname]);

  console.log("whole");
  console.log(breadcrumbHistory);
  console.log(location);
  console.log("=======end========");

  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbHistory.map((elem, index) => (
          <Link
            key={elem.path}
            onClick={(event) => handleClick(event, elem.path)}
            underline="hover"
            color={
              index === breadcrumbHistory.length - 1
                ? "text.primary"
                : "inherit"
            }
            href={elem.path}
            aria-current={
              index === breadcrumbHistory.length - 1 ? "page" : undefined
            }
          >
            {elem.name}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}
