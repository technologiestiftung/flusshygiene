import React from "react";
export const SpotAddonTag: React.FC<{ text: string; status: boolean }> = ({
  text,
  status,
}) => {
  return (
    <div className="control">
      <div className="tags has-addons">
        <span className="tag is-dark">{text}</span>
        <span className={status === true ? "tag is-success" : "tag is-danger"}>
          {status === true ? " Ja " : "Nein"}
        </span>
      </div>
    </div>
  );
};
