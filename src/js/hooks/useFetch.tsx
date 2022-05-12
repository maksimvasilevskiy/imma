import { useState, useEffect } from 'react';

type useFetchT = (url: string, options: RequestInit) => { data: any; error: Error };

const useFetch: useFetchT = (url, options) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			try {
				const response = await fetch(url, options);
				const data = await response.json();

				setData(data);
			} catch (err) {
				setError(err);
			}
		};

		fetchData();
	}, []);

	return { data, error };
};

export default useFetch;
