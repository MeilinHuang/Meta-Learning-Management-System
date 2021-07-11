export const backend_url = "localhost:8000/";

export function get_topics_url(topicGroupName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic";
}