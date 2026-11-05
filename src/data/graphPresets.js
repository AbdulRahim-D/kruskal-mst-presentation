// Graph presets for presentation walkthrough and playground

export const DEFAULT_5_HOUSE_GRAPH = {
  id: 'village-5',
  name: '5-House Village (Default Classroom Example)',
  description: 'Connecting 5 isolated rural homes with fiber optic cables at lowest cost.',
  nodes: [
    { id: 'A', label: 'House A', subtitle: 'North Homestead', x: 160, y: 100, icon: 'home' },
    { id: 'B', label: 'House B', subtitle: 'East Orchard', x: 440, y: 90, icon: 'home' },
    { id: 'C', label: 'House C', subtitle: 'Valley Mill', x: 590, y: 250, icon: 'home' },
    { id: 'D', label: 'House D', subtitle: 'South Pond', x: 380, y: 360, icon: 'home' },
    { id: 'E', label: 'House E', subtitle: 'West Pines', x: 130, y: 310, icon: 'home' },
  ],
  edges: [
    { id: 'e-AB', from: 'A', to: 'B', weight: 1, label: '₹1k' },
    { id: 'e-BC', from: 'B', to: 'C', weight: 2, label: '₹2k' },
    { id: 'e-AC', from: 'A', to: 'C', weight: 3, label: '₹3k' }, // Cycle trap!
    { id: 'e-CD', from: 'C', to: 'D', weight: 4, label: '₹4k' },
    { id: 'e-DE', from: 'D', to: 'E', weight: 5, label: '₹5k' },
    { id: 'e-BD', from: 'B', to: 'D', weight: 6, label: '₹6k' },
    { id: 'e-AE', from: 'A', to: 'E', weight: 7, label: '₹7k' },
    { id: 'e-CE', from: 'C', to: 'E', weight: 8, label: '₹8k' },
  ]
};

export const PRESET_GRAPHS = [
  DEFAULT_5_HOUSE_GRAPH,
  {
    id: 'telecom-6',
    name: '6-City Telecom Backbone',
    description: 'High-speed inter-city fiber trunk connecting 6 regional metro centers.',
    nodes: [
      { id: 'A', label: 'Metro A', subtitle: 'Alpha Hub', x: 140, y: 120, icon: 'network' },
      { id: 'B', label: 'Metro B', subtitle: 'Beta Data', x: 350, y: 80, icon: 'network' },
      { id: 'C', label: 'Metro C', subtitle: 'Gamma Port', x: 580, y: 130, icon: 'network' },
      { id: 'D', label: 'Metro D', subtitle: 'Delta City', x: 560, y: 340, icon: 'network' },
      { id: 'E', label: 'Metro E', subtitle: 'Epsilon Bay', x: 340, y: 370, icon: 'network' },
      { id: 'F', label: 'Metro F', subtitle: 'Zeta West', x: 130, y: 290, icon: 'network' },
    ],
    edges: [
      { id: 'e-AB', from: 'A', to: 'B', weight: 4, label: '₹4k' },
      { id: 'e-AF', from: 'A', to: 'F', weight: 2, label: '₹2k' },
      { id: 'e-BF', from: 'B', to: 'F', weight: 5, label: '₹5k' },
      { id: 'e-BC', from: 'B', to: 'C', weight: 6, label: '₹6k' },
      { id: 'e-BE', from: 'B', to: 'E', weight: 3, label: '₹3k' },
      { id: 'e-CD', from: 'C', to: 'D', weight: 3, label: '₹3k' },
      { id: 'e-CE', from: 'C', to: 'E', weight: 1, label: '₹1k' },
      { id: 'e-DE', from: 'D', to: 'E', weight: 8, label: '₹8k' },
      { id: 'e-EF', from: 'E', to: 'F', weight: 4, label: '₹4k' },
    ]
  },
  {
    id: 'cycle-trap',
    name: 'Cycle Trap (Diamond + Bridge)',
    description: 'A 4-node diamond designed to showcase multiple cycle rejections with House 2 ↔ House 3 bridge.',
    nodes: [
      { id: '1', label: 'House 1', subtitle: 'North', x: 360, y: 80, icon: 'home' },
      { id: '2', label: 'House 2', subtitle: 'West', x: 180, y: 230, icon: 'home' },
      { id: '3', label: 'House 3', subtitle: 'East', x: 540, y: 230, icon: 'home' },
      { id: '4', label: 'House 4', subtitle: 'South', x: 360, y: 370, icon: 'home' },
    ],
    edges: [
      { id: 'e-23', from: '2', to: '3', weight: 1, label: '₹1k' }, // Cheapest bridge between House 2 and House 3!
      { id: 'e-12', from: '1', to: '2', weight: 2, label: '₹2k' },
      { id: 'e-13', from: '1', to: '3', weight: 3, label: '₹3k' },
      { id: 'e-34', from: '3', to: '4', weight: 4, label: '₹4k' },
      { id: 'e-14', from: '1', to: '4', weight: 5, label: '₹5k', badgeRatio: 0.28 }, // Position badge higher so it doesn't overlap 2-3!
      { id: 'e-24', from: '2', to: '4', weight: 7, label: '₹7k' },
    ]
  }
];

