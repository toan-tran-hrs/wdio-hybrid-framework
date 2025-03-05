import { parse } from "csv-parse/sync";
import { stringify, Input } from "csv-stringify/sync";

export const csvParse = (csvString: string, delimeter = ",") => {
  return parse(csvString, { delimiter: delimeter, skip_empty_lines: true, columns: true });
};

export const csvStringify = (obj: Input, delimeter = ",") => {
  return stringify(obj, { delimiter: delimeter, header: true });
};
