import React from 'react';
import { IFormBuildData } from '../../../../lib/common/interfaces';
import { formSectionBuilder } from '../../../../components/spot/elements/SpotEditor-form-section-builder';
import {
  render,
  fireEvent,
} from '../../../../../__test-utils/render-with-providers';
import { Formik, Form } from 'formik';

describe.skip('Testing form section builder', () => {
  test('null return', () => {
    const handleSubmit = jest.fn((values, { setSubmitting }) => {});
    const data: IFormBuildData[] = [
      { type: 'text', name: 'foo', label: 'foo' },
    ];
    const elems = formSectionBuilder(data);
    const { getByLabelText, debug } = render(
      <Formik initialValues={{ name: 'foo' }} onSubmit={handleSubmit}>
        {() => {
          return <Form>{elems.map((ele) => ele)}</Form>;
        }}
      </Formik>,
    );
    expect(elems.length).toBe(1);
    const input = getByLabelText(/foo/i);
    expect(input).toBeTruthy();

    debug();
    fireEvent.change(input, { target: { value: 'bah' } });
    debug();
  });
});
