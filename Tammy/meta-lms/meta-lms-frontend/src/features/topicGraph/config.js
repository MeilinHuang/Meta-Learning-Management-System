const myCustomLabelBuilder = (node) => {
    return node.title;
}

export const config = {
    height: window.innerHeight,
    width: window.innerWidth,
    nodeHighlightBehavior: true,
    initialZoom: 2,
    focusZoom: 5,
    node: {
        color: "#6FB6E5",
        size: 120,
        highlightStrokeColor: "blue",
        "mouseCursor": "pointer",
        "symbolType": "circle",
        "labelProperty": myCustomLabelBuilder,
        "labelPosition": "bottom"
    },
    link: {
        highlightColor: "grey",
    },

    "focusAnimationDuration": 1,
    "minZoom": 0.1,
    "maxZoom": 8,
    "directed": true,
    "automaticRearrangeAfterDropNode": true,
};

export const topics = [
    {
        id: "1",
        title: "Pointers",
        prereqs: ["Variables", "Structs"],
        description: "Lorem Ipsum",
        preparation: {
            attachments: ["prereading.pdf"]
        },
        content: {
            attachments: ["slides.pdf", "lecture.mp4"]
        },
        practice: {
            attachments: ["exercise_set.pdf"]
        },
        assessment: {
            attachments: ["quiz.pdf"]
        }
    },
    {
        id: "2",
        title: "Struct",
        prereqs: ["Variables"],
        description: "Lorem Ipsum",
        preparation: {
            attachments: ["prereading.pdf"]
        },
        content: {
            attachments: ["slides.pdf", "lecture.mp4"]
        },
        practice: {
            attachments: ["exercise_set.pdf"]
        },
        assessment: {
            attachments: ["quiz.pdf"]
        }
    },
    {
        id: "3",
        title: "Memory Allocation",
        prereqs: ["Pointers"],
        description: "Lorem Ipsum",
        preparation: {
            attachments: ["prereading.pdf"]
        },
        content: {
            attachments: ["slides.pdf", "lecture.mp4"]
        },
        practice: {
            attachments: ["exercise_set.pdf"]
        },
        assessment: {
            attachments: ["quiz.pdf"]
        }
    },
    {
        id: "4",
        title: "Variables",
        prereqs: ["Variables", "Structs"],
        description: "Lorem Ipsum",
        preparation: {
            attachments: ["prereading.pdf"]
        },
        content: {
            attachments: ["slides.pdf", "lecture.mp4"]
        },
        practice: {
            attachments: ["exercise_set.pdf"]
        },
        assessment: {
            attachments: ["quiz.pdf"]
        }
    },
];

export const prereqs = [
    { source: "4", target: "2" },
    { source: "4", target: "1" },
    { source: "2", target: "1" },
    { source: "1", target: "3" },
];
