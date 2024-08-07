import { useState } from 'react';

export function useToggelMultipleBlocs(defaultValueToggel: boolean, n: number ) {
  const [statusBlocs, setStatusBlocs] = useState(new Array(n).fill(defaultValueToggel));

  const allTrue = (arr : boolean[]) => arr.every(element => element === true);
  const allFalse = (arr: boolean[]) => arr.every(element => element === false);

  const toggelBlocs = (index: number) => {
    const newBoolArray = [...statusBlocs];
    newBoolArray[index] = !newBoolArray[index];
    setStatusBlocs(newBoolArray);
  };

  const setAllValue = (value: boolean) => {
    setStatusBlocs(statusBlocs.map(() => value));
  };

  return {statusBlocs, allTrue, allFalse, toggelBlocs, setAllValue };
}

export default useToggelMultipleBlocs;