import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Dimensions, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../assets/theme/colors';

const { width, height } = Dimensions.get('window');

const SearchSection = ({ onSearch, onClear, isSearching }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            handleClear();
            return;
        }

        // Call parent's search handler
        if (onSearch) {
            await onSearch({
                location: searchQuery.trim(),
                // Add other filters as needed
                // date: selectedDate,
                // pitchType: selectedPitchType,
            });
        }
    };

    const handleClear = () => {
        setSearchQuery('');
        if (onClear) {
            onClear();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={colors.darkGrey} style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search Courts..."
                    placeholderTextColor={colors.darkGrey}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    editable={!isSearching}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color={colors.darkGrey} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.015,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 100,
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.01,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    searchIcon: {
        marginRight: width * 0.02,
    },
    input: {
        flex: 1,
        fontSize: width * 0.04,
        color: colors.black,
        paddingVertical: 0,
    },
    clearButton: {
        padding: 4,
    },
});

export default SearchSection;
