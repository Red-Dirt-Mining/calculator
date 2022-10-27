import React from 'react';
import './App.css';
import Navbar from './components/navbar';
import Basic from './components/basic';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import Footer from './components/footer';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Basic />
      <Footer />
    </ChakraProvider>
  );
}

export default App;
