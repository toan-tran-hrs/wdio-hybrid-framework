export function getFormattedNumber(
  number: number | string,
  minimumFractionDigits = 2,
  locales: Intl.LocalesArgument = "en-US"
): string {
  return Number(number).toLocaleString(locales, { minimumFractionDigits: minimumFractionDigits });
}

export const replaceCharacterAtIndex = (string: string, index: number, replacement: string) => {
  return string.slice(0, index) + replacement + string.slice(index + replacement.length);
};

export const addCharacterAtIndex = (string: string, index: number, supplement: string) => {
  return string.slice(0, index) + supplement + string.slice(index);
};

export const replaceAllForRecord = (
  record: Record<string, string>,
  searchValue: string | RegExp,
  replaceValue: string
) => {
  for (const key in record) {
    record[key] = record[key].replaceAll(searchValue, replaceValue);
  }
  return record;
};
