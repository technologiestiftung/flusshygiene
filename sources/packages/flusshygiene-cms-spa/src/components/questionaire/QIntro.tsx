import React from 'react';
import { Container } from '../Container';
import { Link } from 'react-router-dom';
import { RouteNames } from '../../lib/common/enums';
// export const QIntro: React.FC<{
//   handleClick?: (e: React.ChangeEvent<any>) => void;
// }> = () => {
//   return (
//     <>
//       <Container columnClassName='is-narrow is-offset-9'>
//         {/* <button className='button is-small is-light' onClick={handleClick}>
//           Fenster Schließen
//         </button> */}
//       </Container>
//       <Container>
//         <div className=''>
//           <div className='content'>
//             <p>
//               <strong>Einleitung</strong>
//             </p>
//             <p>
//               Willkommen auf der Webplattform des <em>Tools zur</em>{' '}
//               <em>
//                 Anfangsbewertung von Standorten zur Einrichtung von
//                 Flussbadestellen
//               </em>
//               . Mit diesem Tool können Sie anhand von Fragen, die bei der
//               Einrichtung einer neuen Flussbadestelle zu beachten sind, Ihren
//               gewünschten Standort auf seine Eignung überprüfen. Hierzu werden
//               Sie durch thematisch sortierte Multiple-Choice-Fragen geleitet.{' '}
//             </p>
//             <p>Auf Grundlage Ihrer Antworten erhalten Sie dann</p>
//             <div className='content'>
//               <ul>
//                 <li>
//                   eine erste Einschätzung zur Umsetzungswahrscheinlichkeit Ihres
//                   Flussbadestellen-Vorhabens für den spezifischen Standort,
//                 </li>
//                 <li>Hintergrundinformationen und hilfreiche Links,</li>
//                 <li>
//                   Empfehlungen für wichtige nächste Schritte, um kritische
//                   Punkte zu klären.{' '}
//                 </li>
//               </ul>
//             </div>
//             <p>
//               Einige Antwortoptionen enthalten sogenannte K.O.-Kriterien, die
//               die Einrichtung einer Flussbadestelle am angegebenen Standort
//               faktisch unmöglich machen. In diesem Fall wird ein Abbruch des
//               Vorhabens empfohlen.
//             </p>
//             <p>
//               Die Kriterien sind thematisch (Wasser- und Landseitig) sowie nach
//               ihrer Relevanz geordnet, K.O.-Kriterien werden dabei jeweils
//               zuerst abgefragt. Alle Kriterien sind nach dem Aufwand
//               gegebenenfalls notwendiger Gegenmaßnahmen gewichtet. Diese
//               Gewichtung fließt später in die Endbewertung ein.
//             </p>
//             <p>
//               <strong>Empfehlungen für eine Ortsbegehung</strong>
//             </p>
//             <p>
//               Sicherlich haben Sie, bevor Sie diese Anfangsbewertung für Ihr
//               Vorhaben durchführen, den gewünschten Standort bereits besucht.
//               Dennoch empfiehlt es sich vor der Beantwortung der Fragen noch
//               einmal eine gezielte Ortsbegehung durchzuführen und auf relevante
//               Punkte für die Durchführung der Standortprüfung zu achten.{' '}
//             </p>
//             <p>
//               Hier finden Sie eine Liste von Punkten, auf die Sie mit Blick auf
//               die spätere Standortbewertung im speziellen achten sollten, und
//               mit denen Sie einige Fragen später (leichter) beantworten können:
//             </p>
//           </div>
//           <div className='content'>
//             <ul>
//               <li>
//                 In welcher Entfernung zum Standort befinden sich Wasserbauwerke
//                 (z.B. Schleusen, Wehre, Brücken, Häfen)? (relevant für Frage
//                 xxx)
//               </li>
//               <li>
//                 Wie ist der Schiffsverkehr in dem anvisierten Standort
//                 beschaffen? Wird der Flussabschnitt von der Fracht- und
//                 Fahrgastschifffahrt, motorisierter Freizeitschifffahrt oder
//                 Kleinfahrzeugen ohne eigene Triebkraft genutzt? (Frage xxx)
//               </li>
//               <li>
//                 In welcher Entfernung zum Standort befinden sich Anlegestellen?
//                 (Frage xxx)
//               </li>
//               <li>
//                 Die Strömungsgeschwindigkeit in einem Fluss abzuschätzen, ist
//                 ohne entsprechende Messinstrumente kaum möglich. Ein
//                 Anhaltspunkt für die Fließgeschwindigkeit eines Flusses kann
//                 jedoch durch einen einfachen Versuch ermittelt werden. Werfen
//                 Sie hierzu einen Stock in den Fluss, möglichst weit in die Mitte
//                 des Flussquerschnitts. Versuchen Sie nun in Richtung der
//                 Strömung neben dem Stock herzulaufen. Wenn Sie gemütlichen
//                 Schrittes mit dem Stock mitlaufen können oder sich in diesem
//                 Tempo sogar schneller als der Stock bewegen, kann davon
//                 ausgegangen werden, dass es sich um eine Fließgeschwindigkeit
//                 von weniger als 1,5 m/s handelt. (Frage xxx)
//               </li>
//               <li>
//                 Achten Sie auf Schilder zu Landschafts-, Natur-, und
//                 Denkmalschutz. (Frage xxx)
//               </li>
//               <li>
//                 Schauen Sie sich den Uferbereich des anvisierten Standortes für
//                 eine Badestelle an. Wie ist der Gewässergrund beschaffen? Wie
//                 ist die Wassertiefe am Uferbereich und wie schnell fällt der
//                 Gewässergrund ab? (Frage xxx)
//               </li>
//               <li>
//                 Wie ist es um die Zuwegung zum Standort bestellt? (Frage xxx)
//               </li>
//               <li>
//                 Lassen sich vor Ort eventuell schon Informationen zu den
//                 Eigentumsverhältnissen in Erfahrung bringen? (Frage xxx)
//               </li>
//               <li>
//                 Befinden sich in der unmittelbaren Umgebung zum Standort
//                 Haltestellen des öffentlichen Nahverkehrs? (Frage xxx)
//               </li>
//               <li>
//                 Sind bereits PKW-Stellplätze oder zumindest Raum für eben solche
//                 vorhanden? (Frage xxx)
//               </li>
//               <li>
//                 Sind Sanitäranlagen in 300 m Umkreis um den Standort vorhanden
//                 und können auch genutzt werden? (Frage xxx)
//               </li>
//               <li>
//                 Sind bereits Abfallbehälter in unmittelbarer Umgebung des
//                 Standortes vorhanden? (Frage xxx)
//               </li>
//               <li>
//                 Wird der Standort bereits von anderen Nutzergruppen genutzt
//                 (Angler, Sportvereine usw.)? (Frage xxx)
//               </li>
//               <li>
//                 Gibt es Anwohner in Hördistanz zur Badestelle? (Frage xxx)
//               </li>
//             </ul>
//           </div>
//         </div>
//       </Container>
//       <Container>
//         <div className='buttons'>
//           <Link
//             to={`/${RouteNames.questionnaire}/1`}
//             className='button is-primary'
//           >
//             Standortbewertung beginnen!
//           </Link>
//         </div>
//       </Container>
//     </>
//   );
// };

export const QIntroNew: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
  return (
    <>
      <Container columnClassName='is-8'>
        <h1 className='is-title is-1'>Einleitung</h1>
        <div className='content'>
          <p>
            Willkommen auf der Webplattform des <em>Tools zur</em>{' '}
            <em>
              Anfangsbewertung von Standorten zur Einrichtung von
              Flussbadestellen
            </em>
            . Mit diesem Tool können Sie anhand von Fragen, die bei der
            Einrichtung einer neuen Flussbadestelle zu beachten sind, Ihren
            gewünschten Standort auf seine Eignung überprüfen. Hierzu werden Sie
            durch thematisch sortierte Multiple-Choice-Fragen geleitet.{' '}
          </p>
          <p>Auf Grundlage Ihrer Antworten erhalten Sie dann</p>
          <ul>
            <li>
              eine erste Einschätzung zur Umsetzungswahrscheinlichkeit Ihres
              Flussbadestellen-Vorhabens für den spezifischen Standort,
            </li>
            <li>Hintergrundinformationen und hilfreiche Links,</li>
            <li>
              Empfehlungen für wichtige nächste Schritte, um kritische Punkte zu
              klären.{' '}
            </li>
          </ul>
          <p>
            Einige Antwortoptionen enthalten sogenannte K.O.-Kriterien, die die
            Einrichtung einer Flussbadestelle am angegebenen Standort faktisch
            unmöglich machen. In diesem Fall wird ein Abbruch des Vorhabens
            empfohlen.
          </p>
          <p>
            Die Kriterien sind thematisch (Wasser- und Landseitig) sowie nach
            ihrer Relevanz geordnet, K.O.-Kriterien werden dabei jeweils zuerst
            abgefragt. Alle Kriterien sind nach dem Aufwand gegebenenfalls
            notwendiger Gegenmaßnahmen gewichtet. Diese Gewichtung fließt später
            in die Endbewertung ein.
          </p>
          <p>
            <strong>Empfehlungen für eine Ortsbegehung</strong>
          </p>
          <p>
            Sicherlich haben Sie, bevor Sie diese Anfangsbewertung für Ihr
            Vorhaben durchführen, den gewünschten Standort bereits besucht.
            Dennoch empfiehlt es sich vor der Beantwortung der Fragen noch
            einmal eine gezielte Ortsbegehung durchzuführen und auf relevante
            Punkte für die Durchführung der Standortprüfung zu achten.{' '}
          </p>
          <p>
            Hier finden Sie eine Liste von Punkten, auf die Sie mit Blick auf
            die spätere Standortbewertung im speziellen achten sollten, und mit
            denen Sie einige Fragen später (leichter) beantworten können:
          </p>
          <ul>
            <li>
              In welcher Entfernung zum Standort befinden sich Wasserbauwerke
              (z.B. Schleusen, Wehre, Brücken, Häfen)? (relevant für Frage 1)
            </li>
            <li>
              Wie ist der Schiffsverkehr in dem anvisierten Standort beschaffen?
              Wird der Flussabschnitt von der Fracht- und Fahrgastschifffahrt,
              motorisierter Freizeitschifffahrt oder Kleinfahrzeugen ohne eigene
              Triebkraft genutzt? (Frage 2-3)
            </li>
            <li>
              In welcher Entfernung zum Standort befinden sich Anlegestellen?
              (Frage 4-5)
            </li>
            <li>
              Die Strömungsgeschwindigkeit in einem Fluss abzuschätzen, ist ohne
              entsprechende Messinstrumente kaum möglich. Ein Anhaltspunkt für
              die Fließgeschwindigkeit eines Flusses kann jedoch durch einen
              einfachen Versuch ermittelt werden. Werfen Sie hierzu einen Stock
              in den Fluss, möglichst weit in die Mitte des Flussquerschnitts.
              Versuchen Sie nun in Richtung der Strömung neben dem Stock
              herzulaufen. Wenn Sie gemütlichen Schrittes mit dem Stock
              mitlaufen können oder sich in diesem Tempo sogar schneller als der
              Stock bewegen, kann davon ausgegangen werden, dass es sich um eine
              Fließgeschwindigkeit von weniger als 1,5 m/s handelt. (Frage 6)
            </li>
            <li>
              Achten Sie auf Schilder zu Landschafts-, Natur-, und
              Denkmalschutz. (Frage 13-15)
            </li>
            <li>
              Schauen Sie sich den Uferbereich des anvisierten Standortes für
              eine Badestelle an. Wie ist der Gewässergrund beschaffen? Wie ist
              die Wassertiefe am Uferbereich und wie schnell fällt der
              Gewässergrund ab? (Frage 17-18)
            </li>
            <li>
              Wie ist es um die Zuwegung zum Standort bestellt? (Frage 20)
            </li>
            <li>
              Lassen sich vor Ort eventuell schon Informationen zu den
              Eigentumsverhältnissen in Erfahrung bringen? (Frage 19-26)
            </li>
            <li>
              Befinden sich in der unmittelbaren Umgebung zum Standort
              Haltestellen des öffentlichen Nahverkehrs? (Frage 21)
            </li>
            <li>
              Sind bereits PKW-Stellplätze oder zumindest Raum für eben solche
              vorhanden? (Frage 22)
            </li>
            <li>
              Sind Sanitäranlagen in 300 m Umkreis um den Standort vorhanden und
              können auch genutzt werden? (Frage 24)
            </li>
            <li>
              Sind bereits Abfallbehälter in unmittelbarer Umgebung des
              Standortes vorhanden? (Frage 25)
            </li>
            <li>
              Wird der Standort bereits von anderen Nutzergruppen genutzt
              (Angler, Sportvereine usw.)? (Frage 26-27)
            </li>
            <li>Gibt es Anwohner in Hördistanz zur Badestelle? (Frage 26)</li>
          </ul>
        </div>
        {/* <div className='content'>
          <p>
            Willkommen auf der Webplattform des <em>Tools zur</em>{' '}
            <em>
              Anfangsbewertung von Standorten zur Einrichtung von
              Flussbadestellen
            </em>
            . Mit diesem Tool können Sie anhand von Fragen, die bei der
            Einrichtung einer neuen Flussbadestelle zu beachten sind, Ihren
            gewünschten Standort auf seine Eignung überprüfen. Hierzu werden Sie
            durch thematisch sortierte Multiple-Choice-Fragen geleitet.{' '}
          </p>
          <p>Auf Grundlage Ihrer Antworten erhalten Sie dann</p>
          <ul>
            <li>
              eine erste Einschätzung zur Umsetzungswahrscheinlichkeit Ihres
              Flussbadestellen-Vorhabens für den spezifischen Standort,
            </li>
            <li>Hintergrundinformationen und hilfreiche Links,</li>
            <li>
              Empfehlungen für wichtige nächste Schritte, um kritische Punkte zu
              klären.{' '}
            </li>
          </ul>
          <p>
            Einige Antwortoptionen enthalten sogenannte K.O.-Kriterien, die die
            Einrichtung einer Flussbadestelle am angegebenen Standort faktisch
            unmöglich machen. In diesem Fall wird ein Abbruch des Vorhabens
            empfohlen.
          </p>
          <p>
            Die Kriterien sind thematisch (Wasser- und Landseitig) sowie nach
            ihrer Relevanz geordnet, K.O.-Kriterien werden dabei jeweils zuerst
            abgefragt. Alle Kriterien sind nach dem Aufwand gegebenenfalls
            notwendiger Gegenmaßnahmen gewichtet. Diese Gewichtung fließt später
            in die Endbewertung ein.
          </p>
          <p>
            <strong>Empfehlungen für eine Ortsbegehung</strong>
          </p>
          <p>
            Sicherlich haben Sie, bevor Sie diese Anfangsbewertung für Ihr
            Vorhaben durchführen, den gewünschten Standort bereits besucht.
            Dennoch empfiehlt es sich vor der Beantwortung der Fragen noch
            einmal eine gezielte Ortsbegehung durchzuführen und auf relevante
            Punkte für die Durchführung der Standortprüfung zu achten.{' '}
          </p>
          <p>
            Hier finden Sie eine Liste von Punkten, auf die Sie mit Blick auf
            die spätere Standortbewertung im speziellen achten sollten, und mit
            denen Sie einige Fragen später (leichter) beantworten können:
          </p>
          <ul>
            <li>
              In welcher Entfernung zum Standort befinden sich Wasserbauwerke
              (z.B. Schleusen, Wehre, Brücken, Häfen)? (relevant für Frage 1)
            </li>
            <li>
              Wie ist der Schiffsverkehr in dem anvisierten Standort beschaffen?
              Wird der Flussabschnitt von der Fracht- und Fahrgastschifffahrt,
              motorisierter Freizeitschifffahrt oder Kleinfahrzeugen ohne eigene
              Triebkraft genutzt? (Frage 2-3)
            </li>
            <li>
              In welcher Entfernung zum Standort befinden sich Anlegestellen?
              (Frage 4-5)
            </li>
            <li>
              Die Strömungsgeschwindigkeit in einem Fluss abzuschätzen, ist ohne
              entsprechende Messinstrumente kaum möglich. Ein Anhaltspunkt für
              die Fließgeschwindigkeit eines Flusses kann jedoch durch einen
              einfachen Versuch ermittelt werden. Werfen Sie hierzu einen Stock
              in den Fluss, möglichst weit in die Mitte des Flussquerschnitts.
              Versuchen Sie nun in Richtung der Strömung neben dem Stock
              herzulaufen. Wenn Sie gemütlichen Schrittes mit dem Stock
              mitlaufen können oder sich in diesem Tempo sogar schneller als der
              Stock bewegen, kann davon ausgegangen werden, dass es sich um eine
              Fließgeschwindigkeit von weniger als 1,5 m/s handelt. (Frage 6)
            </li>
            <li>
              Achten Sie auf Schilder zu Landschafts-, Natur-, und
              Denkmalschutz. (Frage 13-15)
            </li>
            <li>
              Schauen Sie sich den Uferbereich des anvisierten Standortes für
              eine Badestelle an. Wie ist der Gewässergrund beschaffen? Wie ist
              die Wassertiefe am Uferbereich und wie schnell fällt der
              Gewässergrund ab? (Frage 17-18)
            </li>
            <li>
              Wie ist es um die Zuwegung zum Standort bestellt? (Frage 20)
            </li>
            <li>
              Lassen sich vor Ort eventuell schon Informationen zu den
              Eigentumsverhältnissen in Erfahrung bringen? (Frage 19-26)
            </li>
            <li>
              Befinden sich in der unmittelbaren Umgebung zum Standort
              Haltestellen des öffentlichen Nahverkehrs? (Frage 21)
            </li>
            <li>
              Sind bereits PKW-Stellplätze oder zumindest Raum für eben solche
              vorhanden? (Frage 22)
            </li>
            <li>
              Sind Sanitäranlagen in 300 m Umkreis um den Standort vorhanden und
              können auch genutzt werden? (Frage 24)
            </li>
            <li>
              Sind bereits Abfallbehälter in unmittelbarer Umgebung des
              Standortes vorhanden? (Frage 25)
            </li>
            <li>
              Wird der Standort bereits von anderen Nutzergruppen genutzt
              (Angler, Sportvereine usw.)? (Frage 26-27)
            </li>
            <li>Gibt es Anwohner in Hördistanz zur Badestelle? (Frage 26)</li>
          </ul>
          <p>Reporting:</p>
          <p>
            <strong>Allgemeine Empfehlungen </strong>
          </p>
          <p>
            Nachdem Sie nun die Eignung des Standortes für die Eröffnung einer
            neuen Badestelle untersucht haben, kann nun mit der Arbeit an der
            Einrichtung einer Flussbadestelle begonnen werden. Im Merkblatt zur
            Einrichtung neuer Flussbadegewässer{' '}
            <a
              target='_blank'
              rel='nofollow noopener noreferrer'
              href='https://www.inter3.de/fileadmin/user_upload/Downloads/Flyer_usw/Merkblatt_Einrichtung_Flussbadegewaesser-Flusshygiene-Final-Nov2018.pdf'
            >
              <IconPDF /> Merkblatt Einrichtung Flussbadegewässer Flusshygiene
            </a>{' '}
            finden Sie einen bündigen Überblick über Themen, die bei der
            Einrichtung neuer Flussbadestellen berücksichtig werden müssen.{' '}
          </p>
          <p>
            <strong>Überzeugende Projektskizze vorbereiten</strong>
          </p>
          <p>
            Einer der ersten Schritte auf dem Weg hin zu einer neuen
            Flussbadestelle sollte eine Projektskizze sein. Die Projektskizze
            gibt anderen Akteuren eine konkrete visuelle sowie konzeptionelle
            Vorstellung von dem, was an dem anvisierten Standort geplant ist und
            sollte zumindest grobe Antworten auf die Fragen liefern: wo, wie und
            warum eine neue Flussbadestelle eröffnet werden sollte und wer dabei
            welche Aufgaben übernehmen könnte. Als Hilfestellung empfiehlt sich
            die Lektüre des Leitfadens „Eröffnung neuer Flussbadestellen -
            Praxisleitfaden am Beispiel der Berliner Vorstadtspree“.{' '}
            <a
              target='_blank'
              rel='nofollow noopener noreferrer'
              href='https://www.inter3.de/fileadmin/user_upload/Downloads/Flyer_usw/Praxisleitfaden_Eroeffnung_neuer_Flussbadestellen-Januar_2019.pdf'
            >
              <IconPDF /> Praxisleitfaden Eröffnung neuer Flussbadestellen
            </a>
          </p>
          <p>
            <strong>Flächeneigentümer frühzeitig kontaktieren</strong>
          </p>
          <p>
            Falls Sie nicht bereits die Nutzungsrechte für die benötigten
            Flächen haben, sollten Sie sich möglichst frühzeitig mit den
            Flächeneigentümer_innen in Verbindung setzen und eruieren, ob und
            wenn ja, unter welchen Bedingungen eine Nutzung möglich ist. Da es
            sich bei den Landflächen häufig und bei den Wasserflächen an
            Fließgewässern immer um öffentliche Flächen handelt, ist es sinnvoll
            frühzeitig um politischen Rückhalt für die Eröffnung einer
            Badestelle zu werben. Hierzu ist es hilfreich, nach möglichen
            Anknüpfungspunkten in den städtischen oder landschaftlichen
            Entwicklungsplänen sowie Gewässer-, Tourismus- und Sportkonzepten
            Ausschau zu halten und somit in die schon bestehende Planung mit
            einzubinden.
          </p>
          <p>
            <strong>Bürger und Anwohner mit einbeziehen</strong>
          </p>
          <p>
            Projekte wie die Eröffnung einer neuen Badestelle, bei der eine
            Vielzahl von unterschiedlichen Akteuren involviert ist, sollten
            immer mit einer schon frühzeitig beginnenden Bürgerbeteiligung
            einhergehen. Hierzu sei auf die Publikation „Schoenemann, Britta /
            Jardin, Norbert (2015): Baden in Fließgewässern. Ein
            Handlungsleitfaden am Beispiel des Baldeneysees &amp; der Unteren
            Ruhr“ aus dem BMBF-Projekt „Sichere Ruhr“ hingewiesen.{' '}
          </p>
        </div> */}
      </Container>
      {isModal === undefined ||
        (isModal === false && (
          <Container columnClassName='is-8'>
            <div className='buttons'>
              <Link
                to={`/${RouteNames.questionnaire}/1`}
                className='button is-primary'
              >
                Standortbewertung beginnen!
              </Link>
            </div>
          </Container>
        ))}
    </>
  );
};
