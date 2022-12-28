import type { Theme } from '@ttoss/ui';

export const fonts = [
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap',
  'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&display=swap',
];

export const theme: Theme = {
  colors: {
    text: '#eee',
    background: '#1C2E3D',
    primary: '#FF5F1F',
    secondary: '#FF10F0',
  },
  fonts: {
    logo: '"Dancing Script", cursive',
    heading: 'Helvetica, Arial, sans-serif',
    body: '"Lato", Helvetica, Arial, sans-serif',
  },
  shadows: {
    image: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 2px',
    box: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
    hover: 'rgb(38, 57, 77) 0px 20px 30px -10px',
    text: '10px 10px 10px rgba(0, 0, 0, 0.5)',
  },
  radii: {
    border: '8px',
  },
  styles: {
    root: {
      a: {
        textDecoration: 'none',
      },
    },
  },
};
