import React from "react";

const Container: React.FC<{
  containerClassName?: string;
  columnClassName?: string;
  children: React.ReactNode;
}> = ({ children, containerClassName, columnClassName }) => {
  return (
    <div
      className={
        containerClassName !== undefined
          ? `container ${containerClassName}`
          : "container"
      }
    >
      <div className="columns is-centered">
        <div
          className={`column ${
            columnClassName !== undefined ? columnClassName : "is-10"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const ContainerNoColumn: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="container">
    <div className="columns is-centered">{children}</div>
  </div>
);
export { Container, ContainerNoColumn };
