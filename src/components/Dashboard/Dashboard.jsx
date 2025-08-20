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
import { generateClient } from 'aws-amplify/api';
import { listPosts } from "../../graphql/queries";
import Navbar from "../Navbar/Navbar";
import { updatePost, createPostComment } from "../../graphql/mutations";


const Dashboard = () => {
  const client = generateClient();
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const { user } = useAuthenticator((context) => [context.user]);
  const userEmail = user.signInDetails?.loginId || user.attributes?.email;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await client.graphql({
        query: listPosts,
        authMode: 'userPool',
        variables: {
          limit: 100
        }
      });
      
      if (response.data?.listPosts?.items) {
        const cleanPosts = response.data.listPosts.items
          .filter(post => post !== null)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(post => ({
            ...post,
            userEmail: post.userEmail || post.owner || 'Anonymous',
            likes: post.likes || [],
            dislikes: post.dislikes || [],
            comments: post.comments?.items || []
          }));

        console.log('Fetched posts:', cleanPosts);
        setPosts(cleanPosts);
      }
    } catch (error) {
      console.error('Full error:', error);
      console.error('GraphQL Error:', error.errors?.[0]?.message);
      setPosts([]);
    }
  };

  const handleLike = async (post) => {
    if (post.dislikes?.includes(userEmail)) return; // ال يمكن عمل لايك إذا كان هناك ديسلايك

    try {
      const isLiked = post.likes?.includes(userEmail);
      const updatedPost = {
        id: post.id,
        likes: isLiked 
          ? (post.likes || []).filter(email => email !== userEmail)
          : [...(post.likes || []), userEmail]
      };

      await client.graphql({
        query: updatePost,
        variables: { input: updatedPost },
        authMode: 'userPool'
      });

      fetchPosts();
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleDislike = async (post) => {
    if (post.likes?.includes(userEmail)) return; // لا يمكن عمل ديسلايك إذا كان هناك لايك

    try {
      const isDisliked = post.dislikes?.includes(userEmail);
      const updatedPost = {
        id: post.id,
        dislikes: isDisliked 
          ? (post.dislikes || []).filter(email => email !== userEmail)
          : [...(post.dislikes || []), userEmail]
      };

      await client.graphql({
        query: updatePost,
        variables: { input: updatedPost },
        authMode: 'userPool'
      });

      fetchPosts();
    } catch (error) {
      console.error('Error updating dislike:', error);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;

    try {
      const newComment = {
        postID: postId,
        content: commentText[postId].trim(),
        userEmail,
        createdAt: new Date().toISOString()
      };

      await client.graphql({
        query: createPostComment,
        variables: { input: newComment },
        authMode: 'userPool'
      });

      setCommentText({ ...commentText, [postId]: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Flex direction="column">
      <Navbar />
      <Flex direction="column" padding="2rem" gap="2rem">
        {posts.map(post => (
          <Card key={post.id} padding="1rem">
            <Flex direction="column" gap="1rem">
              {/* رأس البوست */}
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold">{post.userEmail}</Text>
                <Text fontSize="sm">{new Date(post.createdAt).toLocaleString()}</Text>
              </Flex>

              {/* محتوى البوست */}
              <Text>{post.content}</Text>

              {/* أزرار التفاعل */}
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

              {/* التعليقات */}
              <Flex direction="column" gap="0.5rem">
                <Heading level={6}>Comments ({post.comments?.length || 0})</Heading>
                {post.comments?.map(comment => (
                  <Card key={comment.id} padding="0.5rem">
                    <Text fontWeight="bold">{comment.userEmail}</Text>
                    <Text>{comment.content}</Text>
                    <Text fontSize="xs" color="gray">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Text>
                  </Card>
                ))}
                
                {/* إضافة تعليق */}
                <Flex gap="1rem">
                  <TextField
                    placeholder="Add a comment..."
                    value={commentText[post.id] || ''}
                    onChange={e => setCommentText({
                      ...commentText,
                      [post.id]: e.target.value
                    })}
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

