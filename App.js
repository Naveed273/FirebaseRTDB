import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

export default function App() {
  const [isLoading, setisLoading] = useState(false);
  const firebaseConfig = {
    apiKey: 'AIzaSyBEkzoKX22XMwOEwkve84-bONnvrnoJlaU',
    authDomain: 'bugsnag-testing.firebaseapp.com',
    databaseURL:
      'https://bugsnag-testing-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'bugsnag-testing',
    storageBucket: 'bugsnag-testing.appspot.com',
    messagingSenderId: '347729835498',
    appId: '1:347729835498:web:ff0a47c95115ddac5cae93',
  };
  initializeApp(firebaseConfig);
  const storeHighScore = async (userId, score) => {
    setisLoading(true);
    try {
      const db = getDatabase();
      const reference = ref(db, 'users/' + userId);
      await set(reference, {
        highscore: score,
      });
      setisLoading(false);
      Alert.alert('Congratulations', 'data successfull inserted');
    } catch (e) {
      setisLoading(false);
      Alert.alert('Sorry', e);
    }
  };
  const setupHighscoreListener = (userId) => {
    try {
      const db = getDatabase();
      const reference = ref(db, 'users/' + userId);
      onValue(reference, (snapshot) => {
        const highscore = snapshot.val().highscore;

        Alert.alert(userId, `New high score of ${userId} is ${highscore}`);
      });
    } catch (e) {
      Alert.alert('Sorry', e);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.buttonView}>
        {isLoading && <ActivityIndicator size="large" />}
        <Button
          onPress={() => storeHighScore('naveedInfosun', 600)}
          title="Add data to RTDB"
          color={'#007AFF'}
        />
      </View>
      <View style={styles.buttonView}>
        <Button
          onPress={() => setupHighscoreListener('naveedInfosun')}
          title="Check user high score"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    marginVertical: 10,
    width: '70%',
  },
});
