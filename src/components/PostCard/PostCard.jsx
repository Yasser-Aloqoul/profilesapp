import React from 'react';
import { 
  Card, 
  CardBody, 
  Box, 
  Text, 
  Button, 
  HStack, 
  VStack, 
  Avatar,
  useColorModeValue 
} from '@chakra-ui/react';

const PostCard = ({ post, currentUser, onLike, onDislike, onComment }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const handleLike = () => {
    if (onLike) onLike(post);
  };

  const handleDislike = () => {
    if (onDislike) onDislike(post);
  };

  return (
    <Card bg={cardBg} shadow="md" borderRadius="lg">
      <CardBody>
        <VStack spacing={4} align="stretch">
          <HStack spacing={3}>
            <Avatar
              size="sm"
              name={post.userEmail || post.owner}
              bg="blue.500"
              color="white"
            />
            <VStack spacing={0} align="start">
              <Text fontWeight="bold">{post.userEmail || post.owner}</Text>
              <Text fontSize="sm" color={textColor}>
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </VStack>
          </HStack>
          
          <Text>{post.content}</Text>
          
          <HStack spacing={4}>
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              onClick={handleLike}
              leftIcon={<Text>👍</Text>}
            >
              {(post.likes || []).length}
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={handleDislike}
              leftIcon={<Text>👎</Text>}
            >
              {(post.dislikes || []).length}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Text>💬</Text>}
            >
              {(post.comments || []).length} Comments
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default PostCard;
