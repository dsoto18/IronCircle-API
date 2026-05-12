export type ExplorePost = {
    PK: string; // EXPLORE#POSTS
    SK: string;
    entity: string;
    sourceId: string;
    sourceName: string;
    sourceType: string;
    isVerified: boolean;
    contentType: string;
    title: string;
    summary: string;
    ctaLabel?: string;
    metadataLabel?: string;
    tags?: string[];
    createdAt: string;
}