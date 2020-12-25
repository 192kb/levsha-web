import React from 'react';
import { FilterValues } from '../pages/listings/Filter';

const sessionStorageFilterValues = 'filter_values';

export const defaultCity = 1;

export const storeFilterValues = (filterValues?: FilterValues): void =>
  filterValues
    ? sessionStorage.setItem(
        sessionStorageFilterValues,
        JSON.stringify(filterValues)
      )
    : sessionStorage.removeItem(sessionStorageFilterValues);

export const getFilterValuesFromStorage = (): FilterValues | undefined => {
  const filterValues = sessionStorage.getItem(sessionStorageFilterValues);

  if (filterValues) {
    return JSON.parse(filterValues) as FilterValues;
  }

  return { city: defaultCity };
};

export const useFilterValues = (): [
  filterValues: FilterValues | undefined,
  setFilterValues: React.Dispatch<
    React.SetStateAction<FilterValues | undefined>
  >
] => {
  const [filterValues, setFilterValues] = React.useState<
    FilterValues | undefined
  >(getFilterValuesFromStorage());

  React.useEffect(() => {
    storeFilterValues(filterValues);
  }, [filterValues]);

  return [filterValues, setFilterValues];
};
