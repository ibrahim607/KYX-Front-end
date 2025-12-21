import { StyleSheet, Text, View } from 'react-native';

const BookingScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Booking Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BookingScreen;
