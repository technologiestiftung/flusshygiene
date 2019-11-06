import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TOGGLE } from '../lib/state/reducers/ui-reducer';
import { RootState } from '../lib/state/reducers/root-reducer';

const Toggle = () => {
  const ui = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  return (
    <div>
      <div>{JSON.stringify(ui)}</div>
      <input
        type='checkbox'
        value={ui.toggle.toString()}
        onChange={() => dispatch({ type: TOGGLE })}
      />
    </div>
  );
};

export default Toggle;
