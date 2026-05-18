
import { useState, useEffect, useCallback } from "react";
const BASE_URL = "http://192.168.100.201:3000"; // your backend URL
// const BASE_URL = "http://10.238.79.95:3000";


// const BASE_URL = "https://exprndnode.fly.dev";


export interface FetchOptions extends RequestInit {
  token?: string; // optional JWT token
}


const stripParentheses = (str: string): string => {
  return str.replace(/[()]/g, "");
};

export const fetchAPI = async <T = any>(
  endpointParentheses: string,
  options?: FetchOptions
): Promise<T> => {
  try {
    const endpoint = stripParentheses(endpointParentheses);
    //console.log({endpoint})
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(options?.token && { Authorization: `Bearer ${options?.token}` }),
      ...options?.headers,
    };
    const finalEndpoint = `${BASE_URL}${endpoint}`
    //console.log({finalEndpoint});
    const response = await fetch(finalEndpoint, {
      ...options,
      headers,
    });
    //console.log('Response', {response})

    if (!response.ok) {
    //  throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.log("Fetch error:", error);
    throw error;
  }
};


export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAPI(url, options);
      setData(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

