'use client';

import { useApiClient } from '@taxel/queries/src/api';
import { useEffect } from 'react';
import type { FC } from 'react';

export const ApiTest: FC = () => {
  const apiClient = useApiClient();
  useEffect(() => {
    apiClient.monitoring.health.$get().then((res) => {
      res.json().then((res) => {
        console.log(res);
      });
    });
  }, [apiClient]);
  return <div>ApiTest</div>;
};
