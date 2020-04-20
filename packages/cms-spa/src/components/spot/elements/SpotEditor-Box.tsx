import React from "react";
export const SpotEditorBox: React.FC<{
  title: string;
  children?: JSX.Element[] | JSX.Element | undefined | any;
}> = ({ title, children }) => {
  return (
    <div className="" style={{ paddingTop: "2rem" }}>
      <fieldset>
        <legend className="title is-5">{title}</legend>
        {children}
      </fieldset>
    </div>
  );
};
