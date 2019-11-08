module.exports = {
    aws_table_name: 'movies-dynamodb-nodejs',
    aws_local_config: {
        region: 'local',
        endpoint: 'http://localhost:8000'
    },
    aws_remote_config: {
        accessKeyId: 'ACCESS_KEY_ID',
        secretAccessKey: 'SECRET_ACCESS_KEY',
        region: 'us-east-1'
    }
};