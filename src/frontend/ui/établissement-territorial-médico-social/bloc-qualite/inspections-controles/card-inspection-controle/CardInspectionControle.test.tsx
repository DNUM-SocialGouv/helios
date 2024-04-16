import { render, screen } from '@testing-library/react';
import React from 'react';

import { Inspection } from '../../../../../../backend/métier/entities/ÉtablissementTerritorialQualite';
import CardInspectionControle from './CardInspectionControle';

describe('CardInspectionControle Component', () => {
  const mockData = {
  };

  it('renders date badges if dateVisite is provided', () => {
    const dataWithDates = {
      ...mockData,
      dateVisite: '2024-04-16',
    };
    render(<CardInspectionControle data={dataWithDates as Inspection} />);
    expect(screen.getByText(/Date réelle de visite\s*:\s*16\/04\/2024/)).toBeInTheDocument();
  });


  it('renders date badges if dateRapport is provided', () => {
    const dataWithDates = {
      ...mockData,
      dateRapport: '2024-04-17',
    };
    render(<CardInspectionControle data={dataWithDates as Inspection} />);
    expect(screen.getByText(/Date réelle de rapport\s*:\s*17\/04\/2024/)).toBeInTheDocument();
  });

  it('renders theme title if themeRegional is provided', () => {
    const dataWithTheme = {
      ...mockData,
      themeRegional: 'Regional Theme',
    };
    render(<CardInspectionControle data={dataWithTheme as Inspection} />);
    expect(screen.getByText('Regional Theme')).toBeInTheDocument();
  });

  it('renders type de planification if provided', () => {
    const dataWithMissions = {
      ...mockData,
      typePlannification: "Programmé",
    };
    render(<CardInspectionControle data={dataWithMissions as Inspection} />);
    expect(screen.getByText('Programmé')).toBeInTheDocument();
  });

  it('renders modalite Mission if provided', () => {
    const dataWithMissions = {
      ...mockData,
      modaliteMission: "Hors programme",
    };
    render(<CardInspectionControle data={dataWithMissions as Inspection} />);
    expect(screen.getByText('Hors programme')).toBeInTheDocument();
  });
 
});