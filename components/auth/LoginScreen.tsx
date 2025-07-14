import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../services/firebase';
import { User } from '../../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const sendOtp = async () => {
    const fullPhone = `+91${phone.trim()}`;
    if (!/^\+91\d{10}$/.test(fullPhone)) {
      Alert.alert('Invalid number', 'Enter a valid 10-digit phone number.');
      return;
    }

    try {
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(fullPhone, recaptchaVerifier.current!);
      setVerificationId(id);
      Alert.alert('OTP Sent', 'Please check your SMS.');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error sending OTP', error.message);
    }
  };

  const confirmOtp = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);

      const user: User = {
        id: phone,
        name: `User ${phone.slice(-4)}`,
        mobile: phone,
      };

      await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
      onLogin(user);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Invalid OTP', error.message || 'OTP verification failed');
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={{
          apiKey: "AIzaSyC1GsHrGntlfXGUszDQXwuXnrhcNSnIDjI",
          authDomain: "zypool.firebaseapp.com",
          projectId: "zypool",
          storageBucket: "zypool.appspot.com",
          messagingSenderId: "73904126687",
          appId: "1:73904126687:web:3da3a1da410f9413b8c76a",
        }}
      />
      <Text style={styles.title}>Login with Phone</Text>
      <TextInput
        placeholder="Phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        maxLength={10}
      />
      <Button title="Send OTP" onPress={sendOtp} disabled={!phone} />

      {verificationId && (
        <>
          <TextInput
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
          />
          <Button title="Confirm OTP" onPress={confirmOtp} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 100,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginVertical: 10,
    borderRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default LoginScreen;
