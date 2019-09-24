import React from 'react';
import { render, fireEvent } from '../../__test-utils/render-with-providers';
import { SpotAddonTag } from '../components/spot/Spot-AddonTag';

describe('Spot Addontags', () => {
  test('Should render with yes and no', () => {
    const { getByText } = render(<SpotAddonTag text={'boom'} status={true} />);
    expect(getByText(/boom/i)).toBeTruthy();
    expect(getByText(/ja/i)).toBeTruthy();
  });
});
