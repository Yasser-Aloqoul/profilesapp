import React, { useState } from "react";
import { Flex, Grid, View, Heading, Divider, Button } from "@aws-amplify/ui-react";
import Navbar from "../Navbar/Navbar";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthenticator((context) => [context.user]);

  // Dummy posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "alice@example.com",
      content: "Hello world! My first post.",
      likes: 3,
      comments: 1,
    },
    {
      id: 2,
      author: "bob@example.com",
      content: "Enjoying the sunny day!",
      likes: 5,
      comments: 2,
    },
    {
      id: 3,
      author: "charlie@example.com",
      content: "Just had a great cup of coffee ☕",
      likes: 2,
      comments: 0,
    },
  ]);

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  return (
    <Flex direction="column">
      {/* Navbar */}
      <Navbar onCreatePost={handleCreatePost} onLogout={signOut} />

      {/* Dashboard Content */}
      <Flex direction="column" alignItems="center" margin="2rem">
        
        <Divider margin="1rem 0" />

        <Grid
          templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gap="2rem"
          width="100%"
        >
          {posts.map((post) => (
            <Flex
              key={post.id}
              direction="column"
              border="1px solid #ccc"
              borderRadius="8px"
              padding="1rem"
              backgroundColor="#f7fafc"
              boxShadow="0 2px 6px rgba(0,0,0,0.1)"
              className="post-card"
            >
              <Heading level={4}>{post.author}</Heading>
              <View style={{ margin: "1rem 0" }}>{post.content}</View>
              <Flex justifyContent="space-between">
                <span>👍 {post.likes}</span>
                <span>💬 {post.comments}</span>
              </Flex>
            </Flex>
          ))}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
