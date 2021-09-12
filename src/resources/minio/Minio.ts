const {Client} = require('minio');

export const uploadFileToMinio = ({ bucket, fileName, buff }) => {
    const minioClient = getMinioClient();
    return new Promise((resolve, reject) => {
        minioClient.putObject(bucket, fileName, buff, (err, etag) => {
            if (err) {
                reject([err]);
                return;
            }
            resolve([null, etag]);
        });
    });
};


const getMinioClient = () =>
{
    return new Client({
        endPoint: process.env.MINIO_ENDPOINT,
        port: +process.env.MINIO_PORT,
        useSSL: !!+process.env.MINIO_USE_SSL,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
    });
}

