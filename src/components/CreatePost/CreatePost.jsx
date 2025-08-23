import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Textarea,
  Button,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Text,
  useColorModeValue,
  Divider,
  useToast,
  Container,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Progress,
  Spinner,
} from "@chakra-ui/react";
import { useAuth } from "react-oidc-context";
import Navbar from "../Navbar/Navbar";

import { useNavigate } from "react-router-dom";
import PostService from "../../services/PostService";

const CreatePost = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const MAX_CONTENT_LENGTH = 500;
  const userEmail = auth.user?.profile?.email || "User";
  const userName = auth.user?.profile?.name || auth.user?.profile?.email || "User";

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const validateForm = () => {
    const newErrors = {};
    if (!content.trim()) {
      newErrors.content = "Post content is required";
    } else if (content.length > MAX_CONTENT_LENGTH) {
      newErrors.content = `Content must be ${MAX_CONTENT_LENGTH} characters or less`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    setContent(value);
    if (errors.content && value.trim()) {
      setErrors((prev) => ({ ...prev, content: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const postData = {
        email: userEmail,
        name: userName,
        content: content.trim()  // Changed from postCreate to content
      };

      const idToken = auth.user?.id_token;
      await PostService.createPost(postData, idToken);

      toast({
        title: "Post created successfully!",
        description: "Your post has been shared with the community.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setContent("");
      setErrors({});
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error creating post",
        description: error.message || "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Box minHeight="100vh" bg={bgColor}>
      <Navbar />

      <Container maxW="800px" py={10}>
        <VStack spacing={8} align="stretch">
          {/* Page Header */}
          <VStack spacing={4} textAlign="center">
            <Box fontSize="5xl">✍️</Box>
            <Heading size="xl" color={useColorModeValue("gray.700", "gray.200")}>
              Create a New Post
            </Heading>
            <Text color={textColor} fontSize="lg">
              Share your thoughts with the community. What's on your mind today?
            </Text>
          </VStack>

          {/* Create Post Card */}
          <Card
            bg={cardBg}
            shadow="xl"
            borderRadius="2xl"
            border="1px"
            borderColor={borderColor}
            p={8}
          >
            <CardHeader pb={4}>
              <HStack spacing={4}>
                <Avatar
                  size="lg"
                  name={userName}
                  bg="blue.500"
                  color="white"
                  fontWeight="bold"
                />
                <VStack spacing={0} align="start">
                  <Text fontWeight="bold" fontSize="lg" color={useColorModeValue("gray.700", "gray.200")}>
                    {userName}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Creating a post
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>

            <Divider />

            <CardBody pt={6}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  <FormControl isRequired isInvalid={errors.content}>
                    <FormLabel fontWeight="medium" color={useColorModeValue("gray.700", "gray.200")}>
                      What's on your mind?
                    </FormLabel>
                    <Textarea
                      value={content}
                      onChange={handleContentChange}
                      placeholder="Share your thoughts, ideas, or experiences..."
                      bg={useColorModeValue("gray.50", "gray.700")}
                      color={useColorModeValue("gray.800", "gray.100")}
                      border="2px"
                      borderColor={borderColor}
                      borderRadius="lg"
                      _focus={{
                        borderColor: "blue.400",
                        bg: useColorModeValue("white", "gray.600"),
                        color: useColorModeValue("gray.800", "gray.100"),
                        shadow: "0 0 0 1px #4299e1",
                      }}
                      _hover={{ borderColor: useColorModeValue("gray.300", "gray.600") }}
                      _placeholder={{ 
                        color: useColorModeValue("gray.500", "gray.400") 
                      }}
                      minH="250px"
                      fontSize="md"
                      lineHeight="1.6"
                      resize="vertical"
                      p={4}
                    />
                    <Flex justifyContent="space-between" mt={2}>
                      <FormHelperText mb={0}>Express yourself freely</FormHelperText>
                      <Text
                        fontSize="sm"
                        color={content.length > MAX_CONTENT_LENGTH ? "red.500" : textColor}
                        fontWeight="medium"
                      >
                        {content.length}/{MAX_CONTENT_LENGTH}
                      </Text>
                    </Flex>
                    <Progress
                      value={(content.length / MAX_CONTENT_LENGTH) * 100}
                      size="sm"
                      colorScheme={content.length > MAX_CONTENT_LENGTH ? "red" : "blue"}
                      borderRadius="full"
                      mt={2}
                    />
                    <FormErrorMessage>{errors.content}</FormErrorMessage>
                  </FormControl>

                  <Divider />

                  <HStack spacing={4} justifyContent="flex-end">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="lg"
                      borderRadius="full"
                      _hover={{ transform: "translateY(-1px)" }}
                      transition="all 0.2s"
                      isDisabled={isSubmitting}
                    >
                      ❌ Cancel
                    </Button>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      borderRadius="full"
                      leftIcon={isSubmitting ? <Spinner size="sm" /> : <Text>📤</Text>}
                      _hover={{ transform: "translateY(-1px)", shadow: "lg" }}
                      transition="all 0.2s"
                      isDisabled={!content.trim() || isSubmitting || content.length > MAX_CONTENT_LENGTH}
                      isLoading={isSubmitting}
                      loadingText="Posting..."
                      minW="160px"
                    >
                      {isSubmitting ? "Posting..." : "Share Post"}
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Tips Card */}
          <Card bg="blue.50" borderColor="blue.200" border="1px" borderRadius="lg">
            <CardBody py={4}>
              <VStack spacing={3} align="start">
                <HStack>
                  <Text fontSize="lg">💡</Text>
                  <Text fontWeight="bold" color="blue.700">
                    Tips for great posts
                  </Text>
                </HStack>
                <VStack spacing={1} align="start" fontSize="sm" color="blue.600">
                  <Text>• Be authentic and share your genuine thoughts</Text>
                  <Text>• Use clear and engaging language</Text>
                  <Text>• Consider your audience and be respectful</Text>
                  <Text>• Add relevant details to make your post interesting</Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default CreatePost;
