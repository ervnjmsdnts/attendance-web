import { useState } from 'react';

const useCustomMutation = (mutationFn, { onSuccess, onError }) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const execute = async (payload = {}) => {
    try {
      setIsLoading(true);
      const result = await mutationFn(payload);
      onSuccess && onSuccess(result);
      setData(result);
    } catch (err) {
      onError && onError(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, data, error, isLoading };
};

export default useCustomMutation;
