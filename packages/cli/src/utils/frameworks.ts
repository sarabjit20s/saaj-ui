export const FRAMEWORKS = {
  expo: {
    name: 'expo',
    label: 'Expo',
    links: {
      installation: 'https://saaj-ui.vercel.app/docs/installation-guides/expo',
    },
  },
  'react-native': {
    name: 'react-native',
    label: 'React Native',
    links: {
      installation:
        'https://saaj-ui.vercel.app/docs/installation-guides/react-native',
    },
  },
  manual: {
    name: 'manual',
    label: 'Manual',
    links: {
      installation:
        'https://saaj-ui.vercel.app/docs/installation-guides/manual',
    },
  },
} as const;

export type Framework = (typeof FRAMEWORKS)[keyof typeof FRAMEWORKS];
