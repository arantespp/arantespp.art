import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@ttoss/ui';
import { fonts, theme } from '../theme';
import type { AppProps } from 'next/app';

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme} fonts={fonts}>
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
