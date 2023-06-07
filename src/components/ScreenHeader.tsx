import { Center, Heading } from 'native-base';
import React from 'react';
import { View } from 'react-native';


type Props = {
    title: string
}
const ScreenHeader: React.FC<Props> = ({ title }) => {
    return (
        <Center bg='gray.600' pb={6} pt={16}>
            <Heading color='gray.100' fontSize='xl'>{title}</Heading>
        </Center>
    )
}

export default ScreenHeader;