import { useState } from 'react';

/**
 * useCustomAlert Hook
 * Provides a simple API to show custom alerts
 * 
 * Usage:
 * const { showAlert, AlertComponent } = useCustomAlert();
 * 
 * showAlert({
 *   title: 'Success',
 *   message: 'Booking confirmed!',
 *   buttons: [
 *     { text: 'Cancel', style: 'cancel' },
 *     { text: 'OK', onPress: () => console.log('OK'), style: 'default' }
 *   ]
 * });
 * 
 * return (
 *   <View>
 *     {AlertComponent}
 *   </View>
 * );
 */
const useCustomAlert = () => {
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        buttons: [],
    });

    const showAlert = ({ title, message, buttons = [{ text: 'OK' }] }) => {
        setAlertConfig({
            visible: true,
            title,
            message,
            buttons,
        });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    return {
        showAlert,
        hideAlert,
        alertConfig,
        isVisible: alertConfig.visible,
    };
};

export default useCustomAlert;
