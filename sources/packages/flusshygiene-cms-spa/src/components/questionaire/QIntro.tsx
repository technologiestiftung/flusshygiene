import React from 'react';
export const QIntro: React.FC = () => {
  return (
    <section className='questionnaire__intro-text section'>
      <div className='content'>
        <p>
          <strong>Einleitung</strong>
        </p>
        <p>
          Willkommen auf der Webplattform des <em>Tools zur</em>{' '}
          <em>
            Anfangsbewertung von Standorten zur Einrichtung von Flussbadestellen
          </em>
          . Mit diesem Tool können Sie anhand von Fragen, die bei der
          Einrichtung einer neuen Flussbadestelle zu beachten sind, Ihren
          gewünschten Standort auf seine Eignung überprüfen. Hierzu werden Sie
          durch thematisch sortierte Multiple-Choice-Fragen geleitet.{' '}
        </p>
        <p>Auf Grundlage Ihrer Antworten erhalten Sie dann</p>
        <div className='content'>
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
        </div>
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
          Dennoch empfiehlt es sich vor der Beantwortung der Fragen noch einmal
          eine gezielte Ortsbegehung durchzuführen und auf relevante Punkte für
          die Durchführung der Standortprüfung zu achten.{' '}
        </p>
        <p>
          Hier finden Sie eine Liste von Punkten, auf die Sie mit Blick auf die
          spätere Standortbewertung im speziellen achten sollten, und mit denen
          Sie einige Fragen später (leichter) beantworten können:
        </p>
      </div>
      <div className='content'>
        <ul>
          <li>
            In welcher Entfernung zum Standort befinden sich Wasserbauwerke
            (z.B. Schleusen, Wehre, Brücken, Häfen)? (relevant für Frage xxx)
          </li>
          <li>
            Wie ist der Schiffsverkehr in dem anvisierten Standort beschaffen?
            Wird der Flussabschnitt von der Fracht- und Fahrgastschifffahrt,
            motorisierter Freizeitschifffahrt oder Kleinfahrzeugen ohne eigene
            Triebkraft genutzt? (Frage xxx)
          </li>
          <li>
            In welcher Entfernung zum Standort befinden sich Anlegestellen?
            (Frage xxx)
          </li>
          <li>
            Die Strömungsgeschwindigkeit in einem Fluss abzuschätzen, ist ohne
            entsprechende Messinstrumente kaum möglich. Ein Anhaltspunkt für die
            Fließgeschwindigkeit eines Flusses kann jedoch durch einen einfachen
            Versuch ermittelt werden. Werfen Sie hierzu einen Stock in den
            Fluss, möglichst weit in die Mitte des Flussquerschnitts. Versuchen
            Sie nun in Richtung der Strömung neben dem Stock herzulaufen. Wenn
            Sie gemütlichen Schrittes mit dem Stock mitlaufen können oder sich
            in diesem Tempo sogar schneller als der Stock bewegen, kann davon
            ausgegangen werden, dass es sich um eine Fließgeschwindigkeit von
            weniger als 1,5 m/s handelt. (Frage xxx)
          </li>
          <li>
            Achten Sie auf Schilder zu Landschafts-, Natur-, und Denkmalschutz.
            (Frage xxx)
          </li>
          <li>
            Schauen Sie sich den Uferbereich des anvisierten Standortes für eine
            Badestelle an. Wie ist der Gewässergrund beschaffen? Wie ist die
            Wassertiefe am Uferbereich und wie schnell fällt der Gewässergrund
            ab? (Frage xxx)
          </li>
          <li>Wie ist es um die Zuwegung zum Standort bestellt? (Frage xxx)</li>
          <li>
            Lassen sich vor Ort eventuell schon Informationen zu den
            Eigentumsverhältnissen in Erfahrung bringen? (Frage xxx)
          </li>
          <li>
            Befinden sich in der unmittelbaren Umgebung zum Standort
            Haltestellen des öffentlichen Nahverkehrs? (Frage xxx)
          </li>
          <li>
            Sind bereits PKW-Stellplätze oder zumindest Raum für eben solche
            vorhanden? (Frage xxx)
          </li>
          <li>
            Sind Sanitäranlagen in 300 m Umkreis um den Standort vorhanden und
            können auch genutzt werden? (Frage xxx)
          </li>
          <li>
            Sind bereits Abfallbehälter in unmittelbarer Umgebung des Standortes
            vorhanden? (Frage xxx)
          </li>
          <li>
            Wird der Standort bereits von anderen Nutzergruppen genutzt (Angler,
            Sportvereine usw.)? (Frage xxx)
          </li>
          <li>Gibt es Anwohner in Hördistanz zur Badestelle? (Frage xxx)</li>
        </ul>
      </div>
    </section>
  );
};
