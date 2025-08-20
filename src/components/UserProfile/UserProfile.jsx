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
} from "@chakra-ui/react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { listPosts } from "../../graphql/queries";
import { updatePost, deletePost } from "../../graphql/mutations";
import Navbar from "../Navbar/Navbar";

const UserProfile = () => {
  const client = generateClient();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const { user } = useAuthenticator((context) => [context.user]);
  const userEmail = user?.signInDetails?.loginId || user?.attributes?.email;

  // Color scheme for dark mode
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");

  // Fetch user's posts
  useEffect(() => {
    if (userEmail) {
      fetchUserPosts();
    }
  }, [userEmail]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      console.log("Fetching posts for user:", userEmail);
      
      const response = await client.graphql({
        query: listPosts,
        authMode: "userPool",
        variables: { limit: 100 },
      });

      console.log("GraphQL response:", response);

      if (response.data?.listPosts?.items) {
        // Filter posts to show only current user's posts
        const myPosts = response.data.listPosts.items
          .filter((post) => post !== null && post.userEmail === userEmail)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((post) => ({
            ...post,
            likes: post.likes || [],
            dislikes: post.dislikes || [],
          }));
        
        console.log("Filtered user posts:", myPosts);
        setUserPosts(myPosts);
      } else {
        console.log("No posts found in response");
        setUserPosts([]);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setUserPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit post
  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
  };

  // Save edited post
  const saveEditedPost = async () => {
    if (!editContent.trim() || !editingPost) return;

    try {
      const response = await client.graphql({
        query: updatePost,
        variables: {
          input: {
            id: editingPost.id,
            content: editContent.trim(),
          },
        },
        authMode: "userPool",
      });

      // Update local state
      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === editingPost.id
            ? { ...post, content: editContent.trim() }
            : post
        )
      );

      setShowDeleteConfirm(false);
      setEditingPost(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
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
      await client.graphql({
        query: deletePost,
        variables: {
          input: {
            id: deletingPost.id,
          },
        },
        authMode: "userPool",
      });

      // Remove from local state
      setUserPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== deletingPost.id)
      );

      setShowDeleteConfirm(false);
      setDeletingPost(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
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
            <Heading size="lg" color={useColorModeValue("gray.700", "gray.200")}>
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
              <Card key={post.id} bg={cardBg} shadow="md" borderRadius="lg" border="1px" borderColor={borderColor}>
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
                          {post.userEmail.charAt(0).toUpperCase()}
                        </Box>
                        <VStack spacing={0} align="start">
                          <Text fontWeight="bold" color={useColorModeValue("gray.700", "gray.200")}>
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
                          bg={useColorModeValue("gray.50", "gray.700")}
                          color={useColorModeValue("gray.800", "gray.100")}
                          border="2px"
                          borderColor={useColorModeValue("blue.200", "blue.300")}
                          _focus={{ 
                            borderColor: "blue.400", 
                            bg: useColorModeValue("white", "gray.600"),
                            color: useColorModeValue("gray.800", "gray.100")
                          }}
                          _placeholder={{ 
                            color: useColorModeValue("gray.500", "gray.400") 
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
                        color={useColorModeValue("gray.700", "gray.200")} 
                        bg={useColorModeValue("gray.50", "gray.700")} 
                        p={4} 
                        borderRadius="md"
                        border="1px"
                        borderColor={borderColor}
                      >
                        {post.content}
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
