import { ThemeProvider } from '@ttoss/ui';
import { fonts, theme } from '../theme';
import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme} fonts={fonts}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
