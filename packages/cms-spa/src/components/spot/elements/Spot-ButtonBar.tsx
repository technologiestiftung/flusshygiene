import React from 'react';
import { ButtonIcon } from '../../Buttons';
import {
  IconRain,
  IconEdit,
  IconCalc,
  IconComment,
  IconCode,
  IconCSV,
  IconHelp,
} from '../../fontawesome-icons';
import { IOcpuState, ClickFunction } from '../../../lib/common/interfaces';

export const SpotButtonBar: React.FC<{
  handleBasisEditModeClick: ClickFunction;
  handleDataEditModeClick: ClickFunction;
  handleInfoShowModeClick: ClickFunction;
  handlePPEditModeClick: ClickFunction;
  handleGIEditModeClock: ClickFunction;
  handleCalibratePredictClick: (event: React.ChangeEvent<any>) => void;
  ocpuState: IOcpuState;
}> = ({
  handleBasisEditModeClick,
  handleDataEditModeClick,
  handleInfoShowModeClick,
  handleCalibratePredictClick,
  handlePPEditModeClick,
  handleGIEditModeClock,
  ocpuState,
}) => {
  return (
    <>
      <div className='buttons buttons__spot-actions--size'>
        <ButtonIcon
          cssId='info'
          handleClick={handleInfoShowModeClick}
          text='Hilfe'
        >
          <IconHelp></IconHelp>
        </ButtonIcon>
        <ButtonIcon
          cssId='edit'
          handleClick={handleBasisEditModeClick}
          text='Basisdaten'
        >
          <IconEdit></IconEdit>
        </ButtonIcon>
        <ButtonIcon
          cssId='data'
          handleClick={handleDataEditModeClick}
          text='Messdaten'
        >
          <IconCSV></IconCSV>
        </ButtonIcon>
        <ButtonIcon
          cssId='pp-data'
          handleClick={handlePPEditModeClick}
          text='Klärwerke'
        >
          <IconCSV></IconCSV>
        </ButtonIcon>
        <ButtonIcon
          cssId='gi-data'
          handleClick={handleGIEditModeClock}
          text='Generische Werte'
        >
          <IconCSV></IconCSV>
        </ButtonIcon>
      </div>

      <div className='buttons buttons__spot-actions--size'>
        <ButtonIcon
          cssId='sleep'
          text='Sleep'
          handleClick={handleCalibratePredictClick}
        >
          <IconCode></IconCode>
        </ButtonIcon>
        <ButtonIcon
          cssId='calibrate'
          additionalClassNames={
            ocpuState.processing === 'calibrate' ? 'is-loading' : ''
          }
          handleClick={handleCalibratePredictClick}
          text='Regen Laden'
        >
          <IconRain></IconRain>
        </ButtonIcon>

        <ButtonIcon
          cssId='model'
          additionalClassNames={
            ocpuState.processing === 'model' ? 'is-loading' : ''
          }
          handleClick={handleCalibratePredictClick}
          text='Modellierung'
        >
          <IconCalc></IconCalc>
        </ButtonIcon>
        <ButtonIcon
          cssId='predict'
          additionalClassNames={
            ocpuState.processing === 'predict' ? 'is-loading' : ''
          }
          handleClick={handleCalibratePredictClick}
          text='Vorhersage'
        >
          <IconComment></IconComment>
        </ButtonIcon>
      </div>
    </>
  );
};
