import { useState, useEffect, useRef } from "react";
import { fetch } from "./../utils";

export function useFetch(url, opts) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const cancel = useRef(false);
  const prevData = useRef(() => data);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    fetch(url, opts)
      .then(res => res.json())
      .then(data => {
        if (!cancel.current) {
          prevData.current = data;
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancel.current) {
          setError(err);
          setLoading(false);
        }
      });
  }, [url]);

  return {
    data,
    loading,
    error,
    updateData: setData,
    prevData: prevData.current
  };
}
