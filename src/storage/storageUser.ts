import { UserDTO } from '@dtos/UserDTO';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userStorage } from './storageConfig';

export const storageUserSave = async (user: UserDTO) => {
    await AsyncStorage.setItem(userStorage, JSON.stringify(user))
}


export const storageUserGet = async () => {
    const storage = await AsyncStorage.getItem(userStorage)
    return storage ? JSON.parse(storage) : null
}

export const storageUserRemove = async () => {
    await AsyncStorage.removeItem(userStorage)
}