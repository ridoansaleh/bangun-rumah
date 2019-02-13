# Golek

Golek adalah aplikasi marketplace sebagai sarana jual beli bahan bangunan.
Aplikasi ini dibangun menggunakan framework React Native sehingga dapat
dijalankan pada device dengan OS Android maupun iOS.

## Penting

File konfigurasi firebase tidak diupload karena alasan keamanan. Anda bisa
membuat sendiri di website Firebase. Berikut ini source code konfigurasinya.

`./firebase.config.js`

```
import firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';
import '@firebase/storage';

const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.firestore();
const st = firebase.storage().ref();
const fbs = firebase.storage;

export { auth, db, st, fbs };
```
