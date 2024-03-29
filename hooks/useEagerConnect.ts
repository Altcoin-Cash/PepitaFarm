import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { AltConnector } from "../connectors/AltConnector";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    AltConnector.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(AltConnector, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
