import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { SpotEditorCheckbox } from '../components/spot/elements/SpotEditor-Checkbox';
import { SpotEditorButtons } from '../components/spot/elements/SpotEditor-Buttons';
import { MemoryRouter } from 'react-router';
import { Formik } from 'formik';

storiesOf('SpotEditor/Checkbox', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('default', () => (
    <Formik
      initialValues={{ name: 'foo' }}
      onSubmit={() => {
        action('submit');
      }}
    >
      {({ values, isSubmitting }) => {
        return (
          <div>
            <SpotEditorCheckbox
              name={'name'}
              type={'checkbox'}
              label={'The Checkbox'}
              value={true}
            />
            <SpotEditorButtons
              isSubmitting={isSubmitting}
              handleEditModeClick={action('handle Editmode Click')}
            />
          </div>
        );
      }}
    </Formik>
  ));
