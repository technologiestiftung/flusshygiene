import { Field } from "formik";
import React from "react";

interface IOption {
  text: string;
  value: string;
}
export const SpotEditorSelect: React.FC<{
  name: string;
  label: string;
  options: IOption[];
  value: string;
}> = ({ name, label, options, value }) => {
  return (
    <div className="field">
      <label htmlFor={name} className="label">
        {label}
      </label>
      <div className="control">
        <div className="select is-small">
          <Field name={name} as={"select"} value={value} id={name}>
            {options.map((opt, i) => {
              return (
                <option value={opt.value} key={i}>
                  {opt.text}
                </option>
              );
            })}
          </Field>
        </div>
      </div>
    </div>
  );
};
