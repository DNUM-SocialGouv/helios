import { render, screen } from '@testing-library/react';
import React from 'react';

import { DetailsAllocations } from './DetailsAllocations'; // Adjust the import path as necessary

// Mocking the useDependencies hook
jest.mock('../../../../commun/contexts/useDependencies', () => ({
  useDependencies: () => ({
    wording: {
      REPARTITION_DES_SOUS_ENVELOPPES: 'Mocked Repartition des sous enveloppes',
    },
  }),
}));

// Example test data
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
  it('renders correctly with provided data', () => {
    render(<DetailsAllocations data={testData} />);
    
    // Assert that the main title is rendered
    expect(screen.getByText('Mocked Repartition des sous enveloppes')).toBeInTheDocument();
    
    // Assert that the envelope name is rendered
    expect(screen.getByText('Enveloppe Enveloppe 1')).toBeInTheDocument();
    
    // Assert that the sub-envelope name is rendered
    expect(screen.getByText('Sous enveloppe Sous Enveloppe 1')).toBeInTheDocument();
    
    // You can add more assertions as needed to validate the rendering of specific elements/components
  });

  

  it('renders correctly with multiple envelopes', () => {
    render(<DetailsAllocations data={testDataMultiple} />);
    
    // Assert that both envelope titles are rendered
    expect(screen.getByText('Enveloppe Enveloppe 1')).toBeInTheDocument();
    expect(screen.getByText('Enveloppe Enveloppe 2')).toBeInTheDocument();
    
    // Assert that sub-envelope titles and details are rendered for each envelope
    expect(screen.getByText('Sous enveloppe Sous Enveloppe 1')).toBeInTheDocument();
    expect(screen.getByText('Sous enveloppe Sous Enveloppe 2')).toBeInTheDocument();
 
  });

  it('renders correctly with different percentage thresholds', () => {
    render(<DetailsAllocations data={testDataEdgeCases} />);
    
    // Assert based on the percentage thresholds
    expect(screen.getByText('Enveloppe Enveloppe 1')).toBeInTheDocument();
    expect(screen.getByText('Enveloppe Enveloppe 2')).toBeInTheDocument();
    expect(screen.getByText('Enveloppe Enveloppe 3')).toBeInTheDocument();
    
    expect(screen.getByText('Sous enveloppe Sous Enveloppe 1')).toBeInTheDocument();
    expect(screen.getByText('Sous enveloppe Sous Enveloppe 2')).toBeInTheDocument();
    expect(screen.getByText('Sous enveloppe Sous Enveloppe 3')).toBeInTheDocument();
    
  });
 
});
