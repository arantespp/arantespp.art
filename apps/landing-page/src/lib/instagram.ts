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
    `${GRAPH_API_ENDPOINT}/${INSTAGRAM_ACCOUNT_ID}/media?fields=caption,media_url,permalink,timestamp,thumbnail_url,media_type,like_count,comments_count&limit=24&access_token=${INSTAGRAM_ACCESS_TOKEN}`
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

const allHashtags = [
  '#aiart',
  '#aiartcommunity',
  '#aiartdaily',
  '#aiartist',
  '#aiartoftheday',
  '#aiartwork',
  '#artificialart',
  '#artificialintelligence',
  '#digitalart',
  '#computergenerated',
  '#futureart',
  '#generativeart',
  '#midjourney',
  '#midjourneyart',
  '#neuralstyle',
  '#thisisaiart',
] as const;

/**
 * Choose n hashtags from the list of all hashtags at random and without
 * duplicates.
 */
const chooseHashtags = (n: number) => {
  const hashtags: string[] = [];
  while (hashtags.length < n) {
    const randomIndex = Math.floor(Math.random() * allHashtags.length);
    const randomHashtag = allHashtags[randomIndex];
    if (!hashtags.includes(randomHashtag)) {
      hashtags.push(randomHashtag);
    }
  }
  return hashtags.sort();
};

const postMedia = async ({
  caption,
  imageUrl,
  isCarouselItem,
  mediaType,
  children,
  usernames,
}: {
  caption?: string;
  imageUrl?: string;
  isCarouselItem?: boolean;
  mediaType?: 'CAROUSEL' | undefined;
  children?: string[];
  usernames?: string[];
}) => {
  const queryParametersObj = {
    access_token: INSTAGRAM_ACCESS_TOKEN,
    caption,
    image_url: imageUrl,
    is_carousel_item: isCarouselItem,
    media_type: mediaType,
    children: children?.join(','),
    user_tags: usernames
      ? JSON.stringify([
          {
            username: usernames[0],
            x: 0.1,
            y: 0.1,
          },
        ])
      : undefined,
  };

  const queryParameters = Object.entries(queryParametersObj)
    .filter(([, value]) => {
      return value;
    })
    .map(([key, value]) => {
      return `${key}=${encodeURIComponent(value as string)}`;
    })
    .join('&');

  const { id, error } = await fetch(
    `${GRAPH_API_ENDPOINT}/${INSTAGRAM_ACCOUNT_ID}/media?${queryParameters}`,
    {
      method: 'POST',
    }
  ).then((res) => {
    return res.json() as Promise<{ id: string; error?: any }>;
  });

  if (error) {
    throw error;
  }

  return { id };
};

const createCarouselContainer = async ({
  caption,
  urls,
  usernames,
}: {
  caption: string;
  urls: string[];
  usernames?: string[];
}) => {
  /**
   * https://developers.facebook.com/docs/instagram-api/guides/content-publishing#etapa-1-de-3--criar-o-cont-iner-de-item
   */
  const ids = await Promise.all(
    urls.map((url) => {
      return postMedia({ imageUrl: url, isCarouselItem: true, usernames }).then(
        ({ id }) => {
          return id;
        }
      );
    })
  );

  /**
   * https://developers.facebook.com/docs/instagram-api/guides/content-publishing#etapa-2-de-3--criar-o-cont-iner-de-carrossel
   */
  const { id } = await postMedia({
    caption,
    mediaType: 'CAROUSEL',
    children: ids,
  });

  return { id };
};

const postMediaPublish = async ({ creationId }: { creationId: string }) => {
  const response = await fetch(
    `${GRAPH_API_ENDPOINT}/${INSTAGRAM_ACCOUNT_ID}/media_publish?creation_id=${creationId}&access_token=${INSTAGRAM_ACCESS_TOKEN}`,
    {
      method: 'POST',
    }
  ).then((res) => {
    return res.json() as Promise<{ id: string; error?: any }>;
  });

  if (response.error) {
    throw response.error;
  }

  return response;
};

const getMedia = async ({ mediaId }: { mediaId: string }) => {
  const response = await fetch(
    `${GRAPH_API_ENDPOINT}/${mediaId}?fields=permalink&access_token=${INSTAGRAM_ACCESS_TOKEN}`
  ).then((res) => {
    return res.json() as Promise<{ permalink: string }>;
  });

  return response;
};

export const publishArt = async (message: string) => {
  /**
   * Get URLs, that is all words that start with http or https.
   */
  const urls = message.match(/https?:\/\/\S+/g) || [];

  /**
   * Get description, that is the message without the URLs.
   */
  const description = message.replace(/https?:\/\/\S+/g, '').trim();

  /**
   * Get username, that is a word that starts with @.
   */
  const username = message.match(/@\S+/g)?.[0];

  const caption = `${description}\n\n${chooseHashtags(5).join(' ')}`;

  const usernames = username ? [username.replace('@', '')] : undefined;

  const creationId = await (async () => {
    if (urls.length === 1) {
      const { id } = await postMedia({
        caption,
        imageUrl: urls[0],
        usernames,
      });

      return id;
    }

    const { id } = await createCarouselContainer({
      caption,
      urls,
      usernames,
    });

    return id;
  })();

  const { id: mediaId } = await postMediaPublish({ creationId });

  const { permalink } = await getMedia({ mediaId });

  return { permalink };
};
