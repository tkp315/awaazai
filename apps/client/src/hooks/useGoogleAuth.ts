import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';
import Constants from 'expo-constants';

const useGoogleAuth = () => {
  console.log(`google client id`, Constants?.expoConfig?.extra?.GOOGLE_CLIENT_ID);
  const googleSignInConfigure = async () => {
    const x = GoogleSignin.configure({
      webClientId: Constants?.expoConfig?.extra?.GOOGLE_CLIENT_ID,
      scopes: ['profile', 'email'],
      offlineAccess: true,
    });
    console.log('step 1', x);
  };
  useEffect(() => {
    googleSignInConfigure();
  }, []);

  const getGoogleIdToken = async () => {
    const step2 = await GoogleSignin.hasPlayServices();
    console.log('Step2', step2);

    const userInfo = await GoogleSignin.signIn();
    console.log('userInfo', userInfo);
    const { data } = userInfo;
    if (data) {
      return data.idToken;
    }
    return null;
  };
  return {
    getGoogleIdToken,
  };
};

export default useGoogleAuth;
