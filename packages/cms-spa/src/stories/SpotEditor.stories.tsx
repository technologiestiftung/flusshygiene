import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { MemoryRouter } from 'react-router';
import { SpotEditorBasisData } from '../components/spot/SpotEditor-Basis-Data';
import { IBathingspot } from '../lib/common/interfaces';
import { ApiProvider } from '../contexts/postgres-api';

const spot: IBathingspot = {
  name: 'foo',
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublic: true,
};

storiesOf('SpotEditor', module)
  .addDecorator((story) => <ApiProvider>{story()}</ApiProvider>)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('default', () => (
    <SpotEditorBasisData
      initialSpot={spot}
      handleEditModeClick={action('Handle Edit Mode Click')}
      handleInfoShowModeClick={action('Handle Edit Mode Click')}
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
