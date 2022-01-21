import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(async (
    url,
    method = "GET",
    body = null,
    headers = {}
  ) => {

    setIsLoading(true);
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);

    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortCtrl.signal
      });

      const responseData = await response.json();

      // keeps every ctrller except the one used for the request that we just got a response for
      activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl);

      if (!response.ok) {
        //true with 200ish status code, false with 400-500ish
        throw new Error(responseData.message); // catch block will trigger on 400-500 errors now
      }
      setIsLoading(false);
      return responseData;

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err; // must throw this so that the component using this hook knows an error happened and doesnt try and render undefined
    }
  }, []);

  const clearError = () => {
      setError(null);
  };

  // cleanup function if we were to change page while http request is ongoing
  useEffect(() => {
      return () => {
          activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
      };
  }, []);
  return {isLoading, error, sendRequest, clearError};
};
