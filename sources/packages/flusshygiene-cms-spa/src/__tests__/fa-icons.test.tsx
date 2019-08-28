import React from 'react';
import { render } from '../../__test-utils/render-with-providers';
import { IconInfo } from '../components/fa-icons';
describe('Testing icons', () => {
  test('icon info', () => {
    render(<IconInfo />);
  });
});
