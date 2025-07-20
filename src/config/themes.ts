
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
    karmaRequired: 300,
  },
    {
    name: 'Sunset',
    id: 'sunset',
    karmaRequired: 500,
  },
    {
    name: 'Aqua',
    id: 'aqua',
    karmaRequired: 700,
  },
    {
    name: 'Retro',
    id: 'retro',
    karmaRequired: 900,
  },
    {
    name: 'BubbleGum',
    id: 'bubblegum',
    karmaRequired: 1000,
  },
  {
    name: 'Minty',
    id: 'minty',
    karmaRequired: 1200,
  },
    {
    name: 'GrapeBerry',
    id: 'grapeberry',
    karmaRequired: 1300,
  },

    {
    name: 'PastelDream',
    id: 'pasteldream',
    karmaRequired: 1500,
  },

];