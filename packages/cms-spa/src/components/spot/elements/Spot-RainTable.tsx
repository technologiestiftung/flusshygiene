import {
  IBathingspot,
  IDefaultMeasurement,
} from "../../../lib/common/interfaces";
import React from "react";
import {
  arraySortByDateField,
  genericLastElements,
} from "../../../lib/utils/array-helpers";
import { Table, TableBody, TableRow } from "./Spot-Table";
import {
  formatDate,
  roundToFloatDigits,
} from "../../../lib/utils/formatting-helpers";
export function RainTable(spot: IBathingspot): React.ReactNode {
  return (
    <Table>
      <TableBody>
        {spot !== undefined &&
          (() => {
            if (spot.rains === undefined || spot.rains.length === 0) {
              return <TableRow th={"k. A."} tds={[""]}></TableRow>;
            } else {
              const dateOpts: Intl.DateTimeFormatOptions = {
                day: "numeric",
                month: "short",
                weekday: "short",
                year: "numeric",
              };
              const sortedRain = spot.rains.sort(arraySortByDateField);
              const lastFive = genericLastElements<IDefaultMeasurement>(
                sortedRain,
                5,
              );
              const rows = lastFive.reverse().map((ele, i) => {
                const tds = [`${roundToFloatDigits(ele.value, 2)} mm`];
                return (
                  <TableRow
                    key={i}
                    th={formatDate(ele.date, dateOpts)}
                    tds={tds}
                  ></TableRow>
                );
              });
              return rows;
            }
          })()}
      </TableBody>
    </Table>
  );
}
