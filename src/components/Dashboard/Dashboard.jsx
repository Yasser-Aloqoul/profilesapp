import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Card,
  Button,
  TextField,
  Heading,
  useAuthenticator
} from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import {
  listPosts,
  postCommentsByPostID,
} from "../../graphql/queries";
import {
  updatePost,
  createPostComment,
} from "../../graphql/mutations";
import {
  onCreatePostComment,
  onCreatePost,
  onUpdatePost,
} from "../../graphql/subscriptions";
import Navbar from "../Navbar/Navbar";

const Dashboard = () => {
  const client = generateClient();
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const { user } = useAuthenticator((context) => [context.user]);
  const userEmail = user.signInDetails?.loginId || user.attributes?.email;

  // Fetch all posts initially
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await client.graphql({
        query: listPosts,
        authMode: "userPool",
        variables: { limit: 100 },
      });

      if (response.data?.listPosts?.items) {
        const cleanPosts = await Promise.all(
          response.data.listPosts.items
            .filter((post) => post !== null)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(async (post) => {
              const commentsResponse = await client.graphql({
                query: postCommentsByPostID,
                variables: { 
                  postID: post.id, 
                  limit: 100,
                },
                authMode: "userPool",
              });

              // Get comments and sort them manually after fetching
              const comments = commentsResponse.data.postCommentsByPostID?.items || [];
              const sortedComments = comments.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );

              return {
                ...post,
                userEmail: post.userEmail || post.owner || "Anonymous",
                likes: post.likes || [],
                dislikes: post.dislikes || [],
                comments: sortedComments,
              };
            })
        );
        setPosts(cleanPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      console.error("Error details:", error.errors?.[0]);
      setPosts([]);
    }
  };

  // ---------------------------
  // 🔔 Subscriptions for Real-time
  // ---------------------------
  useEffect(() => {
    // When new comment is created
    const subNewComment = client
      .graphql({ query: onCreatePostComment })
      .subscribe({
        next: ({ data }) => {
          const newComment = data.onCreatePostComment;
          setPosts((prevPosts) =>
            prevPosts.map((p) => {
              // Only add the comment if it doesn't already exist in the array
              if (p.id === newComment.postID) {
                // Check if we already have this comment (or one very similar) 
                const commentExists = p.comments.some(c => 
                  // Check if IDs match or content and timestamp are very close
                  c.id === newComment.id || 
                  (c.content === newComment.content && 
                   c.userEmail === newComment.userEmail &&
                   Math.abs(new Date(c.createdAt) - new Date(newComment.createdAt)) < 5000) // Within 5 seconds
                );
                
                // Only add if it doesn't exist
                return commentExists 
                  ? p 
                  : { ...p, comments: [newComment, ...p.comments] };
              }
              return p;
            })
          );
        },
      });

    // When new post is created
    const subNewPost = client
      .graphql({ query: onCreatePost })
      .subscribe({
        next: ({ data }) => {
          const newPost = data.onCreatePost;
          setPosts((prev) => [
            {
              ...newPost,
              likes: [],
              dislikes: [],
              comments: [],
            },
            ...prev,
          ]);
        },
      });

    // When post is updated (likes/dislikes)
    const subUpdatePost = client
      .graphql({ query: onUpdatePost })
      .subscribe({
        next: ({ data }) => {
          const updatedPost = data.onUpdatePost;
          setPosts((prev) =>
            prev.map((p) => {
              if (p.id === updatedPost.id) {
                // Preserve the existing comments when receiving updates
                return { 
                  ...updatedPost, 
                  comments: p.comments || [] 
                };
              }
              return p;
            })
          );
        },
      });

    return () => {
      subNewComment.unsubscribe();
      subNewPost.unsubscribe();
      subUpdatePost.unsubscribe();
    };
  }, []);

  // ---------------------------
  // Likes / Dislikes / Comments
  // ---------------------------
  const handleLike = async (post) => {
    try {
      const likes = post.likes || [];
      const dislikes = post.dislikes || [];
      const hasLiked = likes.includes(userEmail);

      const newLikes = hasLiked
        ? likes.filter((email) => email !== userEmail)
        : [...likes, userEmail];
      const newDislikes = dislikes.filter((email) => email !== userEmail);

      // Update UI immediately - preserve all existing post properties
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === post.id 
            ? { 
                ...p, 
                likes: newLikes, 
                dislikes: newDislikes,
                // Keep existing comments as they are
                comments: p.comments
              } 
            : p
        )
      );

      // Then send to server - only send what needs to change
      await client.graphql({
        query: updatePost,
        variables: { 
          input: { 
            id: post.id, 
            likes: newLikes, 
            dislikes: newDislikes 
          }
        },
        authMode: "userPool",
      });
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert UI change on error
      fetchPosts();
    }
  };

  const handleDislike = async (post) => {
    try {
      const likes = post.likes || [];
      const dislikes = post.dislikes || [];
      const hasDisliked = dislikes.includes(userEmail);

      const newDislikes = hasDisliked
        ? dislikes.filter((email) => email !== userEmail)
        : [...dislikes, userEmail];
      const newLikes = likes.filter((email) => email !== userEmail);

      // Update UI immediately - preserve all existing post properties
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === post.id 
            ? { 
                ...p, 
                likes: newLikes, 
                dislikes: newDislikes,
                // Keep existing comments as they are
                comments: p.comments
              } 
            : p
        )
      );

      // Then send to server
      await client.graphql({
        query: updatePost,
        variables: { input: { id: post.id, likes: newLikes, dislikes: newDislikes } },
        authMode: "userPool",
      });
    } catch (error) {
      console.error("Error updating dislike:", error);
      // Revert UI change on error
      fetchPosts();
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;
    try {
      const newComment = {
        id: Date.now().toString(), // Temporary ID for optimistic UI
        postID: postId,
        content: commentText[postId].trim(),
        userEmail,
        createdAt: new Date().toISOString(),
      };

      // Update UI immediately
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === postId
            ? { ...p, comments: [newComment, ...p.comments] }
            : p
        )
      );
      
      // Clear comment input
      setCommentText({ ...commentText, [postId]: "" });

      // Then send to server
      await client.graphql({
        query: createPostComment,
        variables: { input: { 
          postID: postId,
          content: newComment.content,
          userEmail,
          createdAt: newComment.createdAt
        }},
        authMode: "userPool",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      // Revert UI change on error
      fetchPosts();
    }
  };

  return (
    <Flex direction="column">
      <Navbar />
      <Flex direction="column" padding="2rem" gap="2rem">
        {posts.map((post) => (
          <Card key={post.id} padding="1rem">
            <Flex direction="column" gap="1rem">
              {/* Post Header */}
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold">{post.userEmail}</Text>
                <Text fontSize="sm">{new Date(post.createdAt).toLocaleString()}</Text>
              </Flex>

              {/* Post Content */}
              <Text>{post.content}</Text>

              {/* Like / Dislike */}
              <Flex gap="1rem">
                <Button
                  onClick={() => handleLike(post)}
                  variation={post.likes?.includes(userEmail) ? "primary" : "default"}
                >
                  👍 {post.likes?.length || 0}
                </Button>
                <Button
                  onClick={() => handleDislike(post)}
                  variation={post.dislikes?.includes(userEmail) ? "primary" : "default"}
                >
                  👎 {post.dislikes?.length || 0}
                </Button>
              </Flex>

              {/* Comments */}
              <Flex direction="column" gap="0.5rem" marginTop="1rem">
                <Heading level={6}>Comments ({post.comments?.length || 0})</Heading>
                {Array.isArray(post.comments) && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <Card key={comment.id || comment.createdAt} padding="0.5rem" backgroundColor="#f5f5f5">
                      <Text fontWeight="bold">{comment.userEmail}</Text>
                      <Text>{comment.content}</Text>
                      <Text fontSize="xs" color="gray">
                        {new Date(comment.createdAt).toLocaleString()}
                      </Text>
                    </Card>
                  ))
                ) : (
                  <Text color="gray.500">No comments yet. Be the first to comment!</Text>
                )}

                {/* Add Comment */}
                <Flex gap="1rem" marginTop="0.5rem">
                  <TextField
                    placeholder="Add a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText({ ...commentText, [post.id]: e.target.value })
                    }
                  />
                  <Button onClick={() => handleComment(post.id)}>Send</Button>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Flex>
  );
};

export default Dashboard;
