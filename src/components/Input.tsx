import React from 'react';
import { Input as NTInput, IInputProps, FormControl } from 'native-base'


type Props = IInputProps & {
    errorMessage?: string
}
const Input: React.FC<Props> = ({ errorMessage, isInvalid, ...rest }) => {

    const invalid = !!errorMessage || isInvalid

    return (
        <FormControl isInvalid={invalid} mb={4}>
            <NTInput
                bg='gray.700'
                h={14}
                px={4}
                color='white'
                borderWidth={0}
                fontSize='md'
                fontFamily='body'
                isInvalid={invalid}
                _invalid={{
                    borderWidth: 1,
                    borderColor: 'red.500'
                }}
                placeholderTextColor='gray.300'
                _focus={{
                    bg: 'gray.700',
                    borderWidth: 1,
                    borderColor: 'green.500'
                }}

                {...rest}
            />

            <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
        </FormControl>
    )
}

export default Input;