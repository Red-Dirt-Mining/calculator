import {
  Container,
  Text,
  Box,
  Icon,
  Stack,
  Image,
  Link,
  Center,
} from '@chakra-ui/react';
import { MdMailOutline, MdOutlinePodcasts } from 'react-icons/md';
import { FaTwitter, FaGithub, FaLinkedin, FaMeetup } from 'react-icons/fa';
import { basePath, homeUrl, twitterUrl, podcastUrl, calculatorGithubUrl, emailAddress, contactUrl, linkedinUrl, privacyUrl, meetupUrl } from "../helpers/routes";
import logoCombo from '../assets/logoCombo.png';

export default function Footer() {
  const linkHoverColor = '#7D443C'
  return (
    <Box
      position={'relative'}
      bottom={0}
      bgColor={'#181919'}
      color='white'
      fontFamily={'Montserrat'}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Stack direction={'column'}>
          <Link
            href={`${basePath}${contactUrl}`}
            target='_blank'
            rel='noopener noreferrer'
            fontSize={14}
            fontFamily={'Montserrat'}
            fontWeight={500}
            _hover={{
              textDecoration: 'none',
              color: linkHoverColor,
            }}>
            CONTACT
          </Link>
          <Link
            href={`${basePath}${privacyUrl}`}
            target='_blank'
            rel='noopener noreferrer'
            fontSize={14}
            fontFamily={'Montserrat'}
            fontWeight={500}
            _hover={{
              textDecoration: 'none',
              color: linkHoverColor,
            }}>
            PRIVACY POLICY
          </Link>
        </Stack>
        <Link
          href={`${basePath}${homeUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          >
          <Image
            src={logoCombo}
            alt='Red Dirt Mining Logo'
            height={'60px'}
          />
        </Link>
          
        <Stack direction={'column'}>
          <Center>
            <Stack direction={'row'} spacing={6}>
              <a href={twitterUrl} target='_blank' rel='noopener noreferrer'>
                <Icon as={FaTwitter} color="white" boxSize={5} />
              </a>
              <a href={calculatorGithubUrl} target='_blank' rel='noopener noreferrer'>
                <Icon as={FaGithub} color="white" boxSize={5} />
              </a>
              <a href={linkedinUrl} target='_blank' rel='noopener noreferrer'>
                <Icon as={FaLinkedin} color="white" boxSize={5} />
              </a>
              <a href={emailAddress}>
                <Icon as={MdMailOutline} color="white" boxSize={5} />
              </a>
              <a href={meetupUrl} target='_blank' rel='noopener noreferrer'>
                <Icon as={FaMeetup} color="white" boxSize={5} />
              </a>
              <a href={podcastUrl} target='_blank' rel='noopener noreferrer'>
                <Icon as={MdOutlinePodcasts} color="white" boxSize={5} />
              </a>
            </Stack>
          </Center>
          <Text fontSize='sm' fontWeight={500} textAlign={'center'}>
            &copy; {new Date().getFullYear()} Red Dirt Mining, LLC.<br />Est. Block 728865. 
          </Text>
        </Stack>
      </Container>
    </Box>
    
  )
}
