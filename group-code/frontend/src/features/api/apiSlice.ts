import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/',
    prepareHeaders: (headers) => {
      headers.set(
        'Authorization',
        `Bearer ${localStorage.getItem('access_token')}`
      );
      return headers;
    }
  }), // TODO: change to production URL
  tagTypes: [
    'Threads',
    'Posts',
    'ThreadVote',
    'PostVote',
    'Pathways',
    'Topics',
    'Topic',
    'Roles',
    'UserRoles',
    'TopicRole',
    'Superuser',
    'Prerequisite',
    'Groups',
    'Group',
    'Resources',
    'Resource'
  ],
  endpoints: (builder) => ({
    // query: 定义一个用于获取数据的 action 和 reducer。
    // mutation: 定义一个用于修改数据的 action 和 reducer。包括添加也属于修改。
    // subscription: 定义一个用于订阅数据的 action 和 reducer。
    // Account endpoints
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST'
      }),
      invalidatesTags: ['UserRoles', 'Superuser', 'TopicRole', 'Pathways', 'Topics', 'Topic']
    }),
    getTopicPermission: builder.query({
      query: ({ topic_id, permission }) => ({
        url: `/topic/${topic_id}/check_permission?flags=${permission}`
      }),
      providesTags: ['TopicRole']
    }),
    IsSuperuser: builder.query({
      query: () => ({
        url: `/is_superuser`
      }),
      providesTags: ['Superuser']
    }),
    // Forum endpoints
    getForum: builder.query({
      query: (forumId) => `/forum/${forumId}`
    }),
    getThreads: builder.query({
      query: ({ sectionId, limit, offset }) =>
        `/forum/section/${sectionId}?limit=${limit}&offset=${offset}`,
      providesTags: ['Threads']
    }),
    createThread: builder.mutation({
      query: ({ section_id, title, content }) => ({
        url: '/forum/thread',
        method: 'POST',
        body: { section_id, title, content }
      }),
      invalidatesTags: ['Threads']
    }),
    getPost: builder.query({
      query: (postId) => `/forum/post/${postId}`,
      providesTags: (result, error, arg) => [{ type: 'Posts', id: arg }]
    }),
    getPosts: builder.query({
      query: ({ postIds }) => {
        let buildingUrl = '/forum/post/multiple';
        let counter = 0;
        if (postIds === undefined) {
          return buildingUrl;
        }
        postIds.forEach((id: any) => {
          if (counter === 0) {
            buildingUrl += `?ids=${id}`;
          } else {
            buildingUrl += `&ids=${id}`;
          }
          counter += 1;
        });
        return buildingUrl;
      },
      providesTags: (result = [], error, arg) => [
        'Posts',
        ...result.map(({ id }: { id: number }) => ({ type: 'Posts', id }))
      ]
    }),
    createPost: builder.mutation({
      query: ({ thread_id, parent_id, content }) => ({
        url: '/forum/post',
        method: 'POST',
        body: { thread_id, parent_id, content }
      }),
      invalidatesTags: (result, error, arg) => [
        'Threads',
        'Posts',
        { type: 'Threads', id: arg.thread_id }
      ]
    }),
    upvoteThread: builder.mutation({
      query: (thread_id) => ({
        url: `/forum/upvote/thread?thread_id=${thread_id}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Threads', id: arg },
        { type: 'ThreadVote', id: arg }
      ]
    }),
    downvoteThread: builder.mutation({
      query: (thread_id) => ({
        url: `/forum/downvote/thread?thread_id=${thread_id}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Threads', id: arg },
        { type: 'ThreadVote', id: arg }
      ]
    }),
    checkvoteThread: builder.query({
      query: (thread_id) => `/forum/checkvote/thread?thread_id=${thread_id}`,
      providesTags: (result, error, arg) => [{ type: 'ThreadVote', id: arg }]
    }),
    checkvotePost: builder.query({
      query: (post_id) => `/forum/checkvote/post?post_id=${post_id}`,
      providesTags: (result, error, arg) => [{ type: 'PostVote', id: arg }]
    }),
    upvotePost: builder.mutation({
      query: (post_id) => ({
        url: `/forum/upvote/post?post_id=${post_id}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Posts', id: arg },
        { type: 'PostVote', id: arg }
      ]
    }),
    downvotePost: builder.mutation({
      query: (post_id) => ({
        url: `/forum/downvote/post?post_id=${post_id}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Posts', id: arg },
        { type: 'PostVote', id: arg }
      ]
    }),
    makeThreadSticky: builder.mutation({
      query: (thread_id) => ({
        url: `/forum/mark/sticky?thread_id=${thread_id}`,
        method: 'POST'
      }),
      invalidatesTags: ['Threads']
    }),
    makeThreadUnSticky: builder.mutation({
      query: (thread_id) => ({
        url: `/forum/mark/sticky/remove?thread_id=${thread_id}`,
        method: 'POST'
      }),
      invalidatesTags: ['Threads']
    }),
    reportPost: builder.mutation({
      query: (post_id) => ({
        url: `/forum/mark/reported?post_id=${post_id}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Posts', id: arg }]
    }),
    clearReportPost: builder.mutation({
      query: (post_id) => ({
        url: `/forum/mark/reported/remove?post_id=${post_id}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Posts', id: arg }]
    }),
    makePostAsAnswer: builder.mutation({
      query: ({ thread_id, post_id }) => ({
        url: `/forum/mark/answered?post_id=${post_id}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Posts', id: arg.post_id },
        { type: 'Threads', id: arg.thread_id }
      ]
    }),
    removePostAsAnswer: builder.mutation({
      query: ({ thread_id, post_id }) => ({
        url: `/forum/mark/answered/remove?post_id=${post_id}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Posts', id: arg.post_id },
        { type: 'Threads', id: arg.thread_id }
      ]
    }),
    makePostEndorsed: builder.mutation({
      query: ({ thread_id, post_id }) => ({
        url: `/forum/mark/endorsed?post_id=${post_id}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Posts', id: arg.post_id },
        { type: 'Threads', id: arg.thread_id }
      ]
    }),
    makePostUnEndorsed: builder.mutation({
      query: ({ thread_id, post_id }) => ({
        url: `/forum/mark/endorsed/remove?post_id=${post_id}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Posts', id: arg.post_id },
        { type: 'Threads', id: arg.thread_id }
      ]
    }),
    deletePost: builder.mutation({
      query: ({ post_id, thread_id }) => ({
        url: `/forum/post?post_id=${post_id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Posts', id: arg.post_id },
        { type: 'Threads', id: arg.thread_id }
      ]
    }),
    deleteThread: builder.mutation({
      query: (thread_id) => ({
        url: `/forum/thread?thread_id=${thread_id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => [
        'Threads',
        { type: 'Threads', id: arg }
      ]
    }),
    // Topic tree endpoints
    getEnrolledUsers: builder.query({
      query: ({ topic_id }) => `/${topic_id}/users`
    }),
    getPathways: builder.query({
      query: (user) => `/pathways?user=${user}`,
      providesTags: ['Topics', 'Pathways', 'Prerequisite']
    }),
    getPathway: builder.query({
      query: ({ pathway_id, user }) => `/pathway/${pathway_id}?user=${user}`,
      providesTags: ['Topics', 'Pathways', 'Prerequisite']
    }),
    createPathway: builder.mutation({
      query: ({ name, core, electives }) => ({
        url: 'create_pathway',
        method: 'POST',
        body: {
          name,
          core,
          electives
        }
      }),
      invalidatesTags: ['Pathways']
    }),
    deletePathway: builder.mutation({
      query: ({ pathway_id }) => ({
        url: 'delete_pathway',
        method: 'DELETE',
        body: {
          pathway_id,
        }
      }),
      invalidatesTags: ['Pathways']
    }),
    editPathway: builder.mutation({
      query: ({ pathway_name, pathway_id, core, electives }) => ({
        url: 'edit_pathway',
        method: 'PUT',
        body: {
          pathway_name,
          pathway_id,
          core,
          electives
        }
      }),
      invalidatesTags: ['Topics', 'Pathways']
    }),
    createTopic: builder.mutation({
      query: ({ name, topic_group_id, image_url, archived, description }) => ({
        url: 'create_topic',
        method: 'POST',
        body: {
          name,
          topic_group_id,
          image_url,
          archived,
          description
        }
      }),
      invalidatesTags: ['Topics']
    }),
    editTopic: builder.mutation({
      query: ({ id, name, topic_group_id, image_url, description, sets }) => ({
        url: 'edit_topic',
        method: 'PUT',
        body: {
          id,
          name,
          topic_group_id,
          image_url,
          description,
          sets: sets
        }
      }),
      invalidatesTags: ['Topics', 'Topic']
    }),
    archiveTopic: builder.mutation({
      query: ({ id, archive }) => ({
        url: 'archive_topic',
        method: 'PUT',
        body: {
          id,
          archive
        }
      }),
      invalidatesTags: ['Topics', 'Topic']
    }),
    deleteTopic: builder.mutation({
      query: ({ id }) => ({
        url: 'delete_topic',
        method: 'DELETE',
        body: {
          id
        }
      }),
      invalidatesTags: ['Topics']
    }),
    createPrerequisite: builder.mutation({
      query: ({ topic_id, amount, choices }) => ({
        url: 'create_prerequisite',
        method: 'POST',
        body: { topic: topic_id, amount, choices }
      }),
      invalidatesTags: ['Topics', 'Topic', 'Prerequisite', 'Pathways']
    }),
    editPrerequisite: builder.mutation({
      query: ({ prerequisite_id, topic, amount, choices }) => ({
        url: 'edit_prerequisite',
        method: 'PUT',
        body: {
          prerequisite_id,
          topic,
          amount,
          choices
        }
      }),
      invalidatesTags: ['Topics', 'Prerequisite']
    }),
    getPrerequisiteInfo: builder.query({
      query: ({ prerequisite_id }) => `/prerequisite/${prerequisite_id}`,
      providesTags: ['Prerequisite']
    }),
    deletePrerequisite: builder.mutation({
      query: ({ id }) => ({
        url: 'delete_prerequisite',
        method: 'DELETE',
        body: {
          id
        }
      }),
      invalidatesTags: ['Prerequisite', 'Topics', 'Topic']
    }),
    createPrerequisiteSets: builder.mutation({
      query: ({ topic_id, sets }) => ({
        url: 'create_prerequisite_sets',
        method: 'POST',
        body: { topic: topic_id, sets }
      }),
      invalidatesTags: ['Topics']
    }),
    getTopicGroups: builder.query({
      query: () => `topic_groups`,
      providesTags: ['Groups']
    }),
    getTopicGroupInfo: builder.query({
      query: ({ group_id }) => `/group/${group_id}`,
      providesTags: ['Group']
    }),
    createTopicGroup: builder.mutation({
      query: ({ name, topics }) => ({
        url: 'create_topic_group',
        method: 'POST',
        body: { name, topics }
      }),
      invalidatesTags: ['Groups', 'Topics', 'Topic']
    }),
    editTopicGroup: builder.mutation({
      query: ({ group_id, name, topics }) => ({
        url: 'edit_topic_group',
        method: 'PUT',
        body: {
          group_id,
          name,
          topics
        }
      }),
      invalidatesTags: ['Topics', 'Topic', 'Groups', 'Group']
    }),
    deleteTopicGroup: builder.mutation({
      query: ({ id }) => ({
        url: 'delete_topic_group',
        method: 'DELETE',
        body: {
          id
        }
      }),
      invalidatesTags: ['Topics', 'Topic', 'Groups']
    }),
    enrolInPathway: builder.mutation({
      query: ({ user_id, pathway_id }) => ({
        url: 'enrol_in_pathway',
        method: 'PUT',
        body: { user_id, pathway_id }
      }),
      invalidatesTags: ['Pathways', 'Topics']
    }),
    unenrolInPathway: builder.mutation({
      query: ({ user_id, pathway_id }) => ({
        url: 'unenrol_in_pathway',
        method: 'DELETE',
        body: { user_id, pathway_id }
      }),
      invalidatesTags: ['Pathways', 'Topics']
    }),
    enrolInTopic: builder.mutation({
      query: ({ user_id, topic_id }) => ({
        url: 'enrol_in_topic',
        method: 'POST',
        body: { user_id, topic_id }
      }),
      invalidatesTags: ['Topics', 'Topic']
    }),
    unenrolInTopic: builder.mutation({
      query: ({ user_id, topic_id }) => ({
        url: 'unenrol_in_topic',
        method: 'DELETE',
        body: { user_id, topic_id }
      }),
      invalidatesTags: ['Topics', 'Topic']
    }),
    // Content endpoints
    getIsEnrolledInTopic: builder.query({
      query: ({ topic_id }) => `/is_enrolled/${topic_id}`
    }),
    getCreatedResources: builder.query({
      query: () => `/user_resources`
    }),
    getEnrolledTopics: builder.query({
      query: ({ access_token, forceRefresh }) => ({
        url: `/enrolled_topics`,
        providesTags: ['Topic', 'Topics']
      })
    }),
    getTopicInfo: builder.query({
      query: ({ topic_id }) => `/topic/${topic_id}`,
      providesTags: ['Topic']
    }),
    getTopicResources: builder.query({
      query: ({ topic_id, section }) =>
        `/topic/${topic_id}/${section.toLowerCase()}`,
      providesTags: ['Resources']
    }),
    getResource: builder.query({
      query: ({ resource_id }) => `/resources/${resource_id}`,
      providesTags: ['Resource']
    }),
    markResourceComplete: builder.mutation({
      query: ({ resource_id }) => ({
        url: 'complete_resource',
        method: 'POST',
        body: { resource_id }
      }),
      invalidatesTags: ['Resources']
    }),
    resetProgress: builder.mutation({
      query: ({ topic_id, section }) => ({
        url: 'reset_progress',
        method: 'DELETE',
        body: {
          topic_id,
          section
        }
      }),
      invalidatesTags: ['Resources']
    }),
    uploadResource: builder.mutation({
      query: ({ topic_id, title, section, file_data }) => ({
        url: 'upload_resource',
        method: 'POST',
        body: { topic_id, title, section, file_data }
      })
    }),
    replaceResource: builder.mutation({
      query: ({ prev_path, topic_id, title, section, file_data }) => ({
        url: 'replace_resource',
        method: 'POST',
        body: { prev_path, topic_id, title, section, file_data }
      })
    }),
    uploadMarkdown: builder.mutation({
      query: ({ title, content, topic_id, section }) => ({
        url: 'upload_markdown',
        method: 'POST',
        body: { title, content, topic_id, section }
      })
    }),
    createResource: builder.mutation({
      query: ({
        resource_type,
        title,
        server_path,
        url,
        duration,
        section,
        description,
        topic_id,
        creator_id
      }) => ({
        url: 'create_resource',
        method: 'POST',
        body: {
          resource_type,
          title,
          server_path,
          url,
          duration,
          section,
          description,
          topic_id,
          creator_id
        }
      }),
      invalidatesTags: ['Resources']
    }),
    editResource: builder.mutation({
      query: ({
        id,
        title,
        server_path,
        url,
        duration,
        section,
        description
      }) => ({
        url: 'edit_resource',
        method: 'PUT',
        body: {
          id,
          title,
          server_path,
          url,
          duration,
          section,
          description
        }
      }),
      invalidatesTags: ['Resources', 'Resource']
    }),
    rearrangeResource: builder.mutation({
      query: ({ resource_id, direction, topic_id, section, order_index }) => ({
        url: 'rearrange_resource',
        method: 'PUT',
        body: {
          resource_id,
          direction,
          topic_id,
          section,
          order_index
        }
      }),
      invalidatesTags: ['Resources']
    }),
    deleteResource: builder.mutation({
      query: ({ id }) => ({
        url: 'delete_resource',
        method: 'DELETE',
        body: {
          id
        }
      }),
      invalidatesTags: ['Resources']
    }),
    getZipPath: builder.query({
      query: ({ topic_id, section }) => `/zip/${topic_id}/${section}`
    }),
    getResourceSection: builder.query({
      query: ({ resource_id }) => `/resource_section/${resource_id}`
    }),
    // Role endpoints
    getTopicRoles: builder.query({
      query: ({ topic_id }) => `/topic/${topic_id}/roles`,
      providesTags: (result = [], error, arg) => [
        'Roles',
        ...result.map(({ id }: { id: number }) => ({ type: 'Roles', id }))
      ]
    }),
    getRole: builder.query({
      query: ({ role_id }) => `/roles/${role_id}`,
      providesTags: (result, error, arg) => [{ type: 'Roles', id: arg }]
    }),
    createRole: builder.mutation({
      query: ({ role_name, permissions, topic_id }) => ({
        url: `/roles/create`,
        method: 'POST',
        body: { role_name, permissions, topic_id }
      }),
      invalidatesTags: ['Roles']
    }),
    updateRole: builder.mutation({
      query: ({ role_id, role_name, permissions }) => ({
        url: `/roles/${role_id}`,
        method: 'PATCH',
        body: { role_name, permissions }
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Roles', id: arg.id }]
    }),
    deleteRole: builder.mutation({
      query: ({ role_id }) => ({
        url: `/roles/${role_id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Roles', id: arg.id }]
    }),
    getUserRoles: builder.query({
      query: ({ user_id, topic_id }) => `/users/${user_id}/${topic_id}/roles`,
      providesTags: ['UserRoles']
      //providesTags: (result, error, arg) => [{ type: 'Roles', id: arg }]
    }),
    addUserRoles: builder.mutation({
      query: ({ user_id, role_id, topic_id }) => ({
        url: `/users/${user_id}/roles/add`,
        method: 'PATCH',
        body: { user_id, role_id, topic_id }
      })
    }),
    removeUserRoles: builder.mutation({
      query: ({ user_id, role_id, topic_id }) => ({
        url: `/users/${user_id}/roles/remove`,
        method: 'PATCH',
        body: { user_id, role_id, topic_id }
      })
    }),
    updateUserRoles: builder.mutation({
      query: ({ user_id, topic_id, roles }) => ({
        url: `/users/${user_id}/roles/update`,
        method: 'PATCH',
        body: { user_id, topic_id, roles }
      }),
      invalidatesTags: ['UserRoles']
    })
  })
});

export const {
  useLogoutMutation,
  useIsSuperuserQuery,
  useGetTopicPermissionQuery,
  useGetEnrolledUsersQuery,
  useGetForumQuery,
  useGetThreadsQuery,
  useGetPostsQuery,
  useGetPostQuery,
  useCheckvoteThreadQuery,
  useCheckvotePostQuery,
  useGetPathwaysQuery,
  useGetPathwayQuery,
  useGetTopicGroupsQuery,
  useGetTopicGroupInfoQuery,
  useGetIsEnrolledInTopicQuery,
  useGetCreatedResourcesQuery,
  useGetEnrolledTopicsQuery,
  useGetTopicInfoQuery,
  useGetZipPathQuery,
  useGetResourceSectionQuery,
  useGetTopicResourcesQuery,
  useGetResourceQuery,
  useMarkResourceCompleteMutation,
  useResetProgressMutation,
  useUploadResourceMutation,
  useReplaceResourceMutation,
  useUploadMarkdownMutation,
  useCreateResourceMutation,
  useEditResourceMutation,
  useRearrangeResourceMutation,
  useDeleteResourceMutation,
  useCreateThreadMutation,
  useCreatePostMutation,
  useCreateTopicMutation,
  useEditTopicMutation,
  useArchiveTopicMutation,
  useDeleteTopicMutation,
  useCreateTopicGroupMutation,
  useEditTopicGroupMutation,
  useDeleteTopicGroupMutation,
  useCreatePrerequisiteMutation,
  useEditPrerequisiteMutation,
  useGetPrerequisiteInfoQuery,
  useDeletePrerequisiteMutation,
  useCreatePrerequisiteSetsMutation,
  useCreatePathwayMutation,
  useDeletePathwayMutation,
  useEditPathwayMutation,
  useEnrolInPathwayMutation,
  useUnenrolInPathwayMutation,
  useEnrolInTopicMutation,
  useUnenrolInTopicMutation,
  useGetTopicRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetUserRolesQuery,
  useAddUserRolesMutation,
  useRemoveUserRolesMutation,
  useUpdateUserRolesMutation,
  useUpvotePostMutation,
  useDownvotePostMutation,
  useUpvoteThreadMutation,
  useDownvoteThreadMutation,
  useMakeThreadStickyMutation,
  useMakeThreadUnStickyMutation,
  useMakePostEndorsedMutation,
  useMakePostUnEndorsedMutation,
  useMakePostAsAnswerMutation,
  useRemovePostAsAnswerMutation,
  useReportPostMutation,
  useClearReportPostMutation,
  useDeletePostMutation,
  useDeleteThreadMutation
} = apiSlice;
