import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../../config";
import { generateUuid } from "../../services/dynamodb-keys";

export class AppMediaComponent {
    constructor(){}

    public static build(): AppMediaComponent {
        return new AppMediaComponent();
    }

    public async generatePresignedUrl(dto: any){

        const ext =
            dto.contentType === "image/png" ? "png" :
            dto.contentType === "image/webp" ? "webp" :
            "jpg";

        const imageId = generateUuid();

        const imageKey =
            dto.imageType === "profile"
            ? `profiles/${dto.userId}/avatar-${imageId}.${ext}`
            : `posts/${dto.userId}/${imageId}.${ext}`;

        const client = new S3Client({
            region: config.region,
            requestChecksumCalculation: "WHEN_REQUIRED"
        });
        const command = new PutObjectCommand({
            Bucket: "diegos-demo-bucket", // TODO: Store in config and retrieve from PROCESS.ENV
            Key: imageKey,
            ContentType: dto.contentType
        });
        
        const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
        const pictureUrl = `https://diegos-demo-bucket.s3.${config.region}.amazonaws.com/${imageKey}`
        return {uploadUrl, imageKey, pictureUrl};
    }
}