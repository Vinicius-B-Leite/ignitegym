import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api/api";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { ReactNode, createContext, useEffect, useState } from "react";


type AuthContextData = {
    user: UserDTO
    singIn: (email: string, password: string) => Promise<void>,
    loadingUser: boolean
    logout: () => Promise<void>
    updateUserProfile: (userData: UserDTO) => Promise<void>
}
export const AuthContext = createContext({} as AuthContextData)


export function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO)
    const [loadingUser, setLoadingUser] = useState(true)

    useEffect(() => {
        loadUserData()
    }, [])


    const updateUserProfile = async (userData: UserDTO) => {
        try {
            setUser(userData)
            await storageUserSave(userData)
        } catch (error) {
            throw error
        }
    }

    const loadUserData = async () => {
        try {
            setLoadingUser(true)
            const userLogged = await storageUserGet()
            const { token } = await storageAuthTokenGet()

            if (token && userLogged) {
                UserAndTokenUpdate(userLogged, token)
            }


        } catch (error) {
            throw error
        } finally {
            setLoadingUser(false)
        }
    }

    const UserAndTokenUpdate = (userData: UserDTO, token: string) => {
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token
        setUser(userData)
    }

    const storageUserAndTokenSave = async (userData: UserDTO, token: string, refresh_token: string) => {
        try {
            setLoadingUser(true)
            await storageUserSave(userData)
            await storageAuthTokenSave(token, refresh_token)
        } catch (error) {
            throw error
        } finally {
            setLoadingUser(false)
        }

    }

    const singIn = async (email: string, password: string) => {
        try {
            const { data } = await api.post('sessions', { email, password })

            if (data.user && data.token && data.refresh_token) {
                await storageUserAndTokenSave(data.user, data.token, data.refresh_token)
                UserAndTokenUpdate(data.user, data.token)
            }
        } catch (error) {
            throw error
        }
    }

    const logout = async () => {
        try {
            setUser({} as UserDTO)
            await storageUserRemove()
            await storageAuthTokenRemove()
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        const subscribe = api.registerInterceptorTokenMenager(logout)

        return () => {
            subscribe()
        }
    }, [logout])


    return (
        <AuthContext.Provider value={{ user, singIn, loadingUser, logout, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    )
}