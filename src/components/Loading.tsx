import { Center, Spinner } from 'native-base';
import React from 'react';
import { View } from 'react-native';

// import { Container } from './styles';

const Loading: React.FC = () => {
    return (
        <Center flex={1} >
            <Spinner color='green.500' size={32} />
        </Center>
    )
}

export default Loading;