import { Box, Icon, VStack } from "@chakra-ui/react";
import { MdOutlineMailOutline, MdRssFeed } from 'react-icons/md';
import { FaTwitter, FaGithub } from 'react-icons/fa';

export default function FloatingSocialNavbar () {
  return (
    <Box
      position="fixed"
      top={28}
      right="0"
      width={'32px'}
      height={'140px'}
      backgroundColor="#181919"
      border="1px solid white"
      p={2}
      zIndex={1}
    >
      <VStack>
        <a href={`https://twitter.com/reddirtmining`} target='_blank' rel='noopener noreferrer'>
          <Icon as={FaTwitter} color="white" boxSize={5} />
        </a>
        <a href={`https://github.com/Red-Dirt-Mining/calculator`} target='_blank' rel='noopener noreferrer'>
          <Icon as={FaGithub} color="white" boxSize={5} />
        </a>
        <a href={'mailto:info@reddirtmining.io'}>
          <Icon as={MdOutlineMailOutline} color="white" boxSize={5} />
        </a>
        <a href={`https://anchor.fm/s/9b9b2abc/podcast/rss`} target='_blank' rel='noopener noreferrer'>
          <Icon as={MdRssFeed} color="white" boxSize={5} />
        </a>
      </VStack>
    </Box>
  )
}
