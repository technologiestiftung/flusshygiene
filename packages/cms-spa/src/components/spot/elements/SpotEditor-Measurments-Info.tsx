import React from 'react';
import { ButtonIcon } from '../../Buttons';
import { IconInfo } from '../../fontawesome-icons';
import { MeasurementTypes } from '../../../lib/common/interfaces';

export const InfoAutoData = () => {
  return (
    <div className='content' style={{ paddingTop: '1rem' }}>
      <h3 className='is-title is-3'>Automatisierte Datenaggregation </h3>
      <p>
        Um Daten automatisiert für ihre Badestelle bereit zu stellen, müssen sie
        eine öffentlich zugängliche http URL eintragen, die täglich um 09:00
        abgeholt werden kann. Für E.C. und I.C. Messwerte müssen die Daten im
        Format JSON bereit stehen und benötigen folgende Formatierung.
      </p>
      <pre>
        <code>
          {JSON.stringify({
            data: [
              {
                date: '2020-02-05 10:00:00',
                conc_ec: 1,
                conc_ic: 1,
              },
            ],
          })}
        </code>
      </pre>
      <p>Für alle anderen Messwerte ist folgende Formatierung notwendig</p>
      <pre>
        <code>
          {JSON.stringify({
            data: [
              {
                date: '2020-02-05 10:00:00',
                value: 1,
              },
            ],
          })}
        </code>
      </pre>
    </div>
  );
};

export const InfoText: React.FC<{
  type: MeasurementTypes;
  showDataAggregationText?: boolean;
}> = ({ type, showDataAggregationText }) => (
  <>
    <h3 className='is-title is-3'>CSV Daten Upload </h3>
    <div className='content'>
      <p>
        {' '}
        Innerhalb der Plattform werden die folgenden Trennzeichen verwendet:
      </p>
      <div className='columns'>
        <div className='column is-5'>
          <table className='table is-narrow'>
            <thead>
              <tr>
                <th>Art des Trennzeichens</th>
                <th>Zeichen </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dezimaltrennzeichen </td>
                <td>Punkt </td>
              </tr>
              <tr>
                <td>Spaltentrennzeichen</td>
                <td>Komma</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p>
        Alle Spaltennamen und Werte müssen ohne Anführungszeichen angegeben
        werden. Die Datentabelle muss des Weiteren die folgenden Spalten
        enthalten:
      </p>
      <table className='table'>
        <thead>
          <tr>
            <th>Spaltenname</th>
            <th>Information</th>
            <th>Format</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>date</td>
            <td>Datum der Probenname </td>
            <td>
              YYYY-MM-DD HH:MM:SS <br />
              (Beispiel: 2016-04-15 13:15:13 = 15. April 2006 um 13 Uhr 15 und
              15 Sekunden)
            </td>
          </tr>

          {(() => {
            switch (type) {
              case 'measurements': {
                return (
                  <>
                    <tr>
                      <td>conc_ec</td>
                      <td>Messwert von E.coli [MPN/100mL]</td>
                      <td>Ganze Zahlen, keine Dezimalstellen</td>
                    </tr>
                    <tr>
                      <td>conc_ie</td>
                      <td>
                        Messwert von intestinalen Enterokokken [MPN/100mL]
                      </td>
                      <td>Ganze Zahlen, keine Dezimalstellen</td>
                    </tr>
                  </>
                );
              }
              case 'discharges':
              case 'pplantMeasurements':
              case 'gInputMeasurements':
              case 'globalIrradiances': {
                const typeDict = {
                  discharges: 'Durchfluss',
                  globalIrradiances: 'Global Strahlung',
                  pplantMeasurements: 'Klärwerk',
                  gInputMeasurements: 'Generischer Eingabe',
                };
                return (
                  <>
                    <tr>
                      <td>value</td>
                      <td>Messwert für {typeDict[type]}</td>
                      <td>Fließkommazahlen größer gleich 0</td>
                    </tr>
                  </>
                );
              }
              default: {
                throw new Error('No default case defined');
              }
            }
          })()}
        </tbody>
      </table>
      <p>
        Fehlende Messwerte müssen mit <code>-1</code> eingefügt werden.
      </p>
    </div>
    {(showDataAggregationText === undefined ||
      showDataAggregationText === true) && <InfoAutoData></InfoAutoData>}
    {/* <div className='content' style={{ paddingTop: '1rem' }}>
      <h3 className='is-title is-3'>Automatisierte Datenaggregation </h3>
      <p>
        Um Daten automatisiert für ihre Badestelle bereit zu stellen, müssen sie
        eine öffentlich zugängliche http URL eintragen, die täglich um 09:00
        abgeholt werden kann. Für E.C. und I.C. Messwerte müssen die Daten im
        Format JSON bereit stehen und benötigen folgende Formatierung.
      </p>
      <pre>
        <code>
          {JSON.stringify({
            data: [
              {
                date: '2020-02-05 10:00:00',
                conc_ec: 1,
                conc_ic: 1,
              },
            ],
          })}
        </code>
      </pre>
      <p>Für alle anderen Messwerte ist folgende Formatierung notwendig</p>
      <pre>
        <code>
          {JSON.stringify({
            data: [
              {
                date: '2020-02-05 10:00:00',
                value: 1,
              },
            ],
          })}
        </code>
      </pre>
    </div> */}
  </>
);
export const SpotEditorMeasurmentInfo: React.FC<{
  type: MeasurementTypes;
}> = ({ type }) => {
  const [infoIsVisible, setInfoIsVisible] = React.useState(false);
  return (
    <>
      <div className='buttons'>
        <ButtonIcon
          text={'Mehr erfahren'}
          handleClick={(e: React.ChangeEvent<any>) => {
            e.preventDefault();
            setInfoIsVisible((prev) => !prev);
          }}
        >
          <IconInfo></IconInfo>
        </ButtonIcon>
      </div>
      <div className='content'>
        {/* <h2>Dateineingabe</h2> */}
        <p>
          Die Dateneingabe muss über eine CSV.-Datei (Comma Seperated Value)
          erfolgen, dass wiederum einem bestimmten Format genügen muss, um von
          der Plattform eingelesen werden zu können.
        </p>
      </div>
      {infoIsVisible ? <InfoText type={type}></InfoText> : null}
    </>
  );
};
