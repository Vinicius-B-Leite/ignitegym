import { HStack, Heading, Icon, Image, Text, VStack } from 'native-base';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import UserPhoto from './UserPhoto';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import DefaultAvatarImg from '@assets/userPhotoDefault.png'
import { api } from '@services/api/api';


const HomeHeader: React.FC = () => {

    const { user: { avatar, name }, logout } = useAuth()
    return (
        <HStack bg='gray.600' pt={16} pb={5} px={8} alignItems='center'>

            <UserPhoto size={16} source={avatar ? { uri: api.defaults.baseURL + 'avatar/' + avatar } : DefaultAvatarImg} alt='user photo' mr={4} />

            <VStack flex={1}>
                <Text color='gray.100' fontSize='md'>Olá, </Text>
                <Heading color='gray.100' fontSize='md'>{name}</Heading>
            </VStack>

            <TouchableOpacity onPress={logout}>
                <Icon
                    as={MaterialIcons}
                    name='logout'
                    color='gray.200'
                    size={7}
                />
            </TouchableOpacity>
        </HStack>
    )
}

export default HomeHeader;