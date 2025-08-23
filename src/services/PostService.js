// src/services/PostService.js

import { API_BASE_URL } from "../config/api";

// Helper to get auth header
function getAuthHeader(idToken) {
  if (!idToken) throw new Error("No idToken provided");
  return { Authorization: `Bearer ${idToken}` };
}


const PostService = {
  async getAllPosts(idToken) {
    const headers = getAuthHeader(idToken);
    const res = await fetch(`${API_BASE_URL}/posts`, { headers });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('GET /posts error:', errorText);
      throw new Error(`Failed to fetch posts: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    return data;
  },
  async getUserPosts(email, idToken) {
    const headers = getAuthHeader(idToken);
    const res = await fetch(`${API_BASE_URL}/posts/user/${encodeURIComponent(email)}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch user posts");
    return res.json();
  },
  async createPost(data, idToken) {
    const headers = { ...getAuthHeader(idToken), "Content-Type": "application/json" };
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to create post: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return res.json();
  },
  async likePost(postId, data, idToken) {
    const headers = { ...getAuthHeader(idToken), "Content-Type": "application/json" };
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to like post");
    return res.json();
  },
  async unlikePost(postId, data, idToken) {
    // Backend uses toggle logic - call the same like endpoint to unlike
    const headers = { ...getAuthHeader(idToken), "Content-Type": "application/json" };
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to unlike post");
    return res.json();
  },
  async dislikePost(postId, data, idToken) {
    const headers = { ...getAuthHeader(idToken), "Content-Type": "application/json" };
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/dislike`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to dislike post");
    return res.json();
  },
  async removeDislike(postId, data, idToken) {
    // Backend uses toggle logic - call the same dislike endpoint to remove dislike
    const headers = { ...getAuthHeader(idToken), "Content-Type": "application/json" };
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/dislike`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to remove dislike");
    return res.json();
  },
  async addComment(postId, data, idToken) {
    const headers = { ...getAuthHeader(idToken), "Content-Type": "application/json" };
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add comment");
    return res.json();
  },
  async updatePost(postId, data, idToken) {
    const headers = { ...getAuthHeader(idToken), "Content-Type": "application/json" };
    const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update post");
    return res.json();
  },
  async deletePost(postId, idToken) {
    const headers = getAuthHeader(idToken);
    const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) throw new Error("Failed to delete post");
    return res.json();
  },
};

export default PostService;
