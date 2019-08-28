import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
library.add(faInfo);

export const IconInfo: React.FC = () => <FontAwesomeIcon icon={'info'} />;
