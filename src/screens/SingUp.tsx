import { Center, Heading, Image, ScrollView, Text, VStack, useToast } from 'native-base';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import BgImage from '@assets/background.png'
import LogoSVG from '@assets/logo.svg'
import Input from '@components/Input';
import Button from '@components/Button';
import { AuthNavitorRoutesProps } from '@routes/auth.routes';
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '@services/api/api'
import axios from 'axios';
import { Alert } from 'react-native';
import { AppError } from '@utils/AppError';
import { useAuth } from '@hooks/useAuth';


type FormType = {
    name: string,
    email: string,
    password: string,
    confirm_password: string
}

const schemaValidation = yup.object({
    name: yup.string().required('Informe o nome'),
    email: yup.string().required('Informe o email').email('Email inválido'),
    password: yup.string().required('Informe a senha').min(6, 'No mínimo 6 caracteres'),
    confirm_password: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], 'A confirmação da senha está errada')
})
const SingUp: React.FC = () => {
    const navigation = useNavigation<AuthNavitorRoutesProps>()
    const { control, handleSubmit, formState: { errors } } = useForm<FormType>({ resolver: yupResolver(schemaValidation) })
    const toast = useToast()
    const { singIn } = useAuth()

    const [isLoadingSingUp, setIsLoadingSingUp] = useState(false)

    const handleSingUp = async ({ email, name, password }: FormType) => {
        try {
            setIsLoadingSingUp(true)
            const { data } = (await api.post('users', { name, email, password }))

            await singIn(email, password)

        } catch (error) {
            const isAppError = error instanceof AppError
            toast.show({
                title: isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde',
                placement: 'top',
                bgColor: 'red.500'
            })
            setIsLoadingSingUp(false)
        }

    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack flex={1} bg='gray.700' px={10} pb={16}>
                <Image defaultSource={BgImage} source={BgImage} alt='background image' resizeMode='contain' position='absolute' />
                <Center my={24}>
                    <LogoSVG />
                    <Text color='gray.100' fontSize='sm'>Treine seu corpo e sua mente</Text>
                </Center>

                <Center>
                    <Heading color='gray.100' fontSize='xl' mb={6} fontFamily='heading'>Crie sua conta</Heading>

                    <Controller
                        control={control}
                        name='name'
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Nome'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name='email'
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Email'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name='password'
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Senha'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name='confirm_password'
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Confirme a senha'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.confirm_password?.message}
                            />
                        )}
                    />

                    <Button onPress={handleSubmit(handleSingUp)} title='Criar e acessar' isLoading={isLoadingSingUp} />
                </Center>

                <Button onPress={() => navigation.goBack()} title='Voltar para o login' mt={20} variant='outline' />
            </VStack>
        </ScrollView>
    )
}

export default SingUp;