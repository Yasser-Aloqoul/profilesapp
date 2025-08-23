import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import CreatePost from "./components/CreatePost/CreatePost";
import Dashboard from "./components/Dashboard/Dashboard";
import UserProfile from "./components/UserProfile/UserProfile";

function App() {
  const auth = useAuth();
  const [posts, setPosts] = useState([]);

  // Get current user email from Cognito
  const currentUser = auth.user?.profile?.email || "unknown@example.com";

  const addPost = async (newPost) => {
    try {
      // Simple local post addition without API
      const postWithId = {
        ...newPost,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        userEmail: currentUser
      };
      setPosts((prev) => [postWithId, ...prev]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const addComment = (postId, text) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...(Array.isArray(p.comments) ? p.comments : []), text] }
          : p
      )
    );
  };

  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;

        const liked = p.likedBy?.includes(currentUser);
        const disliked = p.dislikedBy?.includes(currentUser);

        return {
          ...p,
          likedBy: liked
            ? p.likedBy.filter((u) => u !== currentUser)
            : [...(p.likedBy || []), currentUser],
          dislikedBy: disliked && !liked
            ? p.dislikedBy.filter((u) => u !== currentUser)
            : p.dislikedBy || [],
        };
      })
    );
  };

  const toggleDislike = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;

        const liked = p.likedBy?.includes(currentUser);
        const disliked = p.dislikedBy?.includes(currentUser);

        return {
          ...p,
          dislikedBy: disliked
            ? p.dislikedBy.filter((u) => u !== currentUser)
            : [...(p.dislikedBy || []), currentUser],
          likedBy: liked && !disliked
            ? p.likedBy.filter((u) => u !== currentUser)
            : p.likedBy || [],
        };
      })
    );
  };

  // Handle authentication states
  if (auth.isLoading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text fontSize="lg">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  if (auth.error) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text fontSize="lg" color="red.500">
            Authentication error: {auth.error.message}
          </Text>
        </VStack>
      </Box>
    );
  }

  // If not authenticated, redirect to Cognito login
  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text fontSize="lg">Redirecting to login...</Text>
        </VStack>
      </Box>
    );
  }

  // If authenticated, show the main app
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              posts={posts}
              addComment={addComment}
              toggleLike={toggleLike}
              toggleDislike={toggleDislike}
              currentUser={currentUser}
            />
          }
        />
        <Route 
          path="/create-post" 
          element={<CreatePost addPost={addPost} />} 
        />
        <Route 
          path="/profile" 
          element={<UserProfile />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
