const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event, null, 2));
        
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(await handleOperation(event))
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

async function handleOperation(event) {
    // Handle AppSync operations
    switch (event.typeName) {
        case 'Mutation':
            switch (event.fieldName) {
                case 'createPost':
                    return handleCreatePost(event);
                case 'createComment':
                    return handleCreateComment(event);
                default:
                    throw new Error(`Unhandled field: ${event.fieldName}`);
            }
        case 'Query':
            return handleQuery(event);
        default:
            throw new Error(`Unhandled type: ${event.typeName}`);
    }
}

async function handleCreatePost(event) {
    const { input } = event.arguments;
    const item = {
        ...input,
        likeCount: 0,
        dislikeCount: 0,
        createdAt: new Date().toISOString(),
    };
    
    await docClient.put({
        TableName: process.env.API_PROFILESAPP_POSTTABLE_NAME,
        Item: item
    }).promise();
    
    return item;
}

async function handleCreateComment(event) {
    const { input } = event.arguments;
    const item = {
        ...input,
        createdAt: new Date().toISOString()
    };
    
    await docClient.put({
        TableName: process.env.API_PROFILESAPP_COMMENTTABLE_NAME,
        Item: item
    }).promise();
    
    return item;
}

async function handleQuery(event) {
    const { tableName, id } = event.arguments;
    
    if (tableName === 'POST') {
        const post = await docClient.get({
            TableName: process.env.API_PROFILESAPP_POSTTABLE_NAME,
            Key: { id }
        }).promise();
        
        if (post.Item) {
            const comments = await docClient.query({
                TableName: process.env.API_PROFILESAPP_COMMENTTABLE_NAME,
                KeyConditionExpression: 'postID = :postId',
                ExpressionAttributeValues: {
                    ':postId': id
                }
            }).promise();
            
            return {
                ...post.Item,
                comments: comments.Items || []
            };
        }
    }
    
    return null;
}
