// HistogrammeHorizontalRowMultiple.test.tsx
import { render, screen } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { HistogrammeHorizontalRowMultiple, colorsAllocations } from './HistogrammeHorizontalRowMultiple';

// Mock des styles pour éviter les erreurs liées aux modules CSS
jest.mock('./HistogrammeHorizontalRowMultiple.module.css', () => ({
  "histogramme_horizontal_row_container": "histogramme_horizontal_row_container",
  "barHistogramme": "barHistogramme"
}));

describe('HistogrammeHorizontalRowMultiple', () => {

  const data = [
    { key: 'A', value: 10 },
    { key: 'B', value: 20 },
    { key: 'C', value: 30 }
  ];

  it('renders correctly with valid props', () => {
    const realPercentage = 50;
    render(<HistogrammeHorizontalRowMultiple data={data} realPercentage={realPercentage} />);

    // Vérifie que le conteneur est rendu avec la bonne largeur
    // eslint-disable-next-line testing-library/no-node-access
    const container = screen.getByRole('list').closest('div');
    expect(container).toHaveStyle(`width: ${realPercentage * 0.8}%`);

    // Vérifie que chaque barre est rendue avec la bonne largeur et couleur
    data.forEach((item, index) => {
      const bar = screen.getByTestId(`bar-${item.key}`);
      expect(bar).toHaveStyle(`width: ${item.value}%`);
      expect(bar).toHaveStyle(`background-color: ${colorsAllocations[index]}`);
    });
  });

  it('does not render if realPercentage is 0 or negative', () => {
    render(<HistogrammeHorizontalRowMultiple data={data} realPercentage={0} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    render(<HistogrammeHorizontalRowMultiple data={data} realPercentage={-10} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('does not render if realPercentage is greater than 100', () => {
    render(<HistogrammeHorizontalRowMultiple data={data} realPercentage={110} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
