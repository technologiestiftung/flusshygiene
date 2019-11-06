import React from 'react';

type TableProps = { children: React.ReactNode; className?: string };

const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <table className={`${className !== undefined ? className : ''} table`}>
      {children}
    </table>
  );
};

const TableBody: React.FC<TableProps> = ({ children, className }) => {
  return (
    <tbody className={`${className !== undefined ? className : ''}`}>
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
export { Table, TableRow, TableBody };
