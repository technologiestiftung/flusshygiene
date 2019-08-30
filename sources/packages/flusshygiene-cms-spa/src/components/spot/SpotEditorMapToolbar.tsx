import React, { useState } from 'react';
import {
  IconInfo,
  IconPolygon,
  IconMapMarker,
  IconAngleDown,
} from '../fontawesome-icons';
import { MapEditModes } from '../../lib/common/interfaces';

const Button = (props) => {
  return (
    <button
      data-testid='map-toolbar-i-button'
      className={`button is-small is-badge-small ${
        props.isActive ? 'is-active' : ''
      }`}
      onClick={props.handleClick}
      id={props.id}
    >
      <span className='icon is-small'>{props.children}</span>
    </button>
  );
};
const DropDown: React.FC<{
  activeEditor: 'location' | 'area' | undefined;
  activeMode: MapEditModes;
  handleModeSwitch: (...args: any) => void;
}> = ({ handleModeSwitch, activeEditor, activeMode }) => {
  const [isActive, setIsActive] = useState(false);
  const handleClick = (event) => {
    handleModeSwitch(event);
    setIsActive(false);
  };
  const setActiveMode = (mode: string) =>
    activeMode === mode ? 'is-active' : '';
  return (
    <div className={`dropdown ${isActive ? 'is-active' : ''} is-small`}>
      <div
        className='dropdown-trigger'
        aria-haspopup='true'
        aria-controls='dropdown-menu'
      >
        <button
          className='button is-small'
          aria-haspopup='true'
          aria-controls='dropdown-menu'
          onClick={(event) => {
            event.preventDefault();
            setIsActive(!isActive);
          }}
        >
          <span style={{ paddingRight: '0.5em' }}>{'Bearbeitungs Modus'}</span>
          <span>
            <IconAngleDown />
          </span>
          {/* <span className='icon is-small'>
            <i className='fas fa-angle-down' aria-hidden='true'></i>
          </span> */}
        </button>
        <span> {activeEditor === undefined ? '' : activeEditor} </span>
        <span> {activeMode === undefined ? '' : activeMode} </span>
      </div>
      <div className='dropdown-menu' id='dropdown-menu' role='menu'>
        <div className='dropdown-content'>
          <a
            href='#/'
            className={`dropdown-item ${setActiveMode('view')}`}
            onClick={handleClick}
            id={'view'}
          >
            anzeigen
          </a>
          {/* <a className='dropdown-item'>Other dropdown item</a> */}
          <a
            href='#/'
            className={`dropdown-item ${setActiveMode('modify')}`}
            onClick={handleClick}
            id={'modify'}
          >
            modifizieren
          </a>
          <a
            // dirty hack to keep bulma working
            href='#/'
            className={`dropdown-item ${setActiveMode('translate')}`}
            onClick={handleClick}
            id={'translate'}
          >
            bewegen
          </a>
          {/* <hr className='dropdown-divider' />
          <a href='#' className='dropdown-item'>
            With a divider
          </a> */}
        </div>
      </div>
    </div>
  );
};
export const SpotEditorMapToolbar: React.FC<{
  handleClick: (event: any) => void;
  activeEditor: 'location' | 'area' | undefined;
  handleModeSwitch: (...args: any) => void;
  activeMode: MapEditModes;
}> = ({ handleClick, activeEditor, handleModeSwitch, activeMode }) => {
  return (
    <div className='buttons'>
      <Button handleClick={handleClick} id={'info'} isActive={false}>
        <IconInfo />
      </Button>
      <Button
        handleClick={handleClick}
        id={'area'}
        isActive={activeEditor === 'area' ? true : false}
      >
        <IconPolygon />
      </Button>
      <Button
        handleClick={handleClick}
        id={'location'}
        isActive={activeEditor === 'location' ? true : false}
      >
        <IconMapMarker />
      </Button>
      <DropDown
        activeEditor={activeEditor}
        handleModeSwitch={handleModeSwitch}
        activeMode={activeMode}
      />
    </div>
  );
};
