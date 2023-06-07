import { HistoryDTO } from '@dtos/HistoryDTO';
import { HStack, Heading, Text, VStack } from 'native-base';
import React from 'react';
import { View } from 'react-native';



type Props = {
    historyData: HistoryDTO
}
const HistoryCard: React.FC<Props> = ({ historyData }) => {
    return (
        <HStack w='full' px={5} py={4} mb={3} bg='gray.600' rounded='md' alignItems='center' justifyContent='space-between'>
            <VStack mr={5} flex={1}>
                <Heading color='white' fontSize='md' textTransform='capitalize' >{historyData.group}</Heading>
                <Text color='gray.100' fontSize='lg' numberOfLines={1}>{historyData.name}    </Text>
            </VStack>

            <Text color='gray.300' fontSize='md'>{historyData.hour}</Text>
        </HStack>
    )
}

export default HistoryCard;