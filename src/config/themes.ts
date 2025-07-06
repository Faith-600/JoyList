
export type Theme = {
  name: string;
  id: string;
  karmaRequired: number;
};

export const themes: Theme[] = [
  {
    name: 'Default',
    id: 'default',
    karmaRequired: 0,
  },
  {
    name: 'Synthwave',
    id: 'synthwave',
    karmaRequired: 200,
  },
  {
    name: 'Forest',
    id: 'forest',
    karmaRequired: 500,
  },
];