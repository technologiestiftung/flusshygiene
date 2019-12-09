import React from 'react';
import { ButtonIconTB } from '../../Buttons';
import {
  IconRain,
  IconEdit,
  IconCalc,
  IconComment,
  IconCode,
  IconCSV,
  IconHelp,
} from '../../fontawesome-icons';
import { IOcpuState } from '../../../lib/common/interfaces';

type ClickFunction = (event?: React.ChangeEvent<any>) => void;

export const SpotButtonBar: React.FC<{
  handleBasisEditModeClick: ClickFunction;
  handleDataEditModeClick: ClickFunction;
  handleInfoShowModeClick: ClickFunction;
  handlePPEditModeClick: ClickFunction;
  handleCalibratePredictClick: (event: React.ChangeEvent<any>) => void;
  ocpuState: IOcpuState;
}> = ({
  handleBasisEditModeClick,
  handleDataEditModeClick,
  handleInfoShowModeClick,
  handleCalibratePredictClick,
  handlePPEditModeClick,
  ocpuState,
}) => {
  return (
    <>
      <div className='buttons buttons__spot-actions--size'>
        <ButtonIconTB
          cssId='info'
          handleClick={handleInfoShowModeClick}
          text='Hilfe'
        >
          <IconHelp></IconHelp>
        </ButtonIconTB>
        <ButtonIconTB
          cssId='edit'
          handleClick={handleBasisEditModeClick}
          text='Basisdaten'
        >
          <IconEdit></IconEdit>
        </ButtonIconTB>
        <ButtonIconTB
          cssId='data'
          handleClick={handleDataEditModeClick}
          text='Messdaten'
        >
          <IconCSV></IconCSV>
        </ButtonIconTB>
        <ButtonIconTB
          cssId='pp-data'
          handleClick={handlePPEditModeClick}
          text='Klärwerke'
        >
          <IconCSV></IconCSV>
        </ButtonIconTB>
      </div>

      <div className='buttons buttons__spot-actions--size'>
        <ButtonIconTB
          cssId='sleep'
          text='Sleep'
          handleClick={handleCalibratePredictClick}
        >
          <IconCode></IconCode>
        </ButtonIconTB>
        <ButtonIconTB
          cssId='calibrate'
          additionalClassNames={
            ocpuState.processing === 'calibrate' ? 'is-loading' : ''
          }
          handleClick={handleCalibratePredictClick}
          text='Regen Laden'
        >
          <IconRain></IconRain>
        </ButtonIconTB>

        <ButtonIconTB
          cssId='model'
          additionalClassNames={
            ocpuState.processing === 'model' ? 'is-loading' : ''
          }
          handleClick={handleCalibratePredictClick}
          text='Modellierung'
        >
          <IconCalc></IconCalc>
        </ButtonIconTB>
        <ButtonIconTB
          cssId='predict'
          additionalClassNames={
            ocpuState.processing === 'predict' ? 'is-loading' : ''
          }
          handleClick={handleCalibratePredictClick}
          text='Vorhersage'
        >
          <IconComment></IconComment>
        </ButtonIconTB>
      </div>
    </>
  );
};
