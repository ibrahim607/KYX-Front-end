import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const CustomButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    text: {
        color: 'white',
        textAlign: 'center',
    },
});

export default CustomButton;
