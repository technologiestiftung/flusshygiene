import React from 'react';
import { render } from '@testing-library/react';
import { SpotLocation } from '../../components/spot/SpotLocation';
describe('Testing spot location', () => {
  test('should render the spot location', () => {
    const { container, getByText, getByTestId } = render(
      <SpotLocation
        city={'Berlin'}
        street={'Mockstreet'}
        latitude={13}
        longitude={52}
        postalCode={'12345'}
        nameLong={'fooo'}
        website={'http://example.com'}
      />,
    );
    expect(getByText(/fooo/i)).toBeTruthy();
    expect(getByText(/mockstreet/i)).toBeTruthy();
    expect(getByText(/12345/i)).toBeTruthy();
    expect(getByText(/berlin/i)).toBeTruthy();
    const link = getByTestId('google-link') as HTMLAnchorElement;
    expect(link.href).toContain('13');
    expect(link.href).toContain('52');
  });
});
