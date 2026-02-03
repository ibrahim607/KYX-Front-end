import { Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../../assets/theme/colors';

const FormInput = ({
    control,
    name,
    label,
    placeholder,
    rules = {},
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    error,
}) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[styles.input, error && styles.inputError]}
                        placeholder={placeholder}
                        placeholderTextColor={colors.lightGrey}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={secureTextEntry}
                        keyboardType={keyboardType}
                        autoCapitalize={autoCapitalize}
                        autoCorrect={false}
                    />
                )}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 8,
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.black,
        backgroundColor: colors.white,
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        fontSize: 12,
        color: '#FF3B30',
        marginTop: 4,
        marginLeft: 4,
    },
});

export default FormInput;
