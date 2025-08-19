import React from "react";
import { Flex, Button, Heading, useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { signOut } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  // Navigate to dashboard
  const goToDashboard = () => {
    navigate("/");
  };

  // Navigate to create post page
  const handleCreatePost = () => {
    navigate("/create-post");
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      padding="1rem 2rem"
      backgroundColor="#ffffff"
      boxShadow="0 2px 6px rgba(0,0,0,0.1)"
    >
      <Heading level={3}>Social App</Heading>
      <Flex gap="1rem">
        <Button onClick={goToDashboard} variation="link">
          Dashboard
        </Button>
        <Button onClick={handleCreatePost} variation="link">
          Create Post
        </Button>
        <Button onClick={signOut} variation="link">
          Logout
        </Button>
      </Flex>
    </Flex>
  );
};

export default Navbar;
