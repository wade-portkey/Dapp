import { useCallback, useEffect, useState } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import appConfig from '../../app.json';
import { CustomHostStorageKey } from '../../src/component/CustomHost'
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useHostUrl() {
  const [isLoading, setLoading] = useState(true);
  const [hostUrl, setHostUrl] = useState(appConfig.hostUrl);
  const { isConnected } = useNetInfo();

  const fetchConfig = useCallback(() => {
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
  }, [isConnected])

  useEffect(() => {
    AsyncStorage.getItem(CustomHostStorageKey).then((hostUrl) => {
      if (hostUrl) {
        setHostUrl(hostUrl);
        setLoading(false);
      } else {
        fetchConfig();
      }
    });
  }, [isConnected]);
  return {
    isLoading,
    hostUrl,
  };
}