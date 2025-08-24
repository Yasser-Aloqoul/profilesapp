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
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useAuth } from "react-oidc-context";

import Navbar from "../Navbar/Navbar";
import PostService from "../../services/PostService";

const Dashboard = () => {
  const auth = useAuth();
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const [apiError, setApiError] = useState(null);
  const userEmail = auth.user?.profile?.email || "currentuser@example.com";
  const userName = auth.user?.profile?.name || auth.user?.profile?.email || "User";

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
    fetchPosts();
  }, []);

  // Debug posts state changes
  useEffect(() => {
    console.log('Posts state changed:', posts);
    console.log('Posts count:', posts.length);
    console.log('Posts array check:', Array.isArray(posts));
  }, [posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const idToken = auth.user?.id_token;
      console.log('Fetching posts with idToken:', !!idToken);
      
      const postsData = await PostService.getAllPosts(idToken);
      
      // Debug logging
      console.log('Raw API Response:', postsData);
      console.log('Is Array:', Array.isArray(postsData));
      console.log('Posts length:', postsData?.length);
      
      // Check if the response has a different structure
      let actualPosts = postsData;
      if (postsData && typeof postsData === 'object' && !Array.isArray(postsData)) {
        // Check common API response patterns
        if (postsData.data && Array.isArray(postsData.data)) {
          console.log('Found posts in data field');
          actualPosts = postsData.data;
        } else if (postsData.posts && Array.isArray(postsData.posts)) {
          console.log('Found posts in posts field');
          actualPosts = postsData.posts;
        } else if (postsData.results && Array.isArray(postsData.results)) {
          console.log('Found posts in results field');
          actualPosts = postsData.results;
        }
      }
      
      console.log('Final posts to set:', actualPosts);
      console.log('Final posts length:', actualPosts?.length);
      
      // Debug each post ID to find the correct field
      if (Array.isArray(actualPosts) && actualPosts.length > 0) {
        console.log('Sample post structure:', actualPosts[0]);
        console.log('Post ID field check:', {
          _id: actualPosts[0]._id,
          id: actualPosts[0].id,
          postId: actualPosts[0].postId,
          objectKeys: Object.keys(actualPosts[0])
        });
      }
      
      // Ensure postsData is an array
      setPosts(Array.isArray(actualPosts) ? actualPosts : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setApiError('Failed to load posts. Please check if the server is running.');
      // Set posts to empty array on error
      setPosts([]);
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

  // Helper function to get the correct post ID
  const getPostId = (post) => {
    if (!post) {
      console.log('getPostId: post is null/undefined');
      return null;
    }
    
    const id = post._id || post.id || post.postId;
    console.log('getPostId found ID:', id, 'for post with authorEmail:', post.authorEmail);
    return id;
  };

  // Check if user owns the post
  const isOwner = (post) => {
    return post.authorEmail === userEmail;
  };

  // Get post owner email
  const getPostOwnerEmail = (post) => {
    return post.authorEmail || post.email || 'Unknown';
  };

  // Get post owner name
  const getPostOwnerName = (post) => {
    console.log('getPostOwnerName called with post:', {
      author: post.author,
      name: post.name,
      authorEmail: post.authorEmail,
      email: post.email
    });
    
    // Try to get a clean name from various fields
    if (post.author && post.author !== post.authorEmail && !post.author.includes('-') && post.author.length < 30) {
      console.log('Using post.author:', post.author);
      return post.author;
    }
    if (post.name && post.name !== post.authorEmail && !post.name.includes('-') && post.name.length < 30) {
      console.log('Using post.name:', post.name);
      return post.name;
    }
    if (post.authorEmail) {
      // Extract name from email (part before @)
      const emailName = post.authorEmail.split('@')[0];
      console.log('Email name extracted:', emailName);
      // If it's not a UUID-like string, use it
      if (!emailName.includes('-') && emailName.length < 20) {
        console.log('Using email name:', emailName);
        return emailName;
      }
    }
    // Fallback to a generic name
    console.log('Using fallback: User');
    return 'User';
  };

  // Get comment author name
  const getCommentAuthorName = (comment) => {
    console.log('getCommentAuthorName called with comment:', {
      author: comment.author,
      name: comment.name,
      authorEmail: comment.authorEmail,
      email: comment.email
    });
    
    // Try to get a clean name from various fields
    if (comment.author && comment.author !== comment.authorEmail && !comment.author.includes('-') && comment.author.length < 30) {
      console.log('Using comment.author:', comment.author);
      return comment.author;
    }
    if (comment.name && comment.name !== comment.authorEmail && !comment.name.includes('-') && comment.name.length < 30) {
      console.log('Using comment.name:', comment.name);
      return comment.name;
    }
    if (comment.authorEmail) {
      // Extract name from email (part before @)
      const emailName = comment.authorEmail.split('@')[0];
      console.log('Comment email name extracted:', emailName);
      // If it's not a UUID-like string, use it
      if (!emailName.includes('-') && emailName.length < 20) {
        console.log('Using comment email name:', emailName);
        return emailName;
      }
    }
    // Fallback to a generic name
    console.log('Using fallback: Anonymous');
    return 'Anonymous';
  };

  // Helper function to check if user has liked/disliked
  const hasUserLiked = (post) => {
    return post.likedBy?.includes(userEmail) || false;
  };

  const hasUserDisliked = (post) => {
    return post.dislikedBy?.includes(userEmail) || false;
  };

  // ---------------------------
  // Likes / Dislikes / Comments
  // ---------------------------
  const handleLike = async (post) => {
    try {
      const hasLiked = hasUserLiked(post);
      const hasDisliked = hasUserDisliked(post);
      const idToken = auth.user?.id_token;
      const postId = getPostId(post);
      
      console.log('Handling like for post ID:', postId, 'hasLiked:', hasLiked, 'hasDisliked:', hasDisliked);
      
      if (!postId) {
        throw new Error('Post ID not found');
      }
      
      // Update UI immediately for better UX
      setPosts(prevPosts => 
        prevPosts.map(p => {
          if (getPostId(p) === postId) {
            if (hasLiked) {
              // User already liked - remove like (toggle off)
              return {
                ...p,
                likesCount: Math.max(0, (p.likesCount || 0) - 1),
                likedBy: (p.likedBy || []).filter(email => email !== userEmail)
              };
            } else {
              // User wants to like
              let updatedPost = { ...p };
              
              // If user has disliked, remove dislike first
              if (hasDisliked) {
                updatedPost = {
                  ...updatedPost,
                  dislikesCount: Math.max(0, (updatedPost.dislikesCount || 0) - 1),
                  dislikedBy: (updatedPost.dislikedBy || []).filter(email => email !== userEmail)
                };
              }
              
              // Add like
              updatedPost = {
                ...updatedPost,
                likesCount: (updatedPost.likesCount || 0) + 1,
                likedBy: [...(updatedPost.likedBy || []), userEmail]
              };
              
              return updatedPost;
            }
          }
          return p;
        })
      );

      try {
        if (hasLiked) {
          // Remove like (backend toggles automatically)
          await PostService.unlikePost(postId, { email: userEmail }, idToken);
          toast({
            title: "Like removed",
            status: "info",
            duration: 2000,
            isClosable: true,
          });
        } else {
          // If user has disliked, remove dislike first
          if (hasDisliked) {
            await PostService.removeDislike(postId, { email: userEmail }, idToken);
          }
          
          // Add like
          await PostService.likePost(postId, { 
            email: userEmail, 
            name: userName 
          }, idToken);
          
          toast({
            title: hasDisliked ? "Dislike removed and post liked!" : "Post liked!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        }
      } catch (apiError) {
        console.error('Like API failed:', apiError);
        
        // Revert the optimistic update if API fails
        setPosts(prevPosts => 
          prevPosts.map(p => {
            if (getPostId(p) === postId) {
              return post; // Use original post data
            }
            return p;
          })
        );
        
        toast({
          title: "Error",
          description: "Failed to update like status",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update like status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDislike = async (post) => {
    try {
      const hasLiked = hasUserLiked(post);
      const hasDisliked = hasUserDisliked(post);
      const idToken = auth.user?.id_token;
      const postId = getPostId(post);
      
      console.log('Handling dislike for post ID:', postId, 'hasLiked:', hasLiked, 'hasDisliked:', hasDisliked);
      
      if (!postId) {
        throw new Error('Post ID not found');
      }
      
      // Update UI immediately for better UX
      setPosts(prevPosts => 
        prevPosts.map(p => {
          if (getPostId(p) === postId) {
            if (hasDisliked) {
              // User already disliked - remove dislike (toggle off)
              return {
                ...p,
                dislikesCount: Math.max(0, (p.dislikesCount || 0) - 1),
                dislikedBy: (p.dislikedBy || []).filter(email => email !== userEmail)
              };
            } else {
              // User wants to dislike
              let updatedPost = { ...p };
              
              // If user has liked, remove like first
              if (hasLiked) {
                updatedPost = {
                  ...updatedPost,
                  likesCount: Math.max(0, (updatedPost.likesCount || 0) - 1),
                  likedBy: (updatedPost.likedBy || []).filter(email => email !== userEmail)
                };
              }
              
              // Add dislike
              updatedPost = {
                ...updatedPost,
                dislikesCount: (updatedPost.dislikesCount || 0) + 1,
                dislikedBy: [...(updatedPost.dislikedBy || []), userEmail]
              };
              
              return updatedPost;
            }
          }
          return p;
        })
      );

      try {
        if (hasDisliked) {
          // Remove dislike (backend toggles automatically)
          await PostService.removeDislike(postId, { email: userEmail }, idToken);
          toast({
            title: "Dislike removed",
            status: "info",
            duration: 2000,
            isClosable: true,
          });
        } else {
          // If user has liked, remove like first
          if (hasLiked) {
            await PostService.unlikePost(postId, { email: userEmail }, idToken);
          }
          
          // Add dislike
          await PostService.dislikePost(postId, { 
            email: userEmail, 
            name: userName 
          }, idToken);
          
          toast({
            title: hasLiked ? "Like removed and post disliked!" : "Post disliked",
            status: "info",
            duration: 2000,
            isClosable: true,
          });
        }
      } catch (apiError) {
        console.error('Dislike API failed:', apiError);
        
        // Revert the optimistic update if API fails
        setPosts(prevPosts => 
          prevPosts.map(p => {
            if (getPostId(p) === postId) {
              return post; // Use original post data
            }
            return p;
          })
        );
        
        toast({
          title: "Error",
          description: "Failed to update dislike status",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error handling dislike:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update dislike status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) {
      toast({
        title: "Comment is empty",
        description: "Please write something before submitting",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const idToken = auth.user?.id_token;
      console.log('Handling comment for post ID:', postId);
      console.log('Comment content:', commentText[postId]);
      console.log('User email:', userEmail);
      console.log('User name:', userName);
      
      if (!postId) {
        throw new Error('Post ID not found');
      }
      
      const commentContent = commentText[postId].trim();
      
      const newComment = {
        _id: Date.now().toString(), // Temporary ID for optimistic update
        authorEmail: userEmail,
        author: userName,
        content: commentContent,
        comment: commentContent, // Fallback field name
        createdAt: new Date().toISOString()
      };

      // Update UI immediately for better UX (optimistic update)
      setPosts(prevPosts =>
        prevPosts.map(p => {
          if (getPostId(p) === postId) {
            return {
              ...p,
              comments: [...(p.comments || []), newComment]
            };
          }
          return p;
        })
      );

      // Clear comment input immediately
      setCommentText({ ...commentText, [postId]: "" });

      try {
        console.log('Sending comment to API...');
        const result = await PostService.addComment(postId, {
          email: userEmail,
          name: userName,
          comment: commentContent,
          content: commentContent, // Try both field names
        }, idToken);
        
        console.log('Comment API success:', result);
        
        toast({
          title: "💬 Comment posted!",
          description: "Your comment was successfully added",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        
        // Refresh posts to get updated data from server
        setTimeout(() => {
          fetchPosts();
        }, 1000);
        
      } catch (apiError) {
        console.error('Comment API failed:', apiError);
        
        // Check if it's a 404 error or endpoint doesn't exist
        if (apiError.message?.includes('404') || 
            apiError.message?.includes('Failed to add comment') ||
            apiError.message?.includes('no working endpoint found')) {
          
          console.log('Comment API endpoint does not exist - keeping local update');
          toast({
            title: "💬 Comment added locally",
            description: "Comments are not synced to server yet, but your comment is visible",
            status: "info",
            duration: 4000,
            isClosable: true,
          });
          
          // Keep the optimistic update since API doesn't exist
          return;
        } else {
          // For other API errors, revert the optimistic update
          setPosts(prevPosts =>
            prevPosts.map(p => {
              if (getPostId(p) === postId) {
                return {
                  ...p,
                  comments: (p.comments || []).filter(c => c._id !== newComment._id)
                };
              }
              return p;
            })
          );
          
          // Restore the comment text
          setCommentText({ ...commentText, [postId]: commentContent });
          
          toast({
            title: "❌ Failed to post comment",
            description: "There was an error saving your comment. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to add comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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

  if (apiError) {
    return (
      <Box minHeight="100vh" bg={bgColor}>
        <Navbar />
        <Container maxW="1200px" py={8}>
          <Alert status="error" borderRadius="xl" p={8}>
            <AlertIcon boxSize="40px" mr={4} />
            <Box>
              <AlertTitle fontSize="lg" mb={2}>
                Unable to load posts
              </AlertTitle>
              <AlertDescription fontSize="md">
                {apiError}
              </AlertDescription>
              <Button 
                mt={4} 
                colorScheme="blue" 
                onClick={fetchPosts}
                leftIcon={<Text as="span">🔄</Text>}
              >
                Try Again
              </Button>
            </Box>
          </Alert>
        </Container>
      </Box>
    );
  }

  // Handle logout and redirect to auth page
  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <Box minHeight="100vh" bg={bgColor}>
      <Navbar />
      <Flex justifyContent="flex-end" px={8} pt={4}>
        <Button colorScheme="red" onClick={handleLogout} size="sm">
          Logout
        </Button>
      </Flex>
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
          {!Array.isArray(posts) || posts.length === 0 ? (
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody textAlign="center" py={16}>
                <VStack spacing={6}>
                  <Text fontSize="8xl">📝</Text>
                  <Heading size="lg" color={mutedTextColor}>
                    {Array.isArray(posts) ? "No posts yet" : "Loading posts..."}
                  </Heading>
                  <Text color={textColor} maxW="md" fontSize="lg">
                    {Array.isArray(posts) 
                      ? "Be the first to share something with the community!" 
                      : `Posts state: ${typeof posts}, Length: ${posts?.length || 'undefined'}`
                    }
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
            Array.isArray(posts) && posts.map((post, index) => {
              const currentPostId = getPostId(post);
              console.log('In map function, currentPostId:', currentPostId, 'for post index:', index);
              
              // Use index as fallback for key if postId is null/undefined
              const keyValue = currentPostId || `post-${index}`;
              
              return (
              <Card 
                key={keyValue} 
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
                          name={getPostOwnerName(post)}
                          bg="blue.500"
                          color="white"
                          fontWeight="bold"
                        />
                        <VStack spacing={1} align="start">
                          <Text fontWeight="bold" color={headingColor} fontSize="lg">
                            {getPostOwnerName(post)}
                          </Text>
                          <HStack spacing={2}>
                            <Text fontSize="sm" color="blue.600" fontWeight="medium">
                              📧 {getPostOwnerEmail(post)}
                            </Text>
                          </HStack>
                          <Text fontSize="sm" color={mutedTextColor}>
                            🕒 {getTimeAgo(post.createdAt)}
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
                        {post.content || post.postCreate}
                      </Text>
                    </Box>

                    {/* Interaction Buttons */}
                    <HStack spacing={5} pt={3}>
                      <Button
                        onClick={() => handleLike(post)}
                        variant={hasUserLiked(post) ? "solid" : "outline"}
                        colorScheme="blue"
                        size="md"
                        leftIcon={<Text as="span" fontSize="lg">👍</Text>}
                        _hover={{ transform: "translateY(-1px)" }}
                        transition="all 0.2s"
                        borderRadius="full"
                        px={6}
                      >
                        {post.likesCount || 0}
                      </Button>
                      
                      <Button
                        onClick={() => handleDislike(post)}
                        variant={hasUserDisliked(post) ? "solid" : "outline"}
                        colorScheme="red"
                        size="md"
                        leftIcon={<Text as="span" fontSize="lg">👎</Text>}
                        _hover={{ transform: "translateY(-1px)" }}
                        transition="all 0.2s"
                        borderRadius="full"
                        px={6}
                      >
                        {post.dislikesCount || 0}
                      </Button>

                      <Button
                        onClick={() => {
                          if (currentPostId) {
                            toggleComments(currentPostId);
                          } else {
                            console.error('Cannot toggle comments: Post ID is undefined');
                          }
                        }}
                        variant="ghost"
                        size="md"
                        leftIcon={<Text as="span" fontSize="lg">💬</Text>}
                        _hover={{ bg: buttonHoverBg }}
                        borderRadius="full"
                        px={6}
                      >
                        {(post.comments || []).length} Comments
                      </Button>
                    </HStack>

                    <Divider />

                    {/* Comments Section */}
                    <VStack spacing={4} align="stretch">
                      {/* Add Comment */}
                      <HStack spacing={4}>
                        <Avatar
                          size="md"
                          name={userName}
                          bg="gray.400"
                          color="white"
                        />
                        <InputGroup>
                          <Input
                            placeholder="Write a comment..."
                            value={commentText[currentPostId || 'unknown'] || ""}
                            onChange={(e) =>
                              setCommentText({ ...commentText, [currentPostId || 'unknown']: e.target.value })
                            }
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (currentPostId && commentText[currentPostId]?.trim()) {
                                  handleComment(currentPostId);
                                }
                              }
                            }}
                            borderRadius="full"
                            bg={inputBg}
                            border="1px"
                            borderColor={borderColor}
                            _focus={{ borderColor: "blue.400", bg: inputFocusBg }}
                            size="lg"
                            py={3}
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              onClick={() => {
                                if (currentPostId) {
                                  handleComment(currentPostId);
                                } else {
                                  console.error('Cannot add comment: Post ID is undefined');
                                  toast({
                                    title: "Error",
                                    description: "Post ID not found",
                                    status: "error",
                                    duration: 2000,
                                    isClosable: true,
                                  });
                                }
                              }}
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                              borderRadius="full"
                              isDisabled={!currentPostId || !commentText[currentPostId]?.trim()}
                              _hover={{ bg: "blue.100" }}
                            >
                              📤 Send
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </HStack>

                      {/* Comments List */}
                      {Array.isArray(post.comments) && post.comments.length > 0 && (
                        <VStack spacing={4} align="stretch">
                          {/* Show first 2 comments, then expand button */}
                          {(expandedComments[currentPostId || 'unknown'] ? post.comments : post.comments.slice(0, 2))
                            .map((comment, index) => (
                            <Box
                              key={comment._id || comment.createdAt || index}
                              bg={commentBg}
                              p={4}
                              borderRadius="lg"
                              border="1px"
                              borderColor={borderColor}
                            >
                              <HStack spacing={3} align="start">
                                <Avatar
                                  size="sm"
                                  name={getCommentAuthorName(comment)}
                                  bg="purple.500"
                                  color="white"
                                />
                                <VStack spacing={1} align="start" flex={1}>
                                  <HStack spacing={2}>
                                    <Text fontWeight="bold" fontSize="md" color={headingColor}>
                                      {getCommentAuthorName(comment)}
                                    </Text>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                      {getTimeAgo(comment.createdAt)}
                                    </Text>
                                  </HStack>
                                  <Text fontSize="md" color={textColor} lineHeight="1.5">
                                    {comment.content || comment.comment}
                                  </Text>
                                </VStack>
                              </HStack>
                            </Box>
                          ))}
                          
                          {/* Expand/Collapse Comments */}
                          {post.comments.length > 2 && (
                            <Button
                              onClick={() => {
                                if (currentPostId) {
                                  toggleComments(currentPostId);
                                } else {
                                  console.error('Cannot toggle comments: Post ID is undefined');
                                }
                              }}
                              variant="ghost"
                              size="sm"
                              color="blue.500"
                              _hover={{ bg: expandButtonHoverBg }}
                            >
                              {expandedComments[currentPostId || 'unknown'] 
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
            );
            })
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;
