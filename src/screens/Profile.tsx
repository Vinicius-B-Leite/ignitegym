import Button from '@components/Button';
import Input from '@components/Input';
import ScreenHeader from '@components/ScreenHeader';
import UserPhoto from '@components/UserPhoto';
import { Skeleton, Center, ScrollView, Text, VStack, Heading, useToast } from 'native-base';
import React, { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import { Controller, useForm } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '@services/api/api';
import { AppError } from '@utils/AppError';
import DefaultAvatarImg from '@assets/userPhotoDefault.png'


const photoSize = 33

type HookFormType = {
    name: string
    email: string
    password: string
    oldPassword: string
    confirmPassword: string
}


const profileFormSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    password: yup.string().min(6, 'A senha deve ter no minímo 6 dígitos').nullable().transform((val) => !!val ? val : null),
    confirmPassword:
        yup.string().nullable().transform((val) => !!val ? val : null).oneOf([yup.ref('password')], 'Senhas diferentes')
            .when('password', {
                is: (field: any) => field,
                then: (schema) => schema.nullable().required('Informe a confirmaçã da senha').transform((val) => !!val ? val : null)
            })
})

const Profile: React.FC = () => {
    const [isPhotoLoading, setIsPhotoLoading] = useState(false)
    const [isUserDataUpdating, setIsUserDataUpdating] = useState(false)
    const toast = useToast()
    const { user, updateUserProfile } = useAuth()
    const [userPhoto, setUserPhoto] = useState(user.avatar)
    const { control, formState: { errors }, handleSubmit } = useForm<HookFormType>({
        defaultValues: {
            email: user.email,
            name: user.name
        },
        resolver: yupResolver(profileFormSchema)
    })


    const handlePickImage = async () => {
        setIsPhotoLoading(true)
        try {
            const { canceled, assets } = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            })

            if (canceled) return

            const photoSelectedURI = assets[0].uri
            const fileInfo = await FileSystem.getInfoAsync(photoSelectedURI)

            if (fileInfo.exists && (fileInfo.size / 1024 / 1024) > 5) {
                toast.show({
                    title: 'Esta imagem é muito grande. Escolha um menor que 5mb',
                    placement: 'top',
                    bgColor: 'red.500'
                })
                return
            }

            const fileExtension = photoSelectedURI.split('.').pop()

            const photoFile = {
                name: (`${user.name}.${fileExtension}`).toLocaleLowerCase(),
                uri: photoSelectedURI,
                type: `image/${fileExtension}`
            } as any

            const multiPartFormData = new FormData()
            multiPartFormData.append('avatar', photoFile)

            const { data: userServerUpdateResponse } = await api.patch(
                'users/avatar',
                multiPartFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

            const userAvatarUpdated = user
            userAvatarUpdated.avatar = userServerUpdateResponse.avatar

            await updateUserProfile(userAvatarUpdated)

            toast.show({
                title: 'Foto atualizada com sucesso!',
                bgColor: 'green.500',
                placement: 'top'
            })

        } catch (error) {
            const isAppError = error instanceof AppError
            toast.show({
                title: isAppError ? error.message : 'Não foi possível atualizar a foto. Volte mais tarde',
                bgColor: 'red.500',
                placement: 'top'
            })
        } finally {
            setIsPhotoLoading(false)
        }
    }

    const handleProfileUpdate = async (userDataForm: HookFormType) => {
        try {
            setIsUserDataUpdating(true)

            let userUpdated = user
            userUpdated.name = userDataForm.name

            await api.put('users', userDataForm)
            await updateUserProfile(userUpdated)


            toast.show({
                title: 'Seu perfil foi atualizado com sucesso',
                bgColor: 'green.500',
                placement: 'top'
            })

        } catch (error) {
            const isAppError = error instanceof AppError
            toast.show({
                title: isAppError ? error.message : 'Não foi possível atualizar o perfil. Volte mais tarde',
                bgColor: 'red.500',
                placement: 'top'
            })
        } finally {
            setIsUserDataUpdating(false)
        }
    }


    return (
        <VStack flex={1}>
            <ScreenHeader title='Perfil' />
            <ScrollView>
                <Center mt={6} px={10}>
                    {
                        isPhotoLoading ?
                            <Skeleton w={photoSize} h={photoSize} rounded='full' startColor='gray.400' endColor='gray.700' />
                            :
                            <UserPhoto source={user.avatar ? { uri: api.defaults.baseURL + 'avatar/' + user.avatar } : DefaultAvatarImg} size={photoSize} alt='userphoto' />
                    }

                    <TouchableOpacity onPress={handlePickImage}>
                        <Text color='green.500' fontSize='md' fontWeight='bold' mt={2} mb={8}>Alterar foto</Text>
                    </TouchableOpacity>

                    <Controller
                        name='name'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Nome'
                                bg='gray.600'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}

                    />
                    <Controller
                        name='email'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Email'
                                bg='gray.600'
                                isDisabled
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />
                        )}

                    />


                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading color='gray.200' fontSize='md' mb={2} >Alterar senha</Heading>

                    <Controller
                        name='oldPassword'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Senha antiga'
                                bg='gray.600'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.oldPassword?.message}
                            />
                        )}

                    />


                    <Controller
                        name='password'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Nova senha'
                                bg='gray.600'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}

                    />

                    <Controller
                        name='confirmPassword'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Confirme a nova senha'
                                bg='gray.600'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.confirmPassword?.message}
                            />
                        )}

                    />
                    <Button isLoading={isUserDataUpdating} onPress={handleSubmit(handleProfileUpdate)} title='Atualizar' mt={4} />
                </VStack>
            </ScrollView>
        </VStack>
    )
}

export default Profile;