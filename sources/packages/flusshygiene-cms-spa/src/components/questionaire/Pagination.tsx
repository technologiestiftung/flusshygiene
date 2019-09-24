import React from 'react';
import { IconNext, IconPrev } from '../fontawesome-icons';
import { Link } from 'react-router-dom';
import { RouteNames } from '../../lib/common/enums';

// Shamelessly plugged from
// https://github.com/hipstersmoothie/bulma-pagination-react
// "name": "bulma-pagination-react",
// "description": "Bulma pagination as a react component.",
// "main": "dist/index.js",
// "source": "index.js",
// "author": {
//   "name": "Andrew Lisowski",
//   "email": "lisowski54@gmail.com"
// },

export const Page: React.FC<{
  currentPage: number;
  index: number;
  className?: string;
  cssId: string;
  onChange: (event: React.ChangeEvent<any>, index: number) => void;
}> = ({ currentPage, index, onChange, className = '', cssId }) => (
  <li>
    <Link
      to={`/${RouteNames.questionnaire}/${index}`}
      className={`pagination-link ${className} ${(currentPage === index ||
        (index === 1 && !currentPage)) &&
        'is-current'}`}
      id={cssId}
      aria-label={`Goto page ${index}`}
      aria-current={index === currentPage && 'page'}
      onClick={(event) => onChange(event, index)}
    >
      {index}
    </Link>
  </li>
);

const Ellipses: React.FC = () => (
  <li>
    <span className='pagination-ellipsis'>&hellip;</span>
  </li>
);

export const getVisiblePages = (
  visibleRadius: number,
  currentPage: number,
  maxPages: number,
) => {
  const visiblePages: number[] = [];

  let start = currentPage - visibleRadius;
  let end = currentPage + visibleRadius;

  if (start < 1) {
    start = 1;
    end = start + visibleRadius * 2;
  }

  if (end > maxPages) {
    start = maxPages - visibleRadius * 2;
    end = maxPages;
  }

  if (visibleRadius * 2 + 1 > maxPages) {
    start = 1;
    end = maxPages;
  }

  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  return visiblePages;
};

export const Pagination: React.FC<{
  pages: number;
  currentPage: number;
  visibleRadius?: number;
  className?: string;
  isRounded?: boolean;
  isSmall?: boolean;
  isMedium?: boolean;
  isLarge?: boolean;
  isCentered?: boolean;
  isRight?: boolean;
  prevClassName?: string;
  nextClassName?: string;
  linkClassName?: string;
  listClassName?: string;
  onChange: (event: React.ChangeEvent<any>, page: number) => void;
}> = ({
  pages,
  currentPage = 0,
  visibleRadius = 1,
  className = '',
  isRounded = false,
  isSmall = false,
  isMedium = false,
  isLarge = false,
  isCentered = false,
  isRight = true,
  prevClassName = '',
  nextClassName = '',
  linkClassName = '',
  listClassName = '',
  onChange,
}) => {
  const visiblePages = getVisiblePages(visibleRadius, currentPage, pages);
  const pagesComponents: JSX.Element[] = [];

  const classes = [
    isRounded && 'is-rounded',
    isSmall && 'is-small',
    isMedium && 'is-medium',
    isLarge && 'is-large',
    isCentered && 'is-centered',
    isRight && 'is-right',
  ].filter(Boolean);

  if (visiblePages[0] >= 2) {
    pagesComponents.push(
      <Page
        key='page-1'
        index={1}
        cssId={'page-1'}
        currentPage={currentPage}
        onChange={onChange}
      />,
    );

    if (visiblePages[0] !== 2) {
      pagesComponents.push(<Ellipses key='ellipses-1' />);
    }
  }

  visiblePages.map((page) =>
    pagesComponents.push(
      <Page
        key={`page-${page}`}
        cssId={`page-${page}`}
        index={page}
        currentPage={currentPage}
        onChange={onChange}
      />,
    ),
  );
  if (currentPage <= pages - visibleRadius - 1 && visiblePages.length < pages) {
    if (currentPage < pages - visibleRadius - 1) {
      pagesComponents.push(<Ellipses key='ellipses-2' />);
    }

    pagesComponents.push(
      <Page
        key={`page-${pages}`}
        className={linkClassName}
        index={pages}
        cssId={`page-${pages}`}
        currentPage={currentPage}
        onChange={onChange}
      />,
    );
  }

  return (
    <div
      className={`pagination-container pagination ${classes.join(
        ' ',
      )} ${className}`}
      role='navigation'
      aria-label='pagination'
    >
      <Link
        to={(() => {
          if (currentPage - 1 === 0) {
            return `/${RouteNames.questionnaire}/1`;
          } else {
            return `/${RouteNames.questionnaire}/${currentPage - 1}`;
          }
        })()}
        // disabled={currentPage === 1}
        id={'bwd'}
        className={`pagination-previous nav ${prevClassName}`}
        onClick={(event) => onChange(event, currentPage - 1)}
      >
        <IconPrev></IconPrev>
        {/* Vorherige Frage */}
      </Link>
      <Link
        to={(() => {
          if (currentPage + 1 > pages) {
            return `/${RouteNames.questionnaire}/${pages}`;
          } else {
            return `/${RouteNames.questionnaire}/${currentPage + 1}`;
          }
        })()}
        id={'fwd'}
        // disabled={currentPage === pages}
        className={`pagination-next nav ${nextClassName}`}
        onClick={(event) => onChange(event, currentPage + 1)}
      >
        <IconNext></IconNext>
        {/* Nächste Frage */}
      </Link>

      <ul className={`pagination-list ${listClassName}`}>{pagesComponents}</ul>
    </div>
  );
};
