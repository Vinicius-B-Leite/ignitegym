import { Pressable, Text, IPressableProps, Center } from 'native-base';
import React from 'react';
import { View } from 'react-native';

type Props = IPressableProps & {
    name: string,
    isActive: boolean
}
const Group: React.FC<Props> = ({ name, isActive, ...rest }) => {
    return (
        <Pressable
            mr={3}
            w={24}
            h={10}
            bg='gray.600'
            rounded='sm'
            overflow='hidden'
            isPressed={isActive}
            _pressed={{
                borderColor: 'green.500',
                borderWidth: 1
            }}
            {...rest}>
            <Center flex={1}>
                <Text
                    color={isActive ? 'green.500' : 'gray.200'}
                    textTransform='uppercase'
                    fontSize='xs'
                    fontWeight='bold'
                >
                    {name}
                </Text>
            </Center>
        </Pressable>
    )
}

export default Group;