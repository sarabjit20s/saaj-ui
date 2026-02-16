export const REGISTRY_URL = 'https://saaj-ui.vercel.app/r';

export const REGISTRY_SCHEMA_URL =
  'https://saaj-ui.vercel.app/schema/registry.json';

export const REGISTRY_ITEM_SCHEMA_URL =
  'https://saaj-ui.vercel.app/schema/registry-item.json';

export const GRAY_COLORS = [
  {
    name: 'gray',
    label: 'Gray',
  },
  {
    name: 'mauve',
    label: 'Mauve',
  },
  {
    name: 'slate',
    label: 'Slate',
  },
  {
    name: 'sage',
    label: 'Sage',
  },
  {
    name: 'olive',
    label: 'Olive',
  },
  {
    name: 'sand',
    label: 'Sand',
  },
] as const;

export const COLORS = [
  { name: 'red', label: 'Red' },
  { name: 'tomato', label: 'Tomato' },
  { name: 'ruby', label: 'Ruby' },
  { name: 'crimson', label: 'Crimson' },
  { name: 'pink', label: 'Pink' },

  { name: 'plum', label: 'Plum' },
  { name: 'purple', label: 'Purple' },
  { name: 'violet', label: 'Violet' },
  { name: 'iris', label: 'Iris' },
  { name: 'indigo', label: 'Indigo' },

  { name: 'blue', label: 'Blue' },
  { name: 'sky', label: 'Sky' },
  { name: 'cyan', label: 'Cyan' },

  { name: 'mint', label: 'Mint' },
  { name: 'teal', label: 'Teal' },
  { name: 'jade', label: 'Jade' },
  { name: 'green', label: 'Green' },
  { name: 'grass', label: 'Grass' },
  { name: 'lime', label: 'Lime' },

  { name: 'yellow', label: 'Yellow' },
  { name: 'amber', label: 'Amber' },
  { name: 'orange', label: 'Orange' },

  { name: 'brown', label: 'Brown' },
  { name: 'gold', label: 'Gold' },
  { name: 'bronze', label: 'Bronze' },

  ...GRAY_COLORS,
] as const;

export const ALPHA_COLORS = [
  { name: 'redA', label: 'Red Alpha' },
  { name: 'tomatoA', label: 'Tomato Alpha' },
  { name: 'rubyA', label: 'Ruby Alpha' },
  { name: 'crimsonA', label: 'Crimson Alpha' },
  { name: 'pinkA', label: 'Pink Alpha' },

  { name: 'plumA', label: 'Plum Alpha' },
  { name: 'purpleA', label: 'Purple Alpha' },
  { name: 'violetA', label: 'Violet Alpha' },
  { name: 'irisA', label: 'Iris Alpha' },
  { name: 'indigoA', label: 'Indigo Alpha' },

  { name: 'blueA', label: 'Blue Alpha' },
  { name: 'skyA', label: 'Sky Alpha' },
  { name: 'cyanA', label: 'Cyan Alpha' },

  { name: 'mintA', label: 'Mint Alpha' },
  { name: 'tealA', label: 'Teal Alpha' },
  { name: 'jadeA', label: 'Jade Alpha' },
  { name: 'greenA', label: 'Green Alpha' },
  { name: 'grassA', label: 'Grass Alpha' },
  { name: 'limeA', label: 'Lime Alpha' },

  { name: 'yellowA', label: 'Yellow Alpha' },
  { name: 'amberA', label: 'Amber Alpha' },
  { name: 'orangeA', label: 'Orange Alpha' },

  { name: 'brownA', label: 'Brown Alpha' },
  { name: 'goldA', label: 'Gold Alpha' },
  { name: 'bronzeA', label: 'Bronze Alpha' },

  {
    name: 'grayA',
    label: 'Gray Alpha',
  },
  {
    name: 'mauveA',
    label: 'Mauve Alpha',
  },
  {
    name: 'slateA',
    label: 'Slate Alpha',
  },
  {
    name: 'sageA',
    label: 'Sage Alpha',
  },
  {
    name: 'oliveA',
    label: 'Olive Alpha',
  },
  {
    name: 'sandA',
    label: 'Sand Alpha',
  },
] as const;

export const REGISTRY_COLORS = [...COLORS, ...ALPHA_COLORS] as const;

export type ColorScale = Record<
  (typeof COLORS)[number]['name'],
  { scale: number; hex: string }[]
>;
