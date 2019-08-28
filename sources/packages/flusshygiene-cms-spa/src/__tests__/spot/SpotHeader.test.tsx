import React from 'react';
import { render } from '@testing-library/react';
import { SpotHeader } from '../../components/spot/SpotHeader';
describe('Testing spot header', () => {
  test('should render the spot headers', () => {
    const { container, getByText } = render(
      <SpotHeader nameLong={'fooo'} district={'bah'} />,
    );
    expect(getByText(/fooo/i)).toBeTruthy();
    expect(container.querySelector('h1.title.is-3')).toBeTruthy();
  });

  test('should render the spot headers with subtitle', () => {
    const { container, getByText } = render(
      <SpotHeader nameLong={'fooo'} district={'bah'} water={'water'} />,
    );
    expect(getByText(/water/i)).toBeTruthy();
    expect(container.querySelector('.subtitle')).toBeTruthy();
  });
});
