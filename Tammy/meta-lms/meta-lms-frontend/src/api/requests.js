
import { URL, token } from './global.js';


// TODO: make all error popups be signalled from here

export const getAllTopicsRequest = (disciplineVal) => {
    console.log('getting all topics for discipline: ', disciplineVal)
    const options = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Token ' + token
        }
    }

    return fetch(`${URL}/topic/?` + new URLSearchParams({
        discipline: disciplineVal,
    }), options)
        .then((response) => {
            return response.json().then((data) => {
                if (response.status === 200) {
                    return data;
                    // return data.posts;
                } else {
                    console.log('Error: ', data.message)
                    // showErrorPopup(data.message);
                    alert(data.message);
                    return null;
                }
            });
        })
        .catch((error) => console.log(error));
}

export const getAllPrerequisitesRequest = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Token ' + token
        }
    }

    return fetch(`${URL}/topic/prerequisites`, options)
        .then((response) => {
            return response.json().then((data) => {
                if (response.status === 200) {
                    return data.prerequisites;
                    // return data.posts;
                } else {
                    console.log('Error: ', data.message)
                    // showErrorPopup(data.message);
                    alert(data.message);
                    return null;
                }
            });
        })
        .catch((error) => console.log(error));
}

export const postTopicRequest = async (title, description, group, discipline) => {
    console.log('postTopicRequest')
    const options = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Token ' + token
        },
        body: JSON.stringify({
            'title': title,
            // prerequisites: prereqs,
            'description': description,
            'group': group,
            'discipline': discipline
        })
    }

    return fetch(`${URL}/topic/`, options)
        .then((response) => {
            return response.json().then((data) => {
                if (response.status === 200) {
                    return data.topic_id;
                    // return data.posts;
                } else {
                    console.log('Error: ', data.message)
                    // showErrorPopup(data.message);
                    alert(data.message);
                    return null;
                }
            });
        })
        .catch((error) => console.log(error));
}

export const postPrerequisitesRequest = (topicId, prereqs) => {
    console.log('yay')
    console.log('posting prereqs: ', prereqs)
    const options = {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Token ' + token
        },
        body: JSON.stringify({
            'prerequisites': prereqs
        })
    }
    console.log('puttting!')
    return fetch(`${URL}/topic/prerequisites?` + new URLSearchParams({
        id: topicId,
    })
        , options)
        .then((response) => {
            return response.json().then((data) => {
                if (response.status === 200) {
                    return data;
                    // return data.posts;
                } else {
                    console.log('Error: ', data.message)
                    // showErrorPopup(data.message);
                    alert(data.message);
                    return null;
                }
            });
        })
        .catch((error) => console.log(error));
}

export const deleteTopicRequest = (topicId) => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Token ' + token
        }
    }

    return fetch(`${URL}/topic/?` + new URLSearchParams({
        id: topicId,
    })
        , options)
        .then((response) => {
            return response.json().then((data) => {
                if (response.status === 200) {
                    return data;
                    // return data.posts;
                } else {
                    console.log('Error: ', data.message)
                    // showErrorPopup(data.message);
                    alert(data.message);
                    return null;
                }
            });
        })
        .catch((error) => console.log(error));
}


export const putTopicRequest = (topicId, title, description, group, discipline) => {
    const options = {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Token ' + token
        },
        body: JSON.stringify({
            "title": title,
            "description": description,
            "group_name": group,
            "discipline": discipline
        })
    }

    return fetch(`${URL}/topic/?` + new URLSearchParams({
        id: topicId,
    })
        , options)
        .then((response) => {
            return response.json().then((data) => {
                if (response.status === 200) {
                    return data;
                    // return data.posts;
                } else {
                    console.log('Error: ', data.message)
                    // showErrorPopup(data.message);
                    alert(data.message);
                    return null;
                }
            });
        })
        .catch((error) => console.log(error));
}

export const postMaterialsRequest = (topicId, category, materials) => {
    console.log('postMaterialsRequest', topicId, category, materials)
    const options = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Token ' + token
        },
        body: JSON.stringify({
            'category': category,
            'materials': materials
        })
    }

    return fetch(`${URL}/material/?` + new URLSearchParams({
        id: topicId,
    }), options)
        .then((response) => {
            return response.json().then((data) => {
                if (response.status === 200) {
                    return data.message;
                    // return data.posts;
                } else {
                    console.log('Error: ', data.message)
                    // showErrorPopup(data.message);
                    alert(data.message);
                    return null;
                }
            });
        })
        .catch((error) => console.log(error));
}

export const deleteMaterialRequest = (topicId, filename, category) => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Token ' + token
        }
    }

    return fetch(`${URL}/material/?` + new URLSearchParams({
        id: topicId,
        category: category,
        name: filename
    })
        , options)
        .then((response) => {
            return response.json().then((data) => {
                if (response.status === 200) {
                    return data;
                    // return data.posts;
                } else {
                    console.log('Error: ', data.message)
                    // showErrorPopup(data.message);
                    alert(data.message);
                    return null;
                }
            });
        })
        .catch((error) => console.log(error));
}



export const getMaterialRequest = (topicId, filename, category) => {
    console.log('get material request!')
    const options = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Token ' + token
        }
    }

    return fetch(`${URL}/material/?` + new URLSearchParams({
        id: topicId,
        category: category,
        filename: filename
    })
        , options)
        .then((response) => {
            return response.json().then((data) => {
                if (response.status === 200) {
                    return data.file;
                    // return data.posts;
                } else {
                    console.log('Error: ', data.message)
                    // showErrorPopup(data.message);
                    alert(data.message);
                    return null;
                }
            });
        })
        .catch((error) => console.log(error));
}


export const getTopicExportRequest = (topicId, exportType) => {
    console.log('get export zip request!')
    const options = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Token ' + token
        }
    }

    return fetch(`${URL}/topic/export?` + new URLSearchParams({
        id: topicId,
        export_type: exportType// zip or cc
    })
        , options)
        .then((response) => {
            return response.json().then((data) => {
                if (response.status === 200) {
                    return data;
                    // return data.posts;
                } else {
                    console.log('Error: ', data.message)
                    // showErrorPopup(data.message);
                    alert(data.message);
                    return null;
                }
            });
        })
        .catch((error) => console.log(error));
}

// // gets one topic
// export const getTopicRequest = (topicId) => {
//     const options = {
//         method: 'GET',
//         headers: {
//             'Content-type': 'application/json',
//             'Authorization': 'Token ' + token
//         }
//     }

//     return fetch(`${URL}/topic/?` + new URLSearchParams({
//         id: topicId,
//     })
//         , options)
//         .then((response) => {
//             return response.json().then((data) => {
//                 if (response.status === 200) {
//                     return data.topics[0];
//                     // return data.posts;
//                 } else {
//                     console.log('Error: ', data.message)
//                     // showErrorPopup(data.message);
//                     return null;
//                 }
//             });
//         })
//         .catch((error) => console.log(error));
// }