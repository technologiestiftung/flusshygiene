import React, { useState } from "react";
import { ButtonIcon as Button } from "../../Buttons";

import { MapEditModes } from "../../../lib/common/interfaces";
import {
  IconAngleDown,
  IconInfo,
  IconPolygon,
  IconMapMarker,
} from "../../fontawesome-icons";

const dropdownTexts = {
  view: { text: " Anzeige" },
  modify: { text: "Modifizieren" },
  translate: { text: "Bewegen" },
  drawPoint: { text: "Position Zeichnen" },
  drawPolygon: { text: "Regeneinzugsgebiet Zeichnen" },
};

const DropDown: React.FC<{
  // activeEditor: 'location' | 'area' | undefined;
  activeMode: MapEditModes;
  handleModeSwitch: (...args: any) => void;
}> = ({ handleModeSwitch, activeMode }) => {
  const [isActive, setIsActive] = useState(false);
  // const [isDisabled, setIsDisabled] = useState(true);
  // useEffect(() => {
  //   if (activeEditor === undefined) {
  //     setIsDisabled(true);
  //   } else {
  //     setIsDisabled(false);
  //   }
  // }, [activeEditor]);
  // useEffect(() => {
  //   if (isDisabled === true) {
  //     setIsActive(false);
  //   } else {
  //     setIsActive(true);
  //   }
  //   return () => {};
  // }, [isDisabled]);

  const handleClick = (event) => {
    handleModeSwitch(event);
    setIsActive(false);
  };

  const setActiveMode = (mode: string) =>
    activeMode === mode ? "is-active" : "";

  return (
    <div className={`dropdown ${isActive ? "is-active" : ""} is-small`}>
      <div
        className="dropdown-trigger"
        aria-haspopup="true"
        aria-controls="dropdown-menu"
      >
        <button
          className="button is-small"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          // disabled={isDisabled}
          onClick={(event) => {
            event.preventDefault();
            setIsActive(!isActive);
          }}
        >
          <span style={{ paddingRight: "0.5em" }}>{`Bearbeitungs Modus: ${
            dropdownTexts[activeMode] !== undefined
              ? dropdownTexts[activeMode].text
              : ""
          }`}</span>
          <span>
            <IconAngleDown />
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <a
            href="#/"
            className={`dropdown-item ${setActiveMode("view")}`}
            onClick={handleClick}
            id={"view"}
          >
            anzeigen
          </a>

          <a
            href="#/"
            className={`dropdown-item ${setActiveMode("modify")}`}
            onClick={handleClick}
            id={"modify"}
          >
            modifizieren
          </a>
          <a
            // dirty hack to keep bulma working
            href="#/"
            className={`dropdown-item ${setActiveMode("translate")}`}
            onClick={handleClick}
            id={"translate"}
          >
            bewegen
          </a>
          <a
            // dirty hack to keep bulma working
            href="#/"
            className={`dropdown-item ${setActiveMode("drawPoint")}`}
            onClick={handleClick}
            id={"drawPoint"}
          >
            Punkt zeichnen
          </a>
          <a
            // dirty hack to keep bulma working
            href="#/"
            className={`dropdown-item ${setActiveMode("drawPolygon")}`}
            onClick={handleClick}
            id={"drawPolygon"}
          >
            Polygon zeichnen
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
  // activeEditor: 'location' | 'area' | undefined;
  handleModeSwitch: (...args: any) => void;
  activeMode: MapEditModes;
}> = ({ handleClick, handleModeSwitch, activeMode }) => {
  const [polyIsActive, setPolyIsActive] = useState(false);
  const [pointIsActive, setPointIsActive] = useState(true);

  return (
    <div className="buttons">
      <Button handleClick={handleClick} cssId={"info"} isActive={false}>
        <IconInfo />
      </Button>
      <Button
        handleClick={(event: React.ChangeEvent<any>) => {
          setPolyIsActive((prevState) => {
            if (!prevState === true) {
              setPointIsActive(false);
            }
            return !prevState;
          });
          // setPointIsActive(polyIsActive === true ? false : true);
          handleClick(event);
        }}
        cssId={"area"}
        isActive={polyIsActive}
      >
        <IconPolygon />
      </Button>
      <Button
        handleClick={(event: React.ChangeEvent<any>) => {
          setPointIsActive((prevState) => {
            if (!prevState === true) {
              setPolyIsActive(false);
            }
            return !prevState;
          });
          // setPolyIsActive(pointIsActive === true ? false : true);
          handleClick(event);
        }}
        cssId={"location"}
        isActive={pointIsActive}
      >
        <IconMapMarker />
      </Button>
      <DropDown
        // activeEditor={activeEditor}
        handleModeSwitch={handleModeSwitch}
        activeMode={activeMode}
      />
    </div>
  );
};
