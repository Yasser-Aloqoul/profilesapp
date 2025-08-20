/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onCreatePost(filter: $filter, owner: $owner) {
      id
      content
      userEmail
      owner
      createdAt
      likes
      dislikes
      comments {
        nextToken
        __typename
      }
      updatedAt
      __typename
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onUpdatePost(filter: $filter, owner: $owner) {
      id
      content
      userEmail
      owner
      createdAt
      likes
      dislikes
      comments {
        nextToken
        __typename
      }
      updatedAt
      __typename
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onDeletePost(filter: $filter, owner: $owner) {
      id
      content
      userEmail
      owner
      createdAt
      likes
      dislikes
      comments {
        nextToken
        __typename
      }
      updatedAt
      __typename
    }
  }
`;
export const onCreatePostComment = /* GraphQL */ `
  subscription OnCreatePostComment(
    $filter: ModelSubscriptionPostCommentFilterInput
    $owner: String
  ) {
    onCreatePostComment(filter: $filter, owner: $owner) {
      id
      postID
      content
      userEmail
      createdAt
      post {
        id
        content
        userEmail
        owner
        createdAt
        likes
        dislikes
        updatedAt
        __typename
      }
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdatePostComment = /* GraphQL */ `
  subscription OnUpdatePostComment(
    $filter: ModelSubscriptionPostCommentFilterInput
    $owner: String
  ) {
    onUpdatePostComment(filter: $filter, owner: $owner) {
      id
      postID
      content
      userEmail
      createdAt
      post {
        id
        content
        userEmail
        owner
        createdAt
        likes
        dislikes
        updatedAt
        __typename
      }
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeletePostComment = /* GraphQL */ `
  subscription OnDeletePostComment(
    $filter: ModelSubscriptionPostCommentFilterInput
    $owner: String
  ) {
    onDeletePostComment(filter: $filter, owner: $owner) {
      id
      postID
      content
      userEmail
      createdAt
      post {
        id
        content
        userEmail
        owner
        createdAt
        likes
        dislikes
        updatedAt
        __typename
      }
      updatedAt
      owner
      __typename
    }
  }
`;
