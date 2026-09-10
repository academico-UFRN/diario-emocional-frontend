import axios, { AxiosError } from "axios";
import { errorResponseSchema, type ErrorResponse } from "./schemas";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL
		? import.meta.env.VITE_API_URL
		: "http://localhost:8080",
	headers: {
		"Content-Type": "application/json",
	},
});


api.interceptors.response.use(
	(response) => response,
	(error: AxiosError<ErrorResponse>) => {
		if (error.response?.data) {
			const parseResult = errorResponseSchema.safeParse(error.response.data);

			if (parseResult.success) {
				error.message = parseResult.data.message;
			}
		}
		return Promise.reject(error);
	}
);
