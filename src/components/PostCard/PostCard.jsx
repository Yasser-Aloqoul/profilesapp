import { Card, Flex, Text, Button } from '@aws-amplify/ui-react';
import { API } from 'aws-amplify';
import { updatePost } from '../../graphql/mutations';

const PostCard = ({ post, currentUser }) => {
  const handleLike = async () => {
    try {
      await API.graphql({
        query: updatePost,
        variables: {
          input: {
            id: post.id,
            likeCount: post.likeCount + 1,
            likedBy: [...(post.likedBy || []), currentUser]
          }
        }
      });
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <Card>
      <Flex direction="column">
        <Text>{post.content}</Text>
        <Text>Posted by: {post.owner}</Text>
        <Flex>
          <Button onClick={handleLike}>
            Like ({post.likeCount})
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default PostCard;
