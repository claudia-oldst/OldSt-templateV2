/* eslint-disable @typescript-eslint/no-explicit-any */
import { STORAGE_KEY } from '../constants';
import { QueryParams } from '../types/queryParams';
import { AxiosConfig } from './axiosConfig';

const API_USER = '/user';

class UserApi extends AxiosConfig {
    constructor() {
        super(process.env.NX_API_User_URL, true, false);
    }

    protected async getAccessTokenAsync(): Promise<string> {
        return sessionStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
    }

    public getUsers = async <T>(siteId: string, queryParams: QueryParams): Promise<T> => {
        return await this.axiosInstance.get(`${API_USER}`, {
            params: {
                sites: siteId,
                ...queryParams
            }
        }).then(({ data }) => data);
    };
}

const User = new UserApi();
export { User };
