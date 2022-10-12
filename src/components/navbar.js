import {
  Box,
  Flex,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';
import logoCombo from '../assets/logoCombo.png';

export default function WithSubnavigation() {

  return (
    <Box overflow={'hidden'}>
      <Flex
        bg={useColorModeValue('#181919', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}>
        
        <Flex flex={{ base: 1 }} justify={'start'}>
          <Image src={logoCombo} pt={2} pl={4} height={'80px'} />
        </Flex>
      </Flex>
    </Box>
  );
}
