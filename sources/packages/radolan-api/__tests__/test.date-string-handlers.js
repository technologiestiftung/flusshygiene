
import tap from 'tap';
import { matchDates, matchGroups, buildDate } from '../.build/lib/date-string-handlers';
// tap.test('date matches', ()=>{
  // tap.plan(6, 'Planned resuts');
  const dateStr = '20191010';
  const match = matchDates(dateStr);

  if(match !== null){
    tap.pass('Shoud find a match');
  }
  tap.equal(match[0], dateStr);
  tap.equal(match.groups.year, '2019');
  tap.equal(match.groups.month, '10');
  tap.equal(match.groups.day, '10');

  tap.equal(matchGroups(match.groups), true);
  tap.equal(matchGroups(undefined), false);
  tap.equal(buildDate(match.groups) instanceof Date, true);
  // else{
  //   tap.pass('Match is not null');
  // }
  // tap.end();
// });