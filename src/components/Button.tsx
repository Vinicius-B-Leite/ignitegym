import React from 'react';
import { Button as NBButton, IButtonProps, Text } from 'native-base'



type Props = IButtonProps & {
    title: string,
    variant?: 'solid' | 'outline'
}
const Button: React.FC<Props> = ({ title, variant = 'solid', ...res }) => {
    const isOutline = variant === 'outline'
    return (
        <NBButton
            w='full' h={14} bg={isOutline ? 'transparent' : 'green.700'} rounded='sm'
            borderWidth={isOutline ? 1 : 0}
            borderColor='green.500'
            _pressed={{
                bg: isOutline ? 'gray.500' : 'green.500'
            }}
            {...res}>
            <Text color={isOutline ? 'green.500' : 'white'} fontFamily='heading' fontSize='sm'>{title}</Text>
        </NBButton >
    )
}

export default Button;