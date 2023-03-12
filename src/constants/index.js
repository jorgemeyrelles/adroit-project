/* eslint-disable import/prefer-default-export */
export const chartsNames = [
  {
    id: 1,
    name: 'Mapa',
    loading: true,
  },
  // {
  // id: 2,
  // name: 'Quantidade de Frutos',
  // loading: true,
  // },
  {
    id: 3,
    name: 'Maturação',
    loading: true,
  },
  {
    id: 4,
    name: 'Diâmetro',
    loading: true,
  },
  {
    id: 5,
    name: 'Altura das árvores',
    loading: true,
  },
  {
    id: 6,
    name: 'Frutos no chão',
    loading: true,
  },
  // {
  // id: 7,
  // name: 'Contagem de Árvores Ausentes',
  // loading: true,
  // },
  // {
  // id: 8,
  // name: 'Anomalias na Florada',
  // loading: true,
  // },
  // call inventoryTrees
  {
    id: 9,
    name: 'Inventário de plantas',
    loading: true,
  },
  // {
  // id: 10,
  // name: 'Detecção de Anomalias',
  // loading: true,
  // },
  // {
  // id: 11,
  // name: 'Cubicagem',
  // loading: true,
  // },
];

export const classId = [
  {
    id: 1,
    name: 'Fruta Madura',
  },
  {
    id: 2,
    name: 'Fruta Verde',
  },
  {
    id: 3,
    name: 'Fruta Semi Madura',
  },
  {
    id: 33,
    name: 'Madura Anomalia',
  },
  {
    id: 34,
    name: 'Verde Anomalia',
  },
];

export const classIdOld = [
  {
    id: 1,
    name: 'Fruta Madura',
  },
  {
    id: 2,
    name: 'Fruta Verde',
  },
  {
    id: 33,
    name: 'Madura Anomalia',
  },
  {
    id: 34,
    name: 'Verde Anomalia',
  },
  {
    id: 58,
    name: 'Fruta Semi Madura',
  },
];

export const periodForm = [
  { name: '30 dias da última coleta', id: 1 },
  { name: 'Escolher período', id: 2 },
];

export const getAnomalies = [
  {
    ID: 1,
    name: 'Cipo',
  },
  {
    ID: 2,
    name: 'Arvore Seca',
  },
  {
    ID: 3,
    name: 'Fita para Derri\u00e7a',
  },
  {
    ID: 4,
    name: 'Low Lens Flare',
  },
  {
    ID: 5,
    name: 'High Lens Flare',
  },
  {
    ID: 6,
    name: 'HLB',
  },
  {
    ID: 7,
    name: 'Arvore Ausente',
  },
  {
    ID: 8,
    name: 'Replantio',
  },
  {
    ID: 9,
    name: 'Muda',
  },
  {
    ID: 10,
    name: 'Replantio Grande',
  },
];

export const filterDefault = ['Árvores ausentes'];
export const filterBlueYellow = ['Plantas secas'];
export const filtersBlueRed = ['Volumes', 'Replantio'];
export const filtersRedToGreen = ['Densidade foliar'];
export const filtersViridisLighter = ['Frutos no chão'];
export const filtersCyan = ['Cipó', 'Anomalias Frutos'];
export const filtersFruit = [
  'Verde Anomalia',
  'Fruta Verde',
  'Fruta Madura',
  'Madura Anomalia',
  'Fruta Semi Madura',
];

export const keysToFilter = [
  'blocks',
  'ages',
  'varieties',
];

export const colors = {
  1: 'rgba(255, 167, 128, 1)', // 'rgba(255, 127, 74, 1)',
  2: 'rgba(155, 238, 193, 1)',
  3: 'rgba(255, 238, 150, 1)',
  33: 'rgba(124, 115, 0, 1)',
  34: 'rgba(0, 103, 47, 1)',
};

export const blockColors = {
  undefined: '#074096',
  1: '#F79256',
  2: '#FBD1A2',
  3: '#7DCFB6',
  4: '#00B2CA',
  5: '#1D4E89',
  6: '#C6A664',
  7: '#EDCE53',
  8: '#5FED8D',
  9: '#6B71ED',
  10: '#D6AE01',
  11: '#A03472',
  12: '#ED6753',
  13: '#A13828',
  14: '#EDFF21',
  15: '#A15F28',
  16: '#845EC2',
  17: '#D65DB1',
  18: '#FF6F91',
  19: '#C51D34',
  20: '#592321',
  21: '#F44611',
  22: '#9BDE7E',
  23: '#B87C4C',
  24: '#606E8C',
  25: '#8673A1',
  26: '#9D9101',
  27: '#FFFFFF',
  28: '#FDF4E3',
  29: '#922B3E',
  30: '#8CE385',
};
