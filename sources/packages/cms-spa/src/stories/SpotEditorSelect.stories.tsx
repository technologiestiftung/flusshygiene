import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { SpotEditorSelect } from '../components/spot/SpotEditor-Select';
import { SpotEditorButtons } from '../components/spot/SpotEditor-Buttons';
import { MemoryRouter } from 'react-router';
import { Formik } from 'formik';

storiesOf('SpotEditor/Select', module)
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
            <SpotEditorSelect
              name={'name'}
              label={'The Checkbox'}
              options={[
                { text: 'YES', value: 'yes' },
                { text: 'NO', value: 'no' },
              ]}
              value={'yes'}
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
