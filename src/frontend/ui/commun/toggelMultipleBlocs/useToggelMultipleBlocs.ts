import { useState } from 'react';

export function useToggelMultipleBlocs(defaultValueToggel: boolean, n: number, nbSousBlocs: number) {
  const [statusBlocs, setStatusBlocs] = useState(new Array(n).fill(defaultValueToggel));
  const [statusSousBlocs, setStatusSousBlocs] = useState<boolean[]>(new Array(nbSousBlocs).fill(defaultValueToggel));

  const allTrue = (arr: boolean[]) => {
    return statusSousBlocs.concat(arr).every(Boolean);
  };

  const allFalse = (arr: boolean[]) => {
    return statusSousBlocs.concat(arr).every(element => !element);
  }

  const toggelBlocs = (index: number) => {
    const newBoolArray = [...statusBlocs];
    newBoolArray[index] = !newBoolArray[index];
    setStatusBlocs(newBoolArray);
  };

  const setAllValue = (value: boolean) => {
    setStatusBlocs(statusBlocs.map(() => value));
    if (statusSousBlocs.length > 0 && setStatusSousBlocs) {
      setStatusSousBlocs(statusSousBlocs.map(() => value));
    }
  };

  return { statusBlocs, allTrue, allFalse, toggelBlocs, setAllValue, statusSousBlocs, setStatusSousBlocs };
}

export default useToggelMultipleBlocs;