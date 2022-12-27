import { Box, Flex, Heading, Image, Text } from '@ttoss/ui';
import { InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import { getAccountData, getAccountMedia } from '../lib/instagram';
import { transparentize } from '@theme-ui/color';
import Link from 'next/link';

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
        paddingTop: 3,
        paddingBottom: 3,
        paddingX: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
        }}
      >
        arantespp.art
      </Text>
      <Flex sx={{ gap: [4, 4, 5], alignItems: 'end' }}>
        <Link href="https://instagram.com/arantespp.art">
          <Image
            src="/instagram.png"
            sx={{ height: 32, width: 32, cursor: 'pointer' }}
          />
        </Link>
        <Link href="https://arantespp.com/me">
          <Text
            sx={{
              fontSize: '3xl',
              fontWeight: 'bold',
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
    <Box
      sx={{
        backgroundImage: `url(${mostLikedMedia.mediaUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '60vh',
        boxShadow: 'box',
        position: 'relative',
      }}
    >
      <Navbar />
      <Flex
        sx={{
          top: 0,
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          paddingX: 2,
        }}
      >
        <Text
          as="h1"
          sx={{
            color: 'white',
            fontSize: ['3xl', '4xl', '5xl'],
            paddingX: 4,
            paddingY: 3,
            borderRadius: 'border',
            backgroundColor: transparentize('primary', 0.3),
            boxShadow: 'box',
            fontStyle: 'italic',
            maxWidth: 1000,
            textAlign: 'center',
            fontWeight: 'normal',
          }}
        >
          {tagline}
        </Text>
      </Flex>
    </Box>
  );
};

const ArtCard = ({ media }: { media: Media }) => {
  /**
   * Remove all words that start with a hashtag
   */
  const caption = media.caption.replace(/#\w+/g, '').trim();

  return (
    <Link href={media.permalink}>
      <Flex
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
    </Link>
  );
};

const Arts = ({ media }: Props) => {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: [4, 5, 6],
      }}
    >
      <Heading
        as="h2"
        sx={{ fontSize: ['4xl', '5xl', '6xl'], textShadow: 'text' }}
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
          marginX: [2, 3, 4],
          maxWidth: 1400,
        }}
      >
        {media.data.map((media) => {
          return <ArtCard key={media.id} media={media} />;
        })}
      </Flex>
    </Flex>
  );
};

const Footer = () => {
  return (
    <Flex
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
      <Box as="main">
        <Hero {...props} />
        <Arts {...props} />
        <Footer />
      </Box>
    </>
  );
};

export default Index;
