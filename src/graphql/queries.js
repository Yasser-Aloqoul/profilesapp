/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
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
export const listPosts = /* GraphQL */ `
  query ListPosts($limit: Int, $nextToken: String) {
    listPosts(limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        userEmail
        owner
        createdAt
        likes
        dislikes
        comments {
          items {
            id
            content
            userEmail
            createdAt
          }
        }
      }
      nextToken
    }
  }
`;
export const getPostComment = /* GraphQL */ `
  query GetPostComment($id: ID!) {
    getPostComment(id: $id) {
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
export const listPostComments = /* GraphQL */ `
  query ListPostComments(
    $filter: ModelPostCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPostComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        postID
        content
        userEmail
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const postCommentsByPostID = /* GraphQL */ `
  query PostCommentsByPostID(
    $postID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPostCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postCommentsByPostID(
      postID: $postID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        postID
        content
        userEmail
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
  