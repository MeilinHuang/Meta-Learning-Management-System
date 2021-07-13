export const backend_url = "http://localhost:8000/";

export const topic_group_url = backend_url + "topicGroup";

export function get_topics_url(topicGroupName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic";
}

