import HistoryCard from '@components/HistoryCard';
import HistoryHeader from '@components/ScreenHeader';
import { HistoryGroupByDayDTO } from '@dtos/HistoryGroupByDayDTO';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '@services/api/api';
import { AppError } from '@utils/AppError';
import { SectionList, Heading, Text, VStack, useToast } from 'native-base';
import React, { useCallback, useState } from 'react';

// import { Container } from './styles';

const History: React.FC = () => {

    const [exercises, setExercises] = useState<HistoryGroupByDayDTO[]>([])
    const [isHistoryLoading, setIsHistoryLoading] = useState(true)

    const toast = useToast()

    const getHistory = async () => {
        try {
            setIsHistoryLoading(true)
            const { data } = await api.get('history')
            setExercises(data)

        } catch (error) {
            const isAppError = error instanceof AppError
            toast.show({
                title: isAppError ? error.message : 'Não foi possível carregar o histórico. Volte mais tarde',
                bgColor: 'red.500',
                placement: 'top'
            })
        } finally {
            setIsHistoryLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        getHistory()
    }, []))
    return (
        <VStack flex={1}>
            <HistoryHeader title='Histórico' />

            <SectionList
                sections={exercises}
                ListEmptyComponent={() => <Text color='gray.100' textAlign='center'>Não há exercícios registrados. {'\n'} Vamos treinar hoje!</Text>}
                contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
                renderItem={({ item }) => <HistoryCard historyData={item} />}
                renderSectionHeader={({ section }) => <Heading color='gray.100' fontSize='md' mt={10} mb={6}>{section.title}</Heading>}
                px={8}
            />
        </VStack>
    )
}

export default History;