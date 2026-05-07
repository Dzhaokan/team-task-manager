import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isFilterActive, type BoardFilter } from '../model/types';
import {
  parseFilterFromParams,
  stripFilterFromParams,
  writeFilterToParams,
} from './url';

export const useBoardFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = useMemo(
    () => parseFilterFromParams(searchParams),
    [searchParams]
  );

  const setFilter = (patch: Partial<BoardFilter>) => {
    setSearchParams(
      (current) => {
        const next = { ...parseFilterFromParams(current), ...patch };
        return writeFilterToParams(current, next);
      },
      { replace: true }
    );
  };

  const clear = () => {
    setSearchParams((current) => stripFilterFromParams(current), {
      replace: true,
    });
  };

  return {
    filter,
    setFilter,
    clear,
    isActive: isFilterActive(filter),
  };
};
