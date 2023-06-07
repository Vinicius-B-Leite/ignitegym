import React from 'react';
import { HStack, Heading, Icon, Image, Text, VStack } from 'native-base';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Entypo } from '@expo/vector-icons'
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { api } from '@services/api/api';


type Props = TouchableOpacityProps & {
    exercise: ExerciseDTO
}
const ExerciseCard: React.FC<Props> = ({ exercise, ...rest }) => {
    return (
        <TouchableOpacity {...rest}>
            <HStack bg='gray.500' alignItems='center' p={2} pr={4} rounded='md' mb={3}>
                <Image
                    source={{ uri: `${api.defaults.baseURL}exercise/thumb/${exercise.thumb}` }}
                    alt='exercise image'
                    resizeMode='cover'
                    w={16}
                    h={16}
                    rounded='md'
                    mr={4}
                />

                <VStack flex={1}>
                    <Heading fontSize='lg' color='white'> {exercise.name}</Heading>
                    <Text numberOfLines={1} fontSize='sm' color='gray.200' mt={1}>{exercise.series} séries x {exercise.repetitions} repetições</Text>
                </VStack>

                <Icon
                    as={Entypo}
                    name='chevron-thin-right'
                    color='gray.300'
                />

            </HStack>
        </TouchableOpacity>
    )
}

export default ExerciseCard;