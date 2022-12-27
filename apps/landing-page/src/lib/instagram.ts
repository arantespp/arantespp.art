const GRAPH_API_ENDPOINT = 'https://graph.facebook.com/v15.0';

const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export const getAccountData = async () => {
  const response = await fetch(
    `${GRAPH_API_ENDPOINT}/${INSTAGRAM_ACCOUNT_ID}?fields=biography,username,media_count,profile_picture_url&access_token=${INSTAGRAM_ACCESS_TOKEN}`
  );
  const data = await response.json();
  return {
    biography: data.biography as string,
  };
};

export const getAccountMedia = async () => {
  const response = await fetch(
    `${GRAPH_API_ENDPOINT}/${INSTAGRAM_ACCOUNT_ID}/media?fields=caption,media_url,permalink,timestamp,thumbnail_url,media_type,like_count,comments_count&access_token=${INSTAGRAM_ACCESS_TOKEN}`
  );
  const data = await response.json();
  return {
    data: (data.data as any[]).map((item: any) => {
      return {
        id: item.id as string,
        caption: item.caption as string,
        mediaUrl: item.media_url as string,
        likeCount: item.like_count as number,
        permalink: item.permalink as string,
        timestamp: item.timestamp as string,
      };
    }),
  };
};
