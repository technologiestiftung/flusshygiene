import React from 'react';
import { ButtonIconTB } from '../Buttons';
import {
  IconRain,
  IconEdit,
  IconCalc,
  IconComment,
  IconCode,
} from '../fontawesome-icons';
import { IOcpuState } from '../../lib/common/interfaces';
export function SpotButtonBar({
  handleEditModeClick,
  handleCalibratePredictClick,
  ocpuState,
}: {
  handleEditModeClick: () => void;
  handleCalibratePredictClick: (event: React.ChangeEvent<any>) => void;
  ocpuState: IOcpuState;
}) {
  return (
    <div className='buttons buttons__spot-actions--size'>
      <ButtonIconTB
        cssId='edit'
        handleClick={handleEditModeClick}
        text='Editieren'
      >
        <IconEdit></IconEdit>
      </ButtonIconTB>

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
  );
}
