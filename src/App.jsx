import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import CreatePost from "./components/CreatePost/CreatePost";
import Dashboard from "./components/Dashboard/Dashboard";
import UserProfile from "./components/UserProfile/UserProfile";
import Login from "./components/Login/Login";

function App() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState("unknown@example.com");

  const addPost = async (newPost) => {
    try {
      // Simple local post addition without API
      const postWithId = {
        ...newPost,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
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

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
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
