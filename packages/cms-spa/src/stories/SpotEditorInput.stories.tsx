import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { SpotEditorInput } from '../components/spot/elements/SpotEditor-Input';
import { SpotEditorButtons } from '../components/spot/elements/SpotEditor-Buttons';
import { MemoryRouter } from 'react-router';
import { Formik } from 'formik';

storiesOf('SpotEditor/Input', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('text', () => (
    <Formik
      initialValues={{ name: 'foo' }}
      onSubmit={() => {
        action('submit');
      }}
    >
      {({ values, isSubmitting }) => {
        return (
          <div>
            <SpotEditorInput name={'name'} type={'text'} label={'The Input'} />
            <SpotEditorButtons
              isSubmitting={isSubmitting}
              handleEditModeClick={action('handle Editmode Click')}
            />
          </div>
        );
      }}
    </Formik>
  ));
