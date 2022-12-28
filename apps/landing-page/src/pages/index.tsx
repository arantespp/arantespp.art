import * as React from 'react';
import { Box, Button, Flex, Heading, Image, Text, useTheme } from '@ttoss/ui';
import { InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import { getAccountData, getAccountMedia } from '../lib/instagram';
import { mapData } from '../lib/instagram';
import { transparentize } from '@theme-ui/color';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import ReactModal from 'react-modal';

export const getStaticProps = async () => {
  const [accountData, media] = await Promise.all([
    getAccountData(),
    getAccountMedia(),
  ]);

  const mostLikedMedia = [...media.data].sort((a, b) => {
    return b.likeCount - a.likeCount;
  })[0];

  /**
   * Get first sentence before break line
   */
  const tagline = accountData.biography.split('\n')[0];

  return {
    props: {
      accountData,
      mostLikedMedia,
      media,
      tagline,
    },
    revalidate: 60,
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

type Media = Props['media']['data'][number];

const Navbar = () => {
  return (
    <Flex
      as="nav"
      sx={{
        width: '100%',
        paddingTop: 3,
        paddingBottom: 3,
        paddingX: [3, 4, 5],
        backgroundColor: transparentize('black', 0.3),
        boxShadow: 'box',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: ['column', 'row', 'row'],
      }}
    >
      <Text
        sx={{
          fontFamily: 'logo',
          color: 'primary',
          fontWeight: 'bold',
          fontSize: '5xl',
          textShadow: 'text',
        }}
      >
        arantespp.art
      </Text>
      <Flex
        sx={{
          gap: [4, 4, 5],
          alignItems: 'center',
        }}
      >
        <Link href="https://instagram.com/arantespp.art">
          <Image
            src="/instagram.png"
            sx={{
              height: 40,
              width: 40,
              cursor: 'pointer',
              boxShadow: 'image',
              ':hover': {
                boxShadow: 'box',
              },
            }}
          />
        </Link>
        <Link href="https://arantespp.com/me">
          <Text
            sx={{
              fontSize: '3xl',
              fontWeight: 'bold',
              textShadow: 'text',
              ':hover': {
                textShadow: 'none',
                color: 'primary',
              },
            }}
          >
            Me
          </Text>
        </Link>
      </Flex>
    </Flex>
  );
};

const Hero = ({ mostLikedMedia, tagline }: Props) => {
  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${mostLikedMedia.mediaUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '50vh',
          boxShadow: 'box',
        }}
      >
        <Navbar />
      </Box>
      <Flex
        sx={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingX: 2,
        }}
      >
        <Text
          as="h1"
          sx={{
            fontSize: ['1xl', '2xl', '3xl'],
            marginX: 2,
            marginY: 4,
            fontStyle: 'italic',
            textShadow: 'text',
            maxWidth: 700,
            textAlign: 'center',
            fontWeight: 'normal',
          }}
        >
          {tagline}
        </Text>
      </Flex>
    </>
  );
};

const ArtCard = ({ media }: { media: Media }) => {
  const { theme } = useTheme();

  /**
   * Remove all words that start with a hashtag
   */
  const caption = media.caption.replace(/#\w+/g, '').trim();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <Flex
        onClick={() => {
          return setIsModalOpen(true);
        }}
        sx={{
          flexDirection: 'column',
          maxWidth: 400,
          boxShadow: 'box',
          borderRadius: 'border',
          cursor: 'pointer',
          ':hover': {
            boxShadow: 'hover',
          },
        }}
      >
        <Image
          src={media.mediaUrl}
          sx={{
            height: ['100%', 400],
            width: ['100%', 400],
            objectFit: 'cover',
            boxShadow: 'image',
            borderTopLeftRadius: 'border',
            borderTopRightRadius: 'border',
          }}
        />
        <Box
          sx={{
            padding: 3,
            minHeight: 100,
            borderBottomLeftRadius: 'border',
            borderBottomRightRadius: 'border',
            backgroundColor: transparentize('secondary', 0.9),
          }}
        >
          <Text sx={{ whiteSpace: 'pre-wrap', fontSize: 'xl' }}>{caption}</Text>
        </Box>
      </Flex>
      <ReactModal
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            width: '100vw',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
          },
          content: {
            maxHeight: '95%',
            overflow: 'hidden',
            border: 'none',
            boxShadow: (theme?.shadows as any).image,
          },
        }}
        contentLabel={caption}
        isOpen={isModalOpen}
        onRequestClose={() => {
          return setIsModalOpen(false);
        }}
      >
        <Image
          src={media.mediaUrl}
          sx={{
            width: ['90vw', 'auto'],
            height: ['auto', '90vh'],
            objectFit: 'contain',
          }}
        />
      </ReactModal>
    </>
  );
};

const Arts = ({ media }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<{
    data: Media[];
    paging: {
      next?: string;
    };
  }>(
    ['arts'],
    async ({ pageParam }) => {
      if (!pageParam) {
        return media;
      }
      const res = await fetch(pageParam);
      const data = await res.json();
      return {
        data: data.data.map(mapData),
        paging: data.paging,
      };
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.paging.next;
      },
      keepPreviousData: true,
    }
  );

  const arts =
    data?.pages.flatMap((page) => {
      return page.data;
    }) || [];

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: [3, 4, 4],
      }}
    >
      <Heading
        as="h2"
        sx={{ fontSize: ['5xl', '5xl', '6xl'], textShadow: 'text' }}
      >
        Arts
      </Heading>
      <Flex
        sx={{
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'baseline',
          gap: [4, 4, 5],
          marginY: [4, 4, 5],
          marginX: 4,
          maxWidth: 1400,
        }}
      >
        {arts.map((art) => {
          return <ArtCard key={art.id} media={art} />;
        })}
      </Flex>
      {hasNextPage && (
        <Button
          onClick={() => {
            return fetchNextPage();
          }}
          disabled={isFetching}
          sx={{
            fontSize: '2xl',
          }}
        >
          Load More
        </Button>
      )}
    </Flex>
  );
};

const Footer = () => {
  return (
    <Flex
      as="footer"
      sx={{
        width: '100%',
        paddingX: 4,
        marginY: 5,
        justifyContent: 'center',
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        <Link href="https://instagram.com/arantespp.art">
          <Text>Instagram</Text>
        </Link>
        <Link href="https://arantespp.com/me">
          <Text>About Me</Text>
        </Link>
      </Flex>
    </Flex>
  );
};

const Index = (props: Props) => {
  return (
    <>
      <NextSeo
        title="arantespp.art"
        description={props.tagline}
        openGraph={{
          title: 'arantespp.art',
          description: props.tagline,
          images: [
            {
              url: props.mostLikedMedia.mediaUrl,
              alt: 'Most liked art',
            },
          ],
        }}
      />
      <Box as="main" id="main">
        <Hero {...props} />
        <Arts {...props} />
        <Footer />
      </Box>
    </>
  );
};

ReactModal.setAppElement('#main');

ReactModal.defaultStyles.content = {};

export default Index;
