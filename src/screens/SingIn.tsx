import { Center, Heading, Image, ScrollView, Text, VStack, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react';
import BgImage from '@assets/background.png'
import LogoSVG from '@assets/logo.svg'
import Input from '@components/Input';
import Button from '@components/Button';
import { AuthNavitorRoutesProps } from '@routes/auth.routes';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';


type FormType = {
    email: string,
    password: string
}

const SingIn: React.FC = () => {
    const navigation = useNavigation<AuthNavitorRoutesProps>()
    const { singIn } = useAuth()
    const toast = useToast()
    const { control, formState: { errors }, handleSubmit } = useForm<FormType>()

    const [isLoading, setIsLoading] = useState(false)

    const handleSingIn = async ({ email, password }: FormType) => {
        try {
            setIsLoading(true)
            await singIn(email, password)

        } catch (error) {
            const isAppError = error instanceof AppError

            toast.show({
                title: isAppError ? error.message : 'Não foi possível fazer login. Tenta novamente mais tarde',
                bgColor: 'red.500',
                placement: 'top'
            })
            setIsLoading(false)
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
                    <Heading color='gray.100' fontSize='xl' mb={6} fontFamily='heading'>Acesse sua conta</Heading>

                    <Controller
                        name='email'
                        control={control}
                        rules={{
                            required: 'Informe o email'
                        }}
                        render={({ field: { value, onChange } }) => (
                            <Input
                                placeholder='Email'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                value={value}
                                errorMessage={errors.email?.message}
                                onChangeText={onChange}
                            />

                        )}
                    />
                    <Controller
                        name='password'
                        control={control}
                        rules={{
                            required: 'Informe a senha'
                        }}
                        render={({ field: { value, onChange } }) => (
                            <Input
                                placeholder='Senha'
                                secureTextEntry
                                value={value}
                                errorMessage={errors.email?.message}
                                onChangeText={onChange}
                            />

                        )}
                    />

                    <Button title='Entrar' onPress={handleSubmit(handleSingIn)} isLoading={isLoading} />
                </Center>

                <Center mt={24}>
                    <Text color='gray.100' fontSize='sm' mb={3} fontFamily='body'>Ainda não tem acesso?</Text>
                    <Button onPress={() => navigation.navigate('SingUp')} title='Criar conta' variant='outline' />
                </Center>
            </VStack>
        </ScrollView>
    )
}

export default SingIn;