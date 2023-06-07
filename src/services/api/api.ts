import axios, { AxiosError, AxiosInstance } from "axios";
import { baseurl } from "./baseurl";
import { AppError } from "@utils/AppError";
import { storageAuthTokenGet, storageAuthTokenSave } from "@storage/storageAuthToken";


type LogoutFunctionType = () => void
type FailedQeueType = {
    onSucess: (token: string) => void
    onError: (error: AxiosError) => void
}
type APIInterceptorProps = AxiosInstance & {
    registerInterceptorTokenMenager: (logout: LogoutFunctionType) => () => void
}




const api = axios.create({
    baseURL: baseurl
}) as APIInterceptorProps

let failedQeue: FailedQeueType[] = []
let isFetchingNewToken = false

api.registerInterceptorTokenMenager = logout => {
    const interceptorTokenMenager = api.interceptors.response.use((config) => config, async (requestError) => {

        //caso o erro seja relacionado com a expiração do token ou com a invalidação do token mandado pelo user
        if (requestError?.response?.status == 401) {
            if (requestError.response.data.message === 'token.expired' || requestError.response.data.message === 'token.invalid') {
                const { refresh_token } = await storageAuthTokenGet() //busca o refresh-token pego quando o usuário fez o login

                //caso não tenha o refresh-tokne no dispositivo, mande o usuário para efetuar o login
                if (!refresh_token) {
                    logout()
                    return Promise.reject(requestError)
                }
                console.log('cu');

                const originalRequesConfig = requestError.config //pega todas as configurações da requisição que chamou este método

                //caso esteja buscando um novo token, adicione esta requisição à fila
                if (isFetchingNewToken) {
                    return new Promise((resolve, reject) => {
                        failedQeue.push({
                            onError: (err) => {
                                reject(err) //rejeita a requisição
                            },
                            onSucess: (token) => {
                                originalRequesConfig.headers = { 'Authorization': 'Bearer ' + token } //adiciona o novo token no headers
                                resolve(api(originalRequesConfig)) //efetua a requisição novamente
                            }
                        })
                    })
                }


                isFetchingNewToken = true

                return new Promise(async (resolve, reject) => {
                    try {
                        const { data } = await api.post('sessions/refresh-token', { refresh_token }) //busca o novo token na api

                        await storageAuthTokenSave(data.token, data.refresh_token) //salva o novo token no storage

                        //Caso tenha algo dentro de originalRequesConfig (requisição que chamou este método), converta os dados para JSON
                        if (originalRequesConfig.data) {
                            originalRequesConfig.data = JSON.parse(originalRequesConfig.data)
                        }

                        //configura a requisição atual e a instancia da api
                        originalRequesConfig.header = { 'Authorization': 'Bearer ' + data.token }
                        api.defaults.headers.common['Authorization'] = 'Bearer ' + data.token


                        //percorre a fila de requisições e à execute
                        failedQeue.forEach(req => {
                            req.onSucess(data.token)
                        })


                        //execute a requisição que chamou o método
                        resolve(api(originalRequesConfig))

                    } catch (error: any) {
                        //em caso de erro, deslogue o usuário
                        failedQeue.forEach(request => {
                            request.onError(error)
                        })

                        logout()

                        reject(error)

                    } finally {
                        isFetchingNewToken = false
                        failedQeue = []
                    }
                })
            }
            logout()
        }


        if (requestError.response && requestError.response.data) {
            return Promise.reject(new AppError(requestError.response.data.message))
        } else {
            return Promise.reject(requestError)
        }
    })

    return () => {
        api.interceptors.response.eject(interceptorTokenMenager)
    }
}



export { api }