import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  /**
   * IMPORTANT: When running on a real Android device, 
   * replace 'localhost' with your computer's local IP address (e.g. 192.168.1.10)
   */
  // Replace '192.168.1.XX' with the actual IP address from the command above
  const devServerUrl = 'http://192.168.1.XX:5173'; 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView source={{ uri: devServerUrl }} style={{ flex: 1 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});