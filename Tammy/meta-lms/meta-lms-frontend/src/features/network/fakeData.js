// var globalData = {
//     'nodes': [
//         {
//             'id': 1,
//             'label': "Pointers",
//             'prerequisites': ["Variables", "Structs"],
//             'description': "Lorem Ipsum",
//             'preparation': {
//                 'attachments': ["prereading.pdf"]
//             },
//             'content': {
//                 'attachments': ["slides.pdf", "lecture.mp4"]
//             },
//             'practice': {
//                 'attachments': ["exercise_set.pdf"]
//             },
//             'assessment': {
//                 'attachments': ["quiz.pdf"]
//             },
//             'group': 'C Programming'
//         },
//         {
//             'id': 2,
//             'label': "Struct",
//             'prerequisites': ["Variables"],
//             'description': "Lorem Ipsum",
//             'preparation': {
//                 'attachments': ["prereading.pdf"]
//             },
//             'content': {
//                 'attachments': ["slides.pdf", "lecture.mp4"]
//             },
//             'practice': {
//                 'attachments': ["exercise_set.pdf"]
//             },
//             'assessment': {
//                 'attachments': ["quiz.pdf"]
//             }, 'group': 'C Programming'
//         },
//         {
//             'id': 3,
//             'label': "Memory Allocation",
//             'prerequisites': ["Pointers"],
//             'description': "Lorem Ipsum",
//             'preparation': {
//                 'attachments': ["prereading.pdf"]
//             },
//             'content': {
//                 'attachments': ["slides.pdf", "lecture.mp4"]
//             },
//             'practice': {
//                 'attachments': ["exercise_set.pdf"]
//             },
//             'assessment': {
//                 'attachments': ["quiz.pdf"]
//             }, 'group': 'C Programming'
//         },
//         {
//             'id': 4,
//             'label': "Variables",
//             'prerequisites': ["Variables", "Structs"],
//             'description': "Lorem Ipsum",
//             'preparation': {
//                 'attachments': ["prereading.pdf"]
//             },
//             'content': {
//                 'attachments': ["slides.pdf", "lecture.mp4"]
//             },
//             'practice': {
//                 'attachments': ["exercise_set.pdf"]
//             },
//             'assessment': {
//                 'attachments': ["quiz.pdf"]
//             }, 'group': 'C Programming'
//         },
//         {
//             'id': 5,
//             'label': "Linked List",
//             'prerequisites': ["Pointers", "Structs"],
//             'description': "Lorem Ipsum",
//             'preparation': {
//                 'attachments': ["prereading.pdf"]
//             },
//             'content': {
//                 'attachments': ["slides.pdf", "lecture.mp4"]
//             },
//             'practice': {
//                 'attachments': ["exercise_set.pdf"]
//             },
//             'assessment': {
//                 'attachments': ["quiz.pdf"]
//             }, 'group': 'C Programming'
//         },
//         {
//             'id': 6,
//             'label': "Doubly Linked List",
//             'prerequisites': ["Linked List"],
//             'description': "Lorem Ipsum",
//             'preparation': {
//                 'attachments': ["prereading.pdf"]
//             },
//             'content': {
//                 'attachments': ["slides.pdf", "lecture.mp4"]
//             },
//             'practice': {
//                 'attachments': ["exercise_set.pdf"]
//             },
//             'assessment': {
//                 'attachments': ["quiz.pdf"]
//             }, 'group': 'Data Structures and Algorithms'
//         },
//         {
//             'id': 7,
//             'label': "Binary Tree",
//             'prerequisites': ["Linked List"],
//             'description': "Lorem Ipsum",
//             'preparation': {
//                 'attachments': ["prereading.pdf"]
//             },
//             'content': {
//                 'attachments': ["slides.pdf", "lecture.mp4"]
//             },
//             'practice': {
//                 'attachments': ["exercise_set.pdf"]
//             },
//             'assessment': {
//                 'attachments': ["quiz.pdf"]
//             }, 'group': 'Data Structures and Algorithms'
//         }
//     ],
//     'links': [
//         { 'source': "4", 'target': "2" },
//         { 'source': "4", 'target': "1" },
//         { 'source': "2", 'target': "1" },
//         { 'source': "1", 'target': "3" },
//         { 'source': "1", 'target': "5" },
//         { 'source': "2", 'target': "5" },
//         { 'source': "3", 'target': "5" },
//         { 'source': "5", 'target': "6" },
//         { 'source': "5", 'target': "7" }
//     ]
// }


export const helper = (svgElement, radius) => {
    // console.log('svgElement', svgElement);
    svgElement.attr('width', window.innerWidth)
        .attr('height', window.innerHeight)

    // .call(zoom);
    svgElement.append("circle")
        .attr("cx", 150)
        .attr("cy", 70)
        .attr("r", radius);
    svgElement.append("circle")
        .attr("cx", 2).attr("cy", 2).attr("r", 40).style("fill", "blue");
}

// https://stackoverflow.com/questions/40731422/updating-a-d3-chart-within-react-redux
export const removeAll = () => {
    const chart = document.getElementById('network')
    while (chart && chart.hasChildNodes())
        chart.removeChild(chart.lastChild);

}