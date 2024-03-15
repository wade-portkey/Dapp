import { DependencyList, useCallback, useEffect, useRef, useState } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import appConfig from '../../app.json';

export function useHostUrl() {
  const [isLoading, setLoading] = useState(true);
  const [hostUrl, setHostUrl] = useState(appConfig.hostUrl);
  const { isConnected } = useNetInfo();
  useEffect(() => {
    if (!isConnected) return;
    fetch('https://schrodingernft.ai/api/app/config')
      .then(response => response.json())  
      .then((json) => {
        console.log('res', json);
        if (json?.data?.shellAppUrl) {
          setHostUrl(json.data.shellAppUrl);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [isConnected]);
  return {
    isLoading,
    hostUrl,
  };
}