import { configure } from '@storybook/react';
import requireContext from 'require-context.macro';
import '../src/assets/styles/index.scss';

const req = requireContext('../src/stories', true, /\.stories\.tsx$/);
// const req = require.context('../src/stories', true, /\.stories.tsx$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
  // require('../src/stories');
}

configure(loadStories, module);
