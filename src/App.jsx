import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import CreatePost from "./components/CreatePost/CreatePost";
import Dashboard from "./components/Dashboard/Dashboard";
import UserProfile from "./components/UserProfile/UserProfile";
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { withAuthenticator, Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";
import Login from "./components/Login/Login";
import { createPost } from "./graphql/mutations";

Amplify.configure({
  ...awsconfig,
  API: {
    GraphQL: {
      endpoint: awsconfig.aws_appsync_graphqlEndpoint,
      region: awsconfig.aws_appsync_region,
      defaultAuthMode: 'userPool'
    }
  }
});

const client = generateClient();

function App() {
  const [posts, setPosts] = useState([]);
  const { user } = useAuthenticator((context) => [context.user]);
  const currentUser = user?.signInDetails?.loginId || user?.username || "unknown@example.com";

  const addPost = async (newPost) => {
    try {
      const response = await client.graphql({
        query: createPost,
        variables: { input: newPost }
      });
      setPosts((prev) => [response.data.createPost, ...prev]);
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

  return (
    <Authenticator.Provider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard
                  posts={posts}
                  addComment={addComment}
                  toggleLike={toggleLike}
                  toggleDislike={toggleDislike}
                  currentUser={currentUser}
                />
              </RequireAuth>
            }
          />
          <Route 
            path="/create-post" 
            element={
              <RequireAuth>
                <CreatePost addPost={addPost} />
              </RequireAuth>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <RequireAuth>
                <UserProfile />
              </RequireAuth>
            } 
          />
        </Routes>
      </Router>
    </Authenticator.Provider>
  );
}

function RequireAuth({ children }) {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus !== 'authenticated') {
      navigate('/login');
    }
  }, [authStatus, navigate]);

  return authStatus === 'authenticated' ? children : null;
}

export default withAuthenticator(App);
