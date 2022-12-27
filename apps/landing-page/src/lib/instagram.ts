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

export const mapData = (data: any) => {
  return {
    id: data.id as string,
    caption: data.caption as string,
    mediaUrl: data.media_url as string,
    likeCount: data.like_count as number,
    permalink: data.permalink as string,
    timestamp: data.timestamp as string,
  };
};

export const getAccountMedia = async () => {
  const response = await fetch(
    `${GRAPH_API_ENDPOINT}/${INSTAGRAM_ACCOUNT_ID}/media?fields=caption,media_url,permalink,timestamp,thumbnail_url,media_type,like_count,comments_count&access_token=${INSTAGRAM_ACCESS_TOKEN}`
  );
  const data = await response.json();
  return {
    data: (data.data as any[]).map(mapData),
    paging: {
      cursors: {
        before: data.paging.cursors.before as string,
        after: data.paging.cursors.after as string,
      },
      next: data.paging.next as string | undefined,
    },
  };
};
