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
  Avatar,
  Badge,
  Spinner,
  useColorModeValue,
  IconButton,
  Divider,
  Collapse,
  useDisclosure,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  Container,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import Navbar from "../Navbar/Navbar";

const Dashboard = () => {
  const [posts, setPosts] = useState([
    {
      id: "1",
      content: "Welcome to our social platform! This is a sample post to show how the interface works.",
      userEmail: "demo@example.com",
      createdAt: new Date().toISOString(),
      likes: ["user1@example.com", "user2@example.com"],
      dislikes: [],
      comments: [
        {
          id: "c1",
          content: "Great platform! Looking forward to using it.",
          userEmail: "user1@example.com",
          createdAt: new Date(Date.now() - 60000).toISOString()
        }
      ]
    }
  ]);
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const userEmail = "currentuser@example.com"; // Mock current user

  // Color scheme for dark mode - improved text visibility
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedTextColor = useColorModeValue("gray.500", "gray.300");
  const commentBg = useColorModeValue("gray.50", "gray.700");
  const headingColor = useColorModeValue("gray.700", "gray.100");
  const contentTextColor = useColorModeValue("gray.700", "gray.100");
  
  // Additional color values for inline usage
  const postContentBg = useColorModeValue("gray.50", "gray.700");
  const buttonHoverBg = useColorModeValue("gray.100", "gray.700");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const inputFocusBg = useColorModeValue("white", "gray.600");
  const expandButtonHoverBg = useColorModeValue("blue.50", "blue.900");

  // Fetch all posts initially
  useEffect(() => {
    // Posts are already initialized with sample data
    setLoading(false);
  }, []);

  const fetchPosts = () => {
    // Just refresh the current posts
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Get time ago format
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now - past) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Check if user owns the post
  const isOwner = (post) => {
    return post.userEmail === userEmail;
  };

  // ---------------------------
  // Likes / Dislikes / Comments
  // ---------------------------
  const handleLike = (post) => {
    const likes = post.likes || [];
    const dislikes = post.dislikes || [];
    const hasLiked = likes.includes(userEmail);

    const newLikes = hasLiked
      ? likes.filter((email) => email !== userEmail)
      : [...likes, userEmail];
    const newDislikes = dislikes.filter((email) => email !== userEmail);

    // Update UI immediately
    setPosts(prevPosts => 
      prevPosts.map(p => 
        p.id === post.id 
          ? { 
              ...p, 
              likes: newLikes, 
              dislikes: newDislikes,
              comments: p.comments
            } 
          : p
      )
    );
  };

  const handleDislike = (post) => {
    const likes = post.likes || [];
    const dislikes = post.dislikes || [];
    const hasDisliked = dislikes.includes(userEmail);

    const newDislikes = hasDisliked
      ? dislikes.filter((email) => email !== userEmail)
      : [...dislikes, userEmail];
    const newLikes = likes.filter((email) => email !== userEmail);

    // Update UI immediately
    setPosts(prevPosts => 
      prevPosts.map(p => 
        p.id === post.id 
          ? { 
              ...p, 
              likes: newLikes, 
              dislikes: newDislikes,
              comments: p.comments
            } 
          : p
      )
    );
  };

  const handleComment = (postId) => {
    if (!commentText[postId]?.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      postID: postId,
      content: commentText[postId].trim(),
      userEmail,
      createdAt: new Date().toISOString(),
    };

    // Update UI immediately
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId
          ? { ...p, comments: [newComment, ...p.comments] }
          : p
      )
    );
    
    // Clear comment input
    setCommentText({ ...commentText, [postId]: "" });
  };

  if (loading) {
    return (
      <Box minHeight="100vh" bg={bgColor}>
        <Navbar />
        <Flex justifyContent="center" alignItems="center" minH="50vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text fontSize="lg" color={textColor}>Loading posts...</Text>
          </VStack>
        </Flex>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bg={bgColor}>
      <Navbar />
      
      {/* Header */}
      <Container maxW="1200px" py={8}>
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="xl" color={headingColor}>
              📱 Social Feed
            </Heading>
            <Button 
              onClick={fetchPosts}
              size="md"
              variant="outline"
              colorScheme="blue"
              _hover={{ transform: "translateY(-1px)" }}
              transition="all 0.2s"
            >
              🔄 Refresh
            </Button>
          </Flex>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody textAlign="center" py={16}>
                <VStack spacing={6}>
                  <Text fontSize="8xl">📝</Text>
                  <Heading size="lg" color={mutedTextColor}>
                    No posts yet
                  </Heading>
                  <Text color={textColor} maxW="md" fontSize="lg">
                    Be the first to share something with the community!
                  </Text>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => window.location.href = "/create-post"}
                    mt={6}
                    size="lg"
                  >
                    Create First Post
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            posts.map((post) => (
              <Card 
                key={post.id} 
                bg={cardBg} 
                shadow="lg" 
                borderRadius="xl" 
                border="1px" 
                borderColor={borderColor}
                _hover={{ 
                  shadow: "xl", 
                  transform: "translateY(-2px)",
                  borderColor: "blue.200"
                }}
                transition="all 0.3s ease"
              >
                <CardBody p={8}>
                  <VStack spacing={6} align="stretch">
                    {/* Post Header */}
                    <Flex justifyContent="space-between" alignItems="flex-start">
                      <HStack spacing={4}>
                        <Avatar
                          size="lg"
                          name={post.userEmail}
                          bg="blue.500"
                          color="white"
                          fontWeight="bold"
                        />
                        <VStack spacing={0} align="start">
                          <Text fontWeight="bold" color={headingColor} fontSize="lg">
                            {post.userEmail}
                          </Text>
                          <Text fontSize="md" color={mutedTextColor}>
                            {getTimeAgo(post.createdAt)}
                          </Text>
                        </VStack>
                      </HStack>
                      
                      {isOwner(post) && (
                        <Badge colorScheme="green" variant="subtle" borderRadius="full">
                          Your Post
                        </Badge>
                      )}
                    </Flex>

                    {/* Post Content */}
                    <Box
                      bg={postContentBg}
                      p={6}
                      borderRadius="lg"
                      border="1px"
                      borderColor={borderColor}
                    >
                      <Text 
                        fontSize="lg" 
                        lineHeight="1.7" 
                        color={contentTextColor}
                        whiteSpace="pre-wrap"
                      >
                        {post.content}
                      </Text>
                    </Box>

                    {/* Interaction Buttons */}
                    <HStack spacing={5} pt={3}>
                      <Button
                        onClick={() => handleLike(post)}
                        variant={post.likes?.includes(userEmail) ? "solid" : "outline"}
                        colorScheme="blue"
                        size="md"
                        leftIcon={<Text as="span" fontSize="lg">👍</Text>}
                        _hover={{ transform: "translateY(-1px)" }}
                        transition="all 0.2s"
                        borderRadius="full"
                        px={6}
                      >
                        {post.likes?.length || 0}
                      </Button>
                      
                      <Button
                        onClick={() => handleDislike(post)}
                        variant={post.dislikes?.includes(userEmail) ? "solid" : "outline"}
                        colorScheme="red"
                        size="md"
                        leftIcon={<Text as="span" fontSize="lg">👎</Text>}
                        _hover={{ transform: "translateY(-1px)" }}
                        transition="all 0.2s"
                        borderRadius="full"
                        px={6}
                      >
                        {post.dislikes?.length || 0}
                      </Button>

                      <Button
                        onClick={() => toggleComments(post.id)}
                        variant="ghost"
                        size="md"
                        leftIcon={<Text as="span" fontSize="lg">💬</Text>}
                        _hover={{ bg: buttonHoverBg }}
                        borderRadius="full"
                        px={6}
                      >
                        {post.comments?.length || 0} Comments
                      </Button>
                    </HStack>

                    <Divider />

                    {/* Comments Section */}
                    <VStack spacing={4} align="stretch">
                      {/* Add Comment */}
                      <HStack spacing={4}>
                        <Avatar
                          size="md"
                          name={userEmail}
                          bg="gray.400"
                          color="white"
                        />
                        <InputGroup>
                          <Input
                            placeholder="Write a comment..."
                            value={commentText[post.id] || ""}
                            onChange={(e) =>
                              setCommentText({ ...commentText, [post.id]: e.target.value })
                            }
                            borderRadius="full"
                            bg={inputBg}
                            border="1px"
                            borderColor={borderColor}
                            _focus={{ borderColor: "blue.400", bg: inputFocusBg }}
                            size="lg"
                            py={3}
                          />
                          <InputRightElement>
                            <IconButton
                              onClick={() => handleComment(post.id)}
                              icon={<Text as="span">📤</Text>}
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                              borderRadius="full"
                              isDisabled={!commentText[post.id]?.trim()}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </HStack>

                      {/* Comments List */}
                      {Array.isArray(post.comments) && post.comments.length > 0 && (
                        <VStack spacing={4} align="stretch">
                          {/* Show first 2 comments, then expand button */}
                          {(expandedComments[post.id] ? post.comments : post.comments.slice(0, 2))
                            .map((comment, index) => (
                            <Box
                              key={comment.id || comment.createdAt || index}
                              bg={commentBg}
                              p={4}
                              borderRadius="lg"
                              border="1px"
                              borderColor={borderColor}
                            >
                              <HStack spacing={3} align="start">
                                <Avatar
                                  size="sm"
                                  name={comment.userEmail}
                                  bg="purple.500"
                                  color="white"
                                />
                                <VStack spacing={1} align="start" flex={1}>
                                  <HStack spacing={2}>
                                    <Text fontWeight="bold" fontSize="md" color={headingColor}>
                                      {comment.userEmail}
                                    </Text>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                      {getTimeAgo(comment.createdAt)}
                                    </Text>
                                  </HStack>
                                  <Text fontSize="md" color={textColor} lineHeight="1.5">
                                    {comment.content}
                                  </Text>
                                </VStack>
                              </HStack>
                            </Box>
                          ))}
                          
                          {/* Expand/Collapse Comments */}
                          {post.comments.length > 2 && (
                            <Button
                              onClick={() => toggleComments(post.id)}
                              variant="ghost"
                              size="sm"
                              color="blue.500"
                              _hover={{ bg: expandButtonHoverBg }}
                            >
                              {expandedComments[post.id] 
                                ? "Hide comments" 
                                : `View ${post.comments.length - 2} more comments`
                              }
                            </Button>
                          )}
                        </VStack>
                      )}
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            ))
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;
