import React from 'react';
import { render } from '@testing-library/react';
import { SpotHeader } from '../../components/spot/Spot-Header';
describe('Testing spot header', () => {
  test('should render the spot headers', () => {
    const { container, getByText } = render(
      <SpotHeader
        name={'foo'}
        nameLong={'fooo'}
        district={'bah'}
        water={'water'}
      />,
    );
    expect(getByText(/fooo/i)).toBeTruthy();
    expect(container.querySelector('h1.title.is-1')).toBeTruthy();
    expect(container.querySelector('h2.subtitle.is-2')).toBeTruthy();
    expect(container.querySelector('h3.subtitle.is-3')).toBeTruthy();
    expect(container.querySelector('.district')).toBeTruthy();
  });

  // test('should render the spot headers with subtitle', () => {
  //   const { container, getByText } = render(
  //     <SpotHeader
  //       name={'foo'}
  //       nameLong={'fooo'}
  //       district={'bah'}
  //       water={'water'}
  //     />,
  //   );
  //   expect(getByText(/water/i)).toBeTruthy();
  //   expect(container.querySelector('.subtitle')).toBeTruthy();
  // });
});
