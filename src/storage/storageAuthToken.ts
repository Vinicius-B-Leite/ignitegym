import AsyncStorage from '@react-native-async-storage/async-storage';
import { authTokenStorage } from './storageConfig';



type StorageAuthTokenType = {
    token: string,
    refresh_token: string
}
export const storageAuthTokenSave = async (token: string, refresh_token: string) => {
    await AsyncStorage.setItem(authTokenStorage, JSON.stringify({ token, refresh_token }))
}

export const storageAuthTokenGet = async () => {
    const response = await AsyncStorage.getItem(authTokenStorage)
    const { refresh_token, token }: StorageAuthTokenType = response ? JSON.parse(response) : {}
    return { token, refresh_token }
}

export const storageAuthTokenRemove = async () => {
    await AsyncStorage.removeItem(authTokenStorage)
}