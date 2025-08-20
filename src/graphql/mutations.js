/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      content
      userEmail
      createdAt
      likes
      dislikes
      comments {
        nextToken
        __typename
      }
      updatedAt
      owner
      __typename
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      content
      userEmail
      createdAt
      likes
      dislikes
      comments {
        nextToken
        __typename
      }
      updatedAt
      owner
      __typename
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      content
      userEmail
      createdAt
      likes
      dislikes
      comments {
        nextToken
        __typename
      }
      updatedAt
      owner
      __typename
    }
  }
`;
export const createPostComment = /* GraphQL */ `
  mutation CreatePostComment(
    $input: CreatePostCommentInput!
    $condition: ModelPostCommentConditionInput
  ) {
    createPostComment(input: $input, condition: $condition) {
      id
      postID
      content
      userEmail
      createdAt
      post {
        id
        content
        userEmail
        createdAt
        likes
        dislikes
        updatedAt
        owner
        __typename
      }
      updatedAt
      owner
      __typename
    }
  }
`;
export const updatePostComment = /* GraphQL */ `
  mutation UpdatePostComment(
    $input: UpdatePostCommentInput!
    $condition: ModelPostCommentConditionInput
  ) {
    updatePostComment(input: $input, condition: $condition) {
      id
      postID
      content
      userEmail
      createdAt
      post {
        id
        content
        userEmail
        createdAt
        likes
        dislikes
        updatedAt
        owner
        __typename
      }
      updatedAt
      owner
      __typename
    }
  }
`;
export const deletePostComment = /* GraphQL */ `
  mutation DeletePostComment(
    $input: DeletePostCommentInput!
    $condition: ModelPostCommentConditionInput
  ) {
    deletePostComment(input: $input, condition: $condition) {
      id
      postID
      content
      userEmail
      createdAt
      post {
        id
        content
        userEmail
        createdAt
        likes
        dislikes
        updatedAt
        owner
        __typename
      }
      updatedAt
      owner
      __typename
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment($input: CreatePostCommentInput!) {
    createPostComment(input: $input) {
      id
      postID
      content
      userEmail
      createdAt
    }
  }
`;
