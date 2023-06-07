import { Image, IImageProps } from 'native-base';
import React from 'react';
import { View } from 'react-native';

type Props = IImageProps & {
    size: number
}
const UserPhoto: React.FC<Props> = ({ size, ...rest }) => {
    return (
        <Image
            w={size}
            h={size}
            rounded='full'
            borderWidth={2}
            borderColor='gray.400'
            {...rest}
        />
    )
}

export default UserPhoto;