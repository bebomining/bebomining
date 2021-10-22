import { useState, useEffect, useRef } from "react";
import { fetch } from "./../utils";

export function useFetch(namespace, opts) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const cancel = useRef(false);
  const prevData = useRef(() => data);
  const timestamp = useRef(null);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    timestamp.current = Date.now();
    const innerTimestamp = timestamp.current;
    fetch(namespace, opts)
      .then(data => {
        if (!cancel.current && innerTimestamp === timestamp.current) {
          prevData.current = data;
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancel.current && innerTimestamp === timestamp.current) {
          setError(err);
          setLoading(false);
        }
      });
  }, [namespace]);

  return {
    data,
    loading,
    error,
    updateData: setData,
    prevData: prevData.current
  };
}
