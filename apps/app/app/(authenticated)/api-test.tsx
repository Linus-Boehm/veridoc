"use client";

import { ApiClient } from "@/services/ApiClient";
import { useEffect } from "react";
import type { FC } from "react";

export const ApiTest: FC = () => {
  useEffect(() => {
    ApiClient.monitoring.health.$get().then((res) => {
      console.log(res);
    });
  }, []);
  return <div>ApiTest</div>;
};
