
import axios, { AxiosPromise } from 'axios';

export default function ajax(url: string, data: any = {}, type: 'GET' | 'POST' = 'GET'): AxiosPromise<any> {
  if (type === 'GET') {
    return axios.get(url, {
      params: data
    });
  } else {
    return axios.post(url, data);
  }
}

