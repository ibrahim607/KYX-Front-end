import { Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../assets/theme/colors';

/**
 * CustomInput - Shared input component with React Hook Form support
 * 
 * @param {object} control - React Hook Form control object
 * @param {string} name - Field name for React Hook Form
 * @param {object} rules - Validation rules
 * @param {string} placeholder - Placeholder text
 * @param {object} style - Additional input styles
 * @param {string} label - Optional label text
 * @param {string} error - Error message to display
 * @param {string} defaultValue - Default value for the input
 * @param {object} props - Other TextInput props (keyboardType, secureTextEntry, etc.)
 */
const CustomInput = ({
    control,
    name,
    rules = {},
    placeholder,
    style,
    label,
    error,
    defaultValue = '',
    ...props
}) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            {control ? (
                <Controller
                    control={control}
                    name={name}
                    rules={rules}
                    defaultValue={defaultValue}
                    render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                        <View>
                            <TextInput
                                style={[
                                    styles.input,
                                    (error || fieldError) && styles.inputError,
                                    style
                                ]}
                                placeholder={placeholder}
                                placeholderTextColor={colors.grey}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                {...props}
                            />
                            {(error || fieldError) && (
                                <Text style={styles.errorText}>
                                    {error || fieldError.message}
                                </Text>
                            )}
                        </View>
                    )}
                />
            ) : (
                // Fallback for non-hook-form usage
                <View>
                    <TextInput
                        style={[
                            styles.input,
                            error && styles.inputError,
                            style
                        ]}
                        placeholder={placeholder}
                        placeholderTextColor={colors.grey}
                        defaultValue={defaultValue}
                        {...props}
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: colors.black,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});

export default CustomInput;
