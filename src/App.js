import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
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

function App() {
  return (
      <Router>
      <ChakraProvider theme={theme}>
        <Navbar />
        <Basic />
      </ChakraProvider>
      </Router>
  );
}

export default App;
