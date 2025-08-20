import React, { useState } from "react";
import {
  Flex,
  Heading,
  TextAreaField,
  Button,
  useAuthenticator,
} from "@aws-amplify/ui-react";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { createPost } from "../../graphql/mutations";

const CreatePost = () => {
  const navigate = useNavigate();
  const client = generateClient();
  const { user } = useAuthenticator((context) => [context.user]);
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const postData = {
        content: content.trim(),
        userEmail: user.signInDetails?.loginId || user.attributes?.email,
        createdAt: new Date().toISOString(),
        likes: [],
        dislikes: []
      };

      console.log('Creating post with:', postData);

      const response = await client.graphql({
        query: createPost,
        variables: { input: postData },
        authMode: 'userPool'
      });

      console.log('Post created:', response);
      setContent("");
      navigate("/");
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error details:", error.errors?.[0]?.message);
      alert("Error creating post. Please try again.");
    }
  };

  return (
    <Flex direction="column">
      <Navbar />
      <Flex direction="column" alignItems="center" margin="2rem">
        <Heading level={2}>Create Post</Heading>
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "500px" }}
        >
          <TextAreaField
            label="Post Content"
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Button type="submit" variation="primary" marginTop="1rem">
            Submit Post
          </Button>
        </form>
      </Flex>
    </Flex>
  );
};

export default CreatePost;

