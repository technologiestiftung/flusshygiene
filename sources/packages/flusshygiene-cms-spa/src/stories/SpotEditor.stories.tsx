import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { MemoryRouter } from 'react-router';
import { SpotEditor } from '../components/spot/SpotEditor';
import { IBathingspot } from '../lib/common/interfaces';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from '../../__test-utils/empty-reducer';
import { initialState } from '../../__test-utils/initial-state';
const spot: IBathingspot = {
  name: 'foo',
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublic: true,
};
const store = createStore(reducer, initialState);

storiesOf('SpotEditor', module)
  .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('default', () => (
    <SpotEditor
      initialSpot={spot}
      handleEditModeClick={action('Handle Edit Mode Click')}
    />
    // <Formik
    //   initialValues={{ name: 'foo' }}
    //   onSubmit={() => {
    //     action('submit');
    //   }}
    // >
    //   {({ values, isSubmitting }) => {
    //     return (
    //       <div>
    //         <SpotEditorCheckbox
    //           name={'name'}
    //           type={'checkbox'}
    //           label={'The Checkbox'}
    //           value={true}
    //         />
    //         <SpotEditorButtons
    //           isSubmitting={isSubmitting}
    //           handleEditModeClick={action('handle Editmode Click')}
    //         />
    //       </div>
    //     );
    //   }}
    // </Formik>
  ));
