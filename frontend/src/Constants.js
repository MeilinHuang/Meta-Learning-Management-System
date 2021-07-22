export const backend_url = "http://localhost:8000/";

export const topic_group_url = backend_url + "topicGroup";

export function get_topics_url(topicGroupName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic";
}

export function post_new_topic_url(topicGroupName, newTopicName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic/" + newTopicName;
}

export function delete_topic_url(topicGroupName, newTopicName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic/" + newTopicName;
}

export function post_new_prereq(topicGroupName, newTopicName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic/" + newTopicName + "/prerequisite";
}

export function get_prereqs(topicGroupName, newTopicName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic/" + newTopicName + "/prerequisite";
}

export function get_topic_groups() {
    return backend_url + "topicGroup/";
}
