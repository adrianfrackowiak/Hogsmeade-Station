import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import config from '../config/config';

const Firebase = firebase.initializeApp(config.firebase);

export const auth = firebase.auth();
export const db = firebase.database();

export default Firebase;
