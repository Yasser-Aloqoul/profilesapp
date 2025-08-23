import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Textarea,
  Heading,
  VStack,
  HStack,
  Card,
  CardBody,
  Badge,
  Spinner,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "react-oidc-context";

import Navbar from "../Navbar/Navbar";
import PostService from "../../services/PostService";

const UserProfile = () => {
  const auth = useAuth();
  const toast = useToast();
  const userEmail = auth.user?.profile?.email || "currentuser@example.com";
  const userName = auth.user?.profile?.name || auth.user?.profile?.email || "User";
  
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Color scheme for dark mode
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");
  
  // Additional color values for UserProfile
  const headingColor = useColorModeValue("gray.700", "gray.200");
  const editInputBg = useColorModeValue("gray.50", "gray.700");
  const editInputColor = useColorModeValue("gray.800", "gray.100");
  const editInputBorderColor = useColorModeValue("blue.200", "blue.300");
  const editInputFocusBg = useColorModeValue("white", "gray.600");
  const editInputFocusColor = useColorModeValue("gray.800", "gray.100");
  const editInputPlaceholderColor = useColorModeValue("gray.500", "gray.400");
  const contentBg = useColorModeValue("gray.50", "gray.700");
  const contentColor = useColorModeValue("gray.700", "gray.200");

  // Helper function to get the correct post ID
  const getPostId = (post) => {
    return post._id || post.id || post.postId;
  };

  // Fetch user's posts
  useEffect(() => {
    fetchUserPosts();
  }, [userEmail]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const idToken = auth.user?.id_token;
      
      // Get all posts and filter by user email
      const allPostsResponse = await PostService.getAllPosts(idToken);
      
      // Handle the same data structure as Dashboard
      let allPosts = allPostsResponse;
      if (allPostsResponse && typeof allPostsResponse === 'object' && !Array.isArray(allPostsResponse)) {
        if (allPostsResponse.data && Array.isArray(allPostsResponse.data)) {
          allPosts = allPostsResponse.data;
        } else if (allPostsResponse.posts && Array.isArray(allPostsResponse.posts)) {
          allPosts = allPostsResponse.posts;
        } else if (allPostsResponse.results && Array.isArray(allPostsResponse.results)) {
          allPosts = allPostsResponse.results;
        }
      }
      
      // Filter posts by current user email
      const userPosts = Array.isArray(allPosts) ? allPosts.filter(post => 
        post.authorEmail === userEmail
      ) : [];
      
      setUserPosts(userPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setApiError('Failed to load your posts. Please check if the server is running.');
      toast({
        title: "Error loading posts",
        description: "Please check if the server is running.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit post
  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditContent(post.content || post.postCreate);
  };

  // Save edited post
  const saveEditedPost = async () => {
    if (!editContent.trim() || !editingPost) return;

    try {
      const idToken = auth.user?.id_token;
      const postId = getPostId(editingPost);
      const updatedPost = await PostService.updatePost(postId, {
        content: editContent.trim()  // Changed from postCreate to content
      }, idToken);

      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          getPostId(post) === postId ? updatedPost : post
        )
      );

      setEditingPost(null);
      setEditContent("");
      
      toast({
        title: "Post updated!",
        description: "Your post has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error updating post",
        description: error.message || "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle delete post
  const handleDeletePost = (post) => {
    setDeletingPost(post);
    setShowDeleteConfirm(true);
  };

  // Confirm delete post
  const confirmDeletePost = async () => {
    if (!deletingPost) return;

    try {
      const idToken = auth.user?.id_token;
      const postId = getPostId(deletingPost);
      await PostService.deletePost(postId, idToken);
      
      // Remove from local state
      setUserPosts((prevPosts) =>
        prevPosts.filter((post) => getPostId(post) !== postId)
      );

      setShowDeleteConfirm(false);
      setDeletingPost(null);
      
      toast({
        title: "Post deleted!",
        description: "Your post has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error deleting post",
        description: error.message || "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setShowDeleteConfirm(false);
      setDeletingPost(null);
    }
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditContent("");
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingPost(null);
  };

  if (loading) {
    return (
      <Box minHeight="100vh" bg={bgColor}>
        <Navbar />
        <Flex justifyContent="center" alignItems="center" padding="2rem" flex="1" minH="50vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="lg" color={textColor}>Loading your posts...</Text>
          </VStack>
        </Flex>
      </Box>
    );
  }

  if (!userEmail) {
    return (
      <Box minHeight="100vh" bg={bgColor}>
        <Navbar />
        <Flex justifyContent="center" alignItems="center" padding="2rem" flex="1" minH="50vh">
          <Alert status="error" borderRadius="md" maxW="md">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>Unable to load user information</AlertDescription>
          </Alert>
        </Flex>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bg={bgColor}>
      <Navbar />
      <Box maxW="800px" mx="auto" p={6}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="lg" color={headingColor}>
              My Posts
            </Heading>
            <HStack spacing={4}>
              <Button 
                onClick={fetchUserPosts}
                size="sm"
                variant="outline"
                colorScheme="blue"
                _hover={{ transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                🔄 Refresh
              </Button>
              <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
                {userPosts.length} {userPosts.length === 1 ? "post" : "posts"}
              </Badge>
            </HStack>
          </Flex>

          {/* Empty State */}
          {userPosts.length === 0 ? (
            <Card bg={cardBg} shadow="md" borderRadius="lg">
              <CardBody textAlign="center" py={12}>
                <VStack spacing={4}>
                  <Text fontSize="6xl">📝</Text>
                  <Heading size="md" color={mutedTextColor}>
                    No posts yet
                  </Heading>
                  <Text color={textColor} maxW="md">
                    You haven't created any posts yet. Start sharing your thoughts with the community!
                  </Text>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => window.location.href = "/create-post"}
                    mt={4}
                  >
                    Create Your First Post
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            /* Posts List */
            userPosts.map((post) => (
              <Card key={getPostId(post)} bg={cardBg} shadow="md" borderRadius="lg" border="1px" borderColor={borderColor}>
                <CardBody p={6}>
                  <VStack spacing={4} align="stretch">
                    {/* Post Header */}
                    <Flex justifyContent="space-between" alignItems="center">
                      <HStack spacing={3}>
                        <Box
                          w={10}
                          h={10}
                          bg="blue.500"
                          color="white"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontWeight="bold"
                        >
                          {(post.userEmail || post.email || post.authorEmail || 'U').charAt(0).toUpperCase()}
                        </Box>
                        <VStack spacing={0} align="start">
                          <Text fontWeight="bold" color={headingColor}>
                            {post.userEmail}
                          </Text>
                          <Text fontSize="sm" color={mutedTextColor}>
                            {new Date(post.createdAt).toLocaleString()}
                          </Text>
                        </VStack>
                      </HStack>
                      <Badge colorScheme="green" variant="subtle">
                        Your Post
                      </Badge>
                    </Flex>

                    {/* Post Content */}
                    {editingPost && editingPost.id === post.id ? (
                      <VStack spacing={3} align="stretch">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          placeholder="Edit your post..."
                          resize="vertical"
                          minH="100px"
                          bg={editInputBg}
                          color={editInputColor}
                          border="2px"
                          borderColor={editInputBorderColor}
                          _focus={{
                            borderColor: "blue.400",
                            bg: editInputFocusBg,
                            color: editInputFocusColor
                          }}
                          _placeholder={{
                            color: editInputPlaceholderColor
                          }}
                        />
                        <HStack spacing={2}>
                          <Button
                            onClick={saveEditedPost}
                            colorScheme="blue"
                            size="sm"
                            isDisabled={!editContent.trim()}
                            _hover={{ transform: "translateY(-1px)" }}
                            transition="all 0.2s"
                          >
                            💾 Save Changes
                          </Button>
                          <Button 
                            onClick={cancelEdit} 
                            variant="outline"
                            size="sm"
                            _hover={{ transform: "translateY(-1px)" }}
                            transition="all 0.2s"
                          >
                            ❌ Cancel
                          </Button>
                        </HStack>
                      </VStack>
                    ) : (
                      <Text 
                        fontSize="md" 
                        lineHeight="1.6" 
                        color={contentColor} 
                        bg={contentBg} 
                        p={4} 
                        borderRadius="md"
                        border="1px"
                        borderColor={borderColor}
                      >
                        {post.content || post.postCreate}
                      </Text>
                    )}

                    {/* Post Stats */}
                    <HStack spacing={6} pt={2}>
                      <HStack spacing={2}>
                        <Text fontSize="lg">👍</Text>
                        <Text fontSize="sm" color={textColor} fontWeight="medium">
                          {post.likes?.length || 0} likes
                        </Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Text fontSize="lg">👎</Text>
                        <Text fontSize="sm" color={textColor} fontWeight="medium">
                          {post.dislikes?.length || 0} dislikes
                        </Text>
                      </HStack>
                    </HStack>

                    {/* Action Buttons */}
                    {(!editingPost || editingPost.id !== post.id) && (
                      <HStack spacing={3} pt={2}>
                        <Button
                          onClick={() => handleEditPost(post)}
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                          leftIcon={<Text as="span">✏️</Text>}
                          _hover={{ transform: "translateY(-1px)" }}
                          transition="all 0.2s"
                        >
                          Edit
                        </Button>
                        
                        {showDeleteConfirm && deletingPost?.id === post.id ? (
                          <HStack spacing={2}>
                            <Text fontSize="sm" color="red.600" fontWeight="medium">
                              Are you sure?
                            </Text>
                            <Button
                              onClick={confirmDeletePost}
                              colorScheme="red"
                              size="sm"
                              _hover={{ transform: "translateY(-1px)" }}
                              transition="all 0.2s"
                            >
                              Yes, Delete
                            </Button>
                            <Button 
                              onClick={cancelDelete} 
                              variant="outline"
                              size="sm"
                              _hover={{ transform: "translateY(-1px)" }}
                              transition="all 0.2s"
                            >
                              Cancel
                            </Button>
                          </HStack>
                        ) : (
                          <Button
                            onClick={() => handleDeletePost(post)}
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            leftIcon={<Text as="span">🗑️</Text>}
                            _hover={{ transform: "translateY(-1px)" }}
                            transition="all 0.2s"
                          >
                            Delete
                          </Button>
                        )}
                      </HStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            ))
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default UserProfile;
