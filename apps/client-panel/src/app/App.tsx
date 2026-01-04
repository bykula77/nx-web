import { Refine } from '@refinedev/core';
import { ThemedLayoutV2, useNotificationProvider } from '@refinedev/antd';
import routerProvider from '@refinedev/react-router';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import trTR from 'antd/locale/tr_TR';

import { Providers } from './providers';
import { AppRoutes } from './routes';
import { refineOptions, dataProvider, authProvider } from '../config/refine.config';
import { resources } from '../config/resources.config';
import { antdTheme } from '../config/antd.config';

function RefineApp() {
  return (
    <Refine
      dataProvider={dataProvider}
      authProvider={authProvider}
      routerProvider={routerProvider}
      notificationProvider={useNotificationProvider}
      resources={resources}
      options={refineOptions}
    >
      <ThemedLayoutV2>
        <AppRoutes />
      </ThemedLayoutV2>
    </Refine>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={antdTheme} locale={trTR}>
        <AntApp>
          <Providers>
            <RefineApp />
          </Providers>
        </AntApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

