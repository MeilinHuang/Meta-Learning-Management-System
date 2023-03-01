export const backend_url = "http://localhost:8000/";

export const topic_group_url = backend_url + "topicGroup";

export function get_topics_url(topicGroupName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic";
}

export function get_all_topics() {
    return backend_url + "topicGroup/all";
}

export function post_new_topic_url(topicGroupName, newTopicName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic/" + newTopicName;
}

export function delete_topic_url(topicGroupName, newTopicName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic/" + newTopicName;
}

export function post_topic_tag(topicGroupName, topicName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic/" + topicName + "/tag";
}

export function post_new_prereq(topicGroupName, newTopicName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic/" + newTopicName + "/prerequisite";
}

export function get_prereqs(topicGroupName, newTopicName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic/" + newTopicName + "/prerequisite";
}

export function delete_prereqs(topicGroupName, newTopicName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic/" + newTopicName + "/prerequisite";
}

export function add_prereqs(topicGroupName, topicName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic/" + topicName + "/prerequisite";
}

export function get_topic_group(topicGroupName) {
    return backend_url + "topicGroup/" + topicGroupName;
}

export function get_topic_groups() {
    return backend_url + "topicGroup/";
}

export function update_topic(topicGroupName, topicName) {
    return backend_url + "topicGroup/" + topicGroupName + "/topic/" + topicName;

}

export function new_topic_group(topicGroupName) {
    return backend_url + "topicGroup/" + topicGroupName;
}
