import React from 'react';
import { IconCSV, IconTrash } from '../../fontawesome-icons';
import { ButtonIconTB } from '../../Buttons';
import { ClickHandler } from '../../../lib/common/interfaces';
export const SpotEditorFile: React.FC<{
  name: string;
  type: string;
  label: string;
  disabled: boolean;
  onChange: ClickHandler;
  handleClearClick: ClickHandler;
}> = ({ name, label, type, onChange, disabled, handleClearClick }) => {
  return (
    <>
      <div className='file is-small'>
        <label className='file-label'>
          <input
            className='file-input'
            type='file'
            name={name}
            onChange={onChange}
            disabled={disabled}
          />
          <span className='file-cta'>
            <span className='file-icon'>
              <IconCSV />
            </span>
            <span className='file-label'>{label}</span>
          </span>
        </label>
        <div className='buttons'>
          <ButtonIconTB text={'Daten löschen'} handleClick={handleClearClick}>
            <IconTrash></IconTrash>
          </ButtonIconTB>
        </div>
      </div>
    </>
  );
};

// <div className='file'>
//   <label className='file-label' htmlFor={name}>
//     <input
//       className='file-input'
//       type={type}
//       name={name}
//       onChange={onChange}
//       disabled={disabled}
//     />

//     <span className='file-cta'>
//       <span className='file-icon'>
//         <IconCSV />
//       </span>
//       <span className='file-name'>{label} auswählen</span>
//     </span>
//     {/* <span className='file-name'>{label}</span> */}
//   </label> */}
// </div>
