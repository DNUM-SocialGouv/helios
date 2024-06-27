import { render, screen } from '@testing-library/react';
import React from 'react';

import { DetailsAllocations } from './DetailsAllocations';

// Mocking the useDependencies hook
jest.mock('../../../../commun/contexts/useDependencies', () => ({
  useDependencies: () => ({
    wording: {
      REPARTITION_DES_SOUS_ENVELOPPES: 'Mocked Repartition des sous enveloppes',
    },
  }),
}));

const testData = [
  {
    enveloppe: 'Enveloppe 1',
    pourcentage: 100,
    total: 1000,
    sousEnveloppes: [
      {
        sousEnveloppe: 'Sous Enveloppe 1',
        pourcentage: 100,
        total: 1000,
        modesDeDélégation: [
          { modeDeDélégation: 'Mode 1', montantNotifié: 500, pourcentage: 50 },
          { modeDeDélégation: 'Mode 2', montantNotifié: 500, pourcentage: 50 },
        ],
      },
    ],
  },
];

const testDataMultiple = [
  {
    enveloppe: 'Enveloppe 1',
    pourcentage: 66.66,
    total: 1000,
    sousEnveloppes: [
      {
        sousEnveloppe: 'Sous Enveloppe 1',
        pourcentage: 100,
        total: 1000,
        modesDeDélégation: [
          { modeDeDélégation: 'Mode 1', montantNotifié: 700, pourcentage: 70 },
          { modeDeDélégation: 'Mode 2', montantNotifié: 300, pourcentage: 30 },
        ],
      },
    ],
  },
  {
    enveloppe: 'Enveloppe 2',
    pourcentage: 33.33,
    total: 500,
    sousEnveloppes: [
      {
        sousEnveloppe: 'Sous Enveloppe 2',
        pourcentage: 100,
        total: 500,
        modesDeDélégation: [
          { modeDeDélégation: 'Mode 3', montantNotifié: 500, pourcentage: 100 },
        ],
      },
    ],
  },
];

const testDataEdgeCases = [
  {
    enveloppe: 'Enveloppe 1',
    pourcentage: 10,
    total: 10,
    sousEnveloppes: [
      {
        sousEnveloppe: 'Sous Enveloppe 1',
        pourcentage: 100,
        total: 100,
        modesDeDélégation: [],
      },
    ],
  },
  {
    enveloppe: 'Enveloppe 2',
    pourcentage: 10,
    total: 10,
    sousEnveloppes: [
      {
        sousEnveloppe: 'Sous Enveloppe 2',
        pourcentage: 10,
        total: 100,
        modesDeDélégation: [],
      },
    ],
  },
  {
    enveloppe: 'Enveloppe 3',
    pourcentage: 80,
    total: 800,
    sousEnveloppes: [
      {
        sousEnveloppe: 'Sous Enveloppe 3',
        pourcentage: 100,
        total: 800,
        modesDeDélégation: [],
      },
    ],
  },
];

describe('DetailsAllocations component', () => {
  it('renders correctly with provided data', async () => {
    render(<DetailsAllocations data={testData} />);
    
    // Attendre que le titre principal soit rendu
    await screen.findByText('Mocked Repartition des sous enveloppes');
    
    // Vérifier que le nom de l'enveloppe est rendu
    expect(screen.getByText('Enveloppe Enveloppe 1')).toBeInTheDocument();
    
    // Vérifier que le nom de la sous-enveloppe est rendu
    expect(screen.getByText('Sous enveloppe Sous Enveloppe 1')).toBeInTheDocument();
    
  });

  it('renders correctly with multiple envelopes', async () => {
    render(<DetailsAllocations data={testDataMultiple} />);
    
    // Attendre que les titres des enveloppes soient rendus
    await screen.findByText('Enveloppe Enveloppe 1');
    expect(screen.getByText('Enveloppe Enveloppe 2')).toBeInTheDocument();
    
    // Vérifier que les titres et les détails des sous-enveloppes sont rendus pour chaque enveloppe
    expect(screen.getByText('Sous enveloppe Sous Enveloppe 1')).toBeInTheDocument();
    expect(screen.getByText('Sous enveloppe Sous Enveloppe 2')).toBeInTheDocument();
  });

  it('renders correctly with different percentage thresholds', async () => {
    render(<DetailsAllocations data={testDataEdgeCases} />);
    expect(screen.getByText('Enveloppe Enveloppe 1')).toBeInTheDocument();
    expect(screen.getByText('Enveloppe Enveloppe 2')).toBeInTheDocument();
    expect(screen.getByText('Enveloppe Enveloppe 3')).toBeInTheDocument();
    expect(screen.getByText('Sous enveloppe Sous Enveloppe 1')).toBeInTheDocument();
    expect(screen.getByText('Sous enveloppe Sous Enveloppe 2')).toBeInTheDocument();
    expect(screen.getByText('Sous enveloppe Sous Enveloppe 3')).toBeInTheDocument();
 
  });
});
