const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    if (!event.arguments || !event.arguments.post) {
        return null;
    }

    const post = {
        id: event.arguments.post.id,
        type: 'POST',
        content: event.arguments.post.content,
        userId: event.identity.sub,
        likeCount: 0,
        dislikeCount: 0,
        createdAt: new Date().toISOString(),
    };

    try {
        await documentClient.put({
            TableName: 'Y-App',
            Item: post
        }).promise();

        return post;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Could not create post');
    }
};
