import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'index.css' // Generated by tailwind
import * as firebase from 'firebase'

var firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: 'social-network-7adcb.firebaseapp.com',
  databaseURL: 'https://social-network-7adcb.firebaseio.com',
  projectId: 'social-network-7adcb',
  storageBucket: 'social-network-7adcb.appspot.com',
  messagingSenderId: '215438990254',
  appId: '1:215438990254:web:fad6c80064f508f8aac63f',
  measurementId: 'G-PGZ9DXTY0K',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
