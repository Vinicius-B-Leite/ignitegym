import { Box, HStack, Heading, Icon, Image, ScrollView, Text, VStack, useToast } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import BodySVG from '@assets/body.svg'
import SeriesSVG from '@assets/series.svg'
import RepetitionsSVG from '@assets/repetitions.svg'
import Button from '@components/Button';
import { AppError } from '@utils/AppError';
import { api } from '@services/api/api';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import Loading from '@components/Loading';
import { AppNavitorRoutesProp } from '@routes/app.routes';


type RouteParamsProps = {
    exerciseID: string
}

const Exercise: React.FC = () => {

    const navigation = useNavigation<AppNavitorRoutesProp>()
    const { exerciseID } = useRoute().params as RouteParamsProps
    const toast = useToast()

    const [exerciseDetails, setExerciseDetails] = useState({} as ExerciseDTO)
    const [isLoadingExerciseDetails, setIsLoadingExerciseDetails] = useState(true)
    const [isLoadingRegisterExercise, setIsLoadingRegisterExercise] = useState(false)


    const getExerciseDetails = async () => {
        try {
            setIsLoadingExerciseDetails(true)
            const { data } = await api.get(`exercises/${exerciseID}`)
            setExerciseDetails(data)
        } catch (error) {
            const isAppError = error instanceof AppError
            toast.show({
                title: isAppError ? error.message : 'Não foi possível carregar os detalher do exercício. Volte mais tarde',
                bgColor: 'red.500',
                placement: 'top'
            })
        } finally {
            setIsLoadingExerciseDetails(false)
        }
    }

    const registerExerciseInHistory = async () => {
        try {
            setIsLoadingRegisterExercise(true)
            const { data } = await api.post(`history`, { exercise_id: exerciseID })

            toast.show({
                title: 'Parabéns! Exercício foi registrado no seu histórico',
                bgColor: 'green.500',
                placement: 'top'
            })
            navigation.navigate('History')


        } catch (error) {
            const isAppError = error instanceof AppError
            toast.show({
                title: isAppError ? error.message : 'Não foi possível carregar os detalher do exercício. Volte mais tarde',
                bgColor: 'red.500',
                placement: 'top'
            })
        } finally {
            setIsLoadingRegisterExercise(false)
        }
    }

    useEffect(() => {
        getExerciseDetails()
    }, [exerciseID])
    return (
        <VStack flex={1}>

            <VStack px={8} bg='gray.600' pt={12}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon
                        as={Feather}
                        name='arrow-left'
                        color='green.500'
                        size={6}
                    />
                </TouchableOpacity>


                <HStack justifyContent='space-between' mt={4} mb={8} alignItems='center'>
                    <Heading flexShrink={1} color='gray.100' fontSize='lg'>{exerciseDetails?.name}</Heading>

                    <HStack alignItems='center'>
                        <BodySVG />

                        <Text color='gray.200' ml={1} textTransform='capitalize'>{exerciseDetails?.group}</Text>
                    </HStack>
                </HStack>
            </VStack>
            {
                isLoadingExerciseDetails ?
                    <Loading /> :
                    <ScrollView>
                        <VStack p={8}>
                            <Image
                                w='full'
                                h={80}
                                source={{ uri: `${api.defaults.baseURL}exercise/demo/${exerciseDetails.demo}` }}
                                alt='exercise photo'
                                mb={33}
                                resizeMode='cover'
                                rounded='lg'
                                overflow='hidden'
                            />

                            <Box bg='gray.600' rounded='md' pb={4} px={4}>
                                <HStack alignItems='center' justifyContent='space-around' mb={6} mt={5}>
                                    <HStack>
                                        <SeriesSVG />
                                        <Text color='gray.300' ml={2}>{exerciseDetails.series} séries</Text>
                                    </HStack>

                                    <HStack>
                                        <RepetitionsSVG />
                                        <Text color='gray.300' ml={2}>{exerciseDetails.repetitions} repetições</Text>
                                    </HStack>
                                </HStack>

                                <Button onPress={registerExerciseInHistory} title='Marcar como realizado' isLoading={isLoadingRegisterExercise} />
                            </Box>
                        </VStack>
                    </ScrollView>
            }

        </VStack>
    )
}

export default Exercise;