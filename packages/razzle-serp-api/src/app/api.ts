import axios, { AxiosError, AxiosResponse } from 'axios'
axios.defaults.baseURL = process.env.RAZZLE_API_BASE_URL

const responseBody = <T>(response: AxiosResponse<T>) => (response.data as any).data

export const API = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: unknown) =>
    axios.post<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}
