import React from "react"
import Header from "../components/Header.js"

function CoursePage() {
    //currently hardcoded sidebar content
    const links = ["Home", "Course Outline", "Content", "Forums", "Support"]
    return (
        <div>
            <Header sideBarLinks={links}></Header>
        </div>
    )
}

export default CoursePage