import React from "react";
import { ClickFunction } from "../../../lib/common/interfaces";
import { IconEdit } from "../../fontawesome-icons";
import { ButtonIcon } from "../../Buttons";

type TableProps = { children: React.ReactNode; className?: string };

const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <table className={`${className !== undefined ? className : ""} table`}>
      {children}
    </table>
  );
};

const TableBody: React.FC<TableProps> = ({ children, className }) => {
  return (
    <tbody className={`${className !== undefined ? className : ""}`}>
      {children}
    </tbody>
  );
};
const TableRow: React.FC<{ th: string; tds: string[] }> = ({ th, tds }) => {
  return (
    <tr>
      <th>{th}</th>
      {tds.map((td, i) => (
        <td key={i}>{td}</td>
      ))}
    </tr>
  );
};
const TableRowWithUrl: React.FC<{
  th: string;
  url: string;
  content: string;
}> = ({ th, url, content }) => {
  return (
    <tr>
      <th>{th}</th>
      <td>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      </td>
    </tr>
  );
};
const TableRowWithButton: React.FC<{
  th: string;
  tds: string[];
  handleEditClick: ClickFunction;
  disabled?: boolean;
  editButtonText: string;
}> = ({ th, tds, handleEditClick, disabled, editButtonText }) => {
  return (
    <tr>
      <th>{th}</th>
      {tds.map((td, i) => (
        <td key={i}>{td}</td>
      ))}
      <td>
        <ButtonIcon
          isDisabled={disabled}
          text={editButtonText}
          handleClick={handleEditClick}
        >
          <IconEdit></IconEdit>
        </ButtonIcon>
        {/* <button className='button is-small' onClick={handleEditClick}>
          Edit
        </button> */}
      </td>
    </tr>
  );
};
export { Table, TableRow, TableBody, TableRowWithButton, TableRowWithUrl };
