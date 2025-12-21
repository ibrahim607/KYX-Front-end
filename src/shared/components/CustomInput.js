import { StyleSheet, TextInput } from 'react-native';

const CustomInput = (props) => {
    return (
        <TextInput style={styles.input} {...props} />
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
});

export default CustomInput;
