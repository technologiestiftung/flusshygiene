import React from "react";
// TODO: Types ae not in sync with repo react-table
export const IndeterminateCheckbox: any = React.forwardRef(
  // @ts-ignore
  ({ indeterminate, ...rest }, ref: any) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;
    React.useEffect(() => {
      // @ts-ignore
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);
    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  },
);
