import React from 'react';
import { render } from '../../__test-utils/render-with-providers';
import { Questionaire } from '../components/Questionaire';

it('renders Profile without crashing', () => {
  render(<Questionaire />);
});
