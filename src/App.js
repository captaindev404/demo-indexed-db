import React from 'react';
import {AppProvider, Layout, Page, Frame} from '@shopify/polaris';

import Messages from './app/Messages';
import NavigationBar from './app/NavigationBar';

function App() {
  return (
    <AppProvider>
      <Page title="">
        <Layout>
        <Frame topBar={NavigationBar()} >
          <Messages/>
        </Frame>
≈        </Layout>
      </Page>
    </AppProvider>);
}

export default App;
