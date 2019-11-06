import React from 'react';
import { ContainerNoColumn } from '../Container';
import { IconChart } from '../fontawesome-icons';

const Plot: React.FC<{
  imageUrl: string;
  title: string;
  description: string;
  id: number;
}> = ({ imageUrl, title, description, id }) => {
  return (
    <>
      <div className='column is-5'>
        <h3 className='is-title is-3' id={`plotfile-${id}`}>
          <span>
            <IconChart></IconChart>
          </span>{' '}
          <span>{title}</span>
        </h3>
        <div>
          <figure className='image is-4by3'>
            <img src={imageUrl} alt={title} />
          </figure>
        </div>
        <div className='content'>
          <p>{description}</p>
        </div>
      </div>
    </>
  );
};

export const SpotModelPlots: React.FC<{ plotfiles: any[] }> = ({
  plotfiles,
}) => {
  console.log('in SpotModelPlots', plotfiles);
  const sortedPlotfiles = plotfiles.sort((a: any, b: any) =>
    a.id > b.id ? 1 : -1,
  );
  const columns: React.ReactNode[] = [];
  for (let i = 0; i < sortedPlotfiles.length; i += 2) {
    if (sortedPlotfiles.length === 1) {
      break;
    }
    if (i === sortedPlotfiles.length - 1 && i % 2 === 0) {
      break;
    }

    columns.push(
      <ContainerNoColumn key={i}>
        <Plot
          key={i}
          imageUrl={sortedPlotfiles[i].url}
          title={`${sortedPlotfiles[i].title}`}
          description={sortedPlotfiles[i].description}
          id={sortedPlotfiles[i].id}
        />

        <Plot
          key={i + 1}
          imageUrl={sortedPlotfiles[i + 1].url}
          title={`${sortedPlotfiles[i + 1].title}`}
          description={sortedPlotfiles[i + 1].description}
          id={sortedPlotfiles[i + 1].id}
        />
      </ContainerNoColumn>,
    );
  }
  return <>{columns}</>;
};
