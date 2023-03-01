import React, { useEffect, useState } from "react";
import CategoryContent from "./CategoryContent.js"

function CategoriesList({ topic, course, course_id }) {
    const [content, setContent] = useState({"Preparation": [], "Content": [], "Practice": [], "Assessments": []})

    useEffect(() => {
        let cpy = {"Preparation": [], "Content": [], "Practice": [], "Assessments": []}
        topic.course_materials.map(file => {
            if (file.type === "assessment") {
                cpy["Assessments"].push(file)
            }
            else {
                cpy[file.type[0].toUpperCase() + file.type.slice(1)].push(file)
            }
            return file
        })
        setContent(cpy)
    }, [topic.course_materials])
    
    return Object.keys(content).map(category => {
        return (
            <CategoryContent key={category + "-" + course.name} topic={topic} category={category} content={content[category]} course={course} course_id={course_id}></CategoryContent>
        );
    })
}

export default CategoriesList;
