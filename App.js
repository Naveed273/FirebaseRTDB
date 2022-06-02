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
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [isLoading, setisLoading] = useState(false);

  const firebaseConfig = {
    apiKey: 'AIzaSyAZtBQ0mVRBpYlEHsFq72SY67hMUfXyIyU',
    authDomain: 'reactnativefirebase-81219.firebaseapp.com',
    databaseURL:
      'https://reactnativefirebase-81219-default-rtdb.firebaseio.com',
    projectId: 'reactnativefirebase-81219',
    storageBucket: 'reactnativefirebase-81219.appspot.com',
    messagingSenderId: '907511338088',
    appId: '1:907511338088:web:09cc29853cf821c9e157dd',
  };
  initializeApp(firebaseConfig);
  const storeHighScore = async (userId, score) => {
    const auth = getAuth();
    setisLoading(true);

    signInAnonymously(auth)
      .then(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid = user.uid;
            const db = getDatabase();
            const reference = ref(db, 'users/' + uid);
            setisLoading(false);
            set(reference, {
              highscore: score,
            })
              .then(() => {
                Alert.alert('Congratulations', 'data successfull inserted');
              })
              .catch((e) => {
                Alert.alert('Failed', e.message);
              });
          } else {
            Alert.alert('Failed');
            setisLoading(false);
          }
        });
      })
      .catch((error) => {
        setisLoading(false);
        Alert.alert(error.code, error.message);
      });
  };
  const setupHighscoreListener = (userId) => {
    const auth = getAuth();
    setisLoading(true);
    signInAnonymously(auth)
      .then(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid = user.uid;
            const db = getDatabase();
            setisLoading(false);
            const reference = ref(db, `users/${uid}`);
            onValue(
              reference,
              (snapshot) => {
                const highscore = snapshot.val().highscore;

                Alert.alert(uid, `New high score of ${uid} is ${highscore}`);
              },
              (e) => Alert.alert('Failed', e.message)
            );
          } else {
            Alert.alert('Failed', 'Faild to fetch data');
            setisLoading(false);
          }
        });
      })
      .catch((error) => {
        setisLoading(false);
        Alert.alert(error.code, error.message);
      });
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
