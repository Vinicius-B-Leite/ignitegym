import ExerciseCard from '@components/ExerciseCard';
import Group from '@components/Group';
import HomeHeader from '@components/HomeHeader';
import { Box, Center, FlatList, HStack, Heading, Text, VStack, useToast } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavitorRoutesProp } from '@routes/app.routes';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { api } from '@services/api/api';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import Loading from '@components/Loading';

// import { Container } from './styles';

const Home: React.FC = () => {

    const [groupSelected, setGroupSelected] = useState('Biceps')
    const [groups, setGroups] = useState<string[]>([])
    const [exercises, setExercises] = useState<ExerciseDTO[]>([])
    const navigation = useNavigation<AppNavitorRoutesProp>()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const handleOpenExerciseDetails = (exerciseID: string) => {
        navigation.navigate('Exercise', { exerciseID })
    }


    const getGroups = async () => {
        try {
            const { data } = await api.get('groups')
            setGroups(data)
            setGroupSelected(data[0])
        } catch (error) {
            const isAppError = error instanceof AppError
            toast.show({
                title: isAppError ? error.message : 'Não foi possível carregar os grupos musuclares. Volte mais tarde',
                bgColor: 'red.500',
                placement: 'top'
            })

        }
    }

    const getExercisesByGroup = async () => {
        try {
            setIsLoading(true)
            const { data } = await api.get(`exercises/bygroup/${groupSelected}`)
            setExercises(data)
        } catch (error) {
            const isAppError = error instanceof AppError
            toast.show({
                title: isAppError ? error.message : 'Não foi possível carregar os exercícios. Volte mais tarde',
                bgColor: 'red.500',
                placement: 'top'
            })
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        getExercisesByGroup()
    }, [groupSelected]))


    useEffect(() => {
        getGroups()
    }, [])

    return (
        <VStack flex={1}>
            <HomeHeader />

            <HStack>
                <FlatList
                    data={groups}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    _contentContainerStyle={{ px: 8 }}
                    my={10}
                    maxH={10}
                    renderItem={({ item: group }) =>
                        <Group
                            name={group}
                            isActive={groupSelected.toLocaleLowerCase() === group.toLocaleLowerCase()}
                            onPress={() => setGroupSelected(group)}
                        />}
                />


            </HStack>

            {
                isLoading ?
                    <Loading />
                    :
                    <VStack flex={1} px={8}>
                        <HStack justifyContent='space-between' mb={5}>
                            <Heading color='gray.200' fontSize='md'>Exercícios</Heading>

                            <Text color='gray.200' fontSize='sm'> {exercises.length} </Text>
                        </HStack>

                        <FlatList
                            data={exercises}
                            renderItem={({ item }) => <ExerciseCard exercise={item} onPress={() => handleOpenExerciseDetails(item.id)} />}
                            showsVerticalScrollIndicator={false}
                            _contentContainerStyle={{ pb: 20 }}
                        />
                    </VStack>
            }

        </VStack>
    )
}

export default Home;