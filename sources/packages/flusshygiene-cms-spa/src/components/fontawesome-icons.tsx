import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfo,
  faEdit,
  faMapMarker,
  faDrawPolygon,
  faAngleDown,
  faFileCsv,
  faFileUpload,
  faForward,
  faBackward,
  faSave,
  faWindowClose,
  faArrowRight,
  faExclamation,
  faLink,
  faCheckCircle,
  faArrowCircleRight,
  faTimes,
  faUsersCog,
  faTools,
  faFilePdf,
  faFileCode,
  faCloudRain,
  faCalculator,
  faCommentAlt,
  faMapPin,
} from '@fortawesome/free-solid-svg-icons';
import { ColorNames, QType } from '../lib/common/interfaces';
import { colorNamesToClassNames } from '../lib/utils/questionnaire-colornames-conversion';
library.add(
  faInfo,
  faEdit,
  faMapMarker,
  faDrawPolygon,
  faAngleDown,
  faFileCsv,
  faFileUpload,
  faBackward,
  faForward,
  faSave,
  faWindowClose,
  faArrowRight,
  faExclamation,
  faLink,
  faCheckCircle,
  faArrowCircleRight,
  faTimes,
  faUsersCog,
  faTools,
  faFilePdf,
  faFileCode,
  faCloudRain,
  faCalculator,
  faCommentAlt,
  faMapPin,
);

export const colorNameToIcon: (cname: ColorNames) => JSX.Element = (cname) => {
  const colName = cname.toLowerCase();
  switch (colName) {
    case 'grün':
      return <IconCheckCircle className={colorNamesToClassNames(colName)} />;
    case 'türkis':
      return (
        <IconArrowCircleRight
          className={colorNamesToClassNames(colName)}
          rotate={-45}
        />
      );
    case 'gelb':
      return (
        <IconArrowCircleRight className={colorNamesToClassNames(colName)} />
      );
    case 'orange':
      return (
        <IconArrowCircleRight
          className={colorNamesToClassNames(colName)}
          rotate={45}
        />
      );
    case 'rot':
      return <IconTimes className={colorNamesToClassNames(colName)} />;
    default:
      throw new Error('Unhandled colorname for icons');
  }
};

export const questionTypeToIcon: (
  type: QType,
  cname: ColorNames,
) => JSX.Element = (type, cname) => {
  switch (type) {
    case 'infrastruktur':
      return <Icontools className={colorNamesToClassNames(cname)} />;
    case 'verhandlung':
      return <IconUsersCog className={colorNamesToClassNames(cname)} />;
    default:
      throw new Error('not defined questionType');
  }
};

export const IconCheckCircle: React.FC<{ className?: string }> = ({
  className,
}) => <FontAwesomeIcon icon={'check-circle'} className={className} />;
export const IconArrowCircleRight: React.FC<{
  className?: string;
  rotate?: number;
}> = ({ className, rotate }) => (
  <FontAwesomeIcon
    icon={'arrow-circle-right'}
    className={className}
    transform={{ rotate }}
  />
);

export const IconPDF: React.FC<{ className?: string }> = ({ className }) => (
  <FontAwesomeIcon icon={'file-pdf'} className={className} />
);
export const IconCode: React.FC<{ className?: string }> = ({ className }) => (
  <FontAwesomeIcon icon={'file-code'} className={className} />
);
export const IconTimes: React.FC<{ className?: string }> = ({ className }) => (
  <FontAwesomeIcon icon={'times'} className={className} />
);

export const IconInfo: React.FC = () => <FontAwesomeIcon icon={'info'} />;
export const IconCloseWin: React.FC = () => (
  <FontAwesomeIcon icon={'window-close'} />
);
export const IconAngleDown: React.FC = () => (
  <FontAwesomeIcon icon={'angle-down'} />
);
export const IconEdit: React.FC = () => <FontAwesomeIcon icon={'edit'} />;
export const IconMapMarker: React.FC = () => (
  <FontAwesomeIcon icon={'map-marker'} />
);
export const IconPolygon: React.FC = () => (
  <FontAwesomeIcon icon={'draw-polygon'} />
);

export const IconCSV: React.FC = () => <FontAwesomeIcon icon={'file-csv'} />;
export const IconFileUplad: React.FC = () => (
  <FontAwesomeIcon icon={'file-upload'} />
);

export const IconPrev: React.FC = () => <FontAwesomeIcon icon={'backward'} />;
export const IconNext: React.FC = () => <FontAwesomeIcon icon={'forward'} />;
export const IconSave: React.FC = () => <FontAwesomeIcon icon={'save'} />;

export const IconArrowRight: React.FC = () => (
  <FontAwesomeIcon icon={'arrow-right'} />
);

export const IconLink: React.FC = () => <FontAwesomeIcon icon={'link'} />;

export const IconExclamation: React.FC<{
  className?: string;
}> = ({ className }) => (
  <FontAwesomeIcon icon={'exclamation'} className={className} />
);

export const IconUsersCog: React.FC<{ className?: string }> = ({
  className,
}) => <FontAwesomeIcon icon={'users-cog'} className={className} />;

export const Icontools: React.FC<{ className?: string }> = ({ className }) => (
  <FontAwesomeIcon icon={'tools'} className={className} />
);

export const IconRain: React.FC<{ className?: string }> = ({ className }) => (
  <FontAwesomeIcon icon={'cloud-rain'} className={className} />
);

export const IconCalc: React.FC<{ className?: string }> = ({ className }) => (
  <FontAwesomeIcon icon={'calculator'} className={className} />
);

export const IconComment: React.FC<{ className?: string }> = ({
  className,
}) => <FontAwesomeIcon icon={'comment-alt'} className={className} />;

export const IconMapPin: React.FC<{ className?: string }> = ({ className }) => (
  <FontAwesomeIcon icon={'map-pin'} className={className} />
);
