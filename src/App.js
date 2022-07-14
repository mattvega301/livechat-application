
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDPL6CyldXtHk4EcKzNIF1z0C_Z9KzJEdM",
  authDomain: "livechat-application-cfa7b.firebaseapp.com",
  projectId: "livechat-application-cfa7b",
  storageBucket: "livechat-application-cfa7b.appspot.com",
  messagingSenderId: "772623492297",
  appId: "1:772623492297:web:8b768fb0f97fe8cb3c9918",
  measurementId: "G-R3295XSW4Z"
})
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App container">

      <section className='row'>
        <h1 className='display-2'>LiveChat</h1>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-4'></div>
        <button className='btn btn-dark col-4' onClick={signInWithGoogle}> Sign in with Google</button>
        <div className='col-4'></div>
      </div>
    </div>
  )
}
function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()} className='btn btn-dark col-2 my-4'>Sign Out</button>

  )
}
function ChatRoom() {
  const messagesReference = firestore.collection('messages');
  const query = messagesReference.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');
  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesReference.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit" className='btn btn-dark mx-2'>Send Message</button>
      </form>
      <div className='col-5'></div>
      <SignOut />
      <div className='col-5'></div>
    </>
  )
  function ChatMessage(prop) {
    const { text, uid, photoURL } = prop.message;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    if (messageClass === 'received') {
      return (
        <div className='container'>
          <div className='row'>
            <div className="col-3"></div>
            <div className='col-5'>
              <div className='message-recieved'>
                <img src={photoURL} alt="" />
                <p>{text}</p>
              </div>
            </div>
            <div className="col-6"></div>
          </div>
        </div>
      );

    } else {
      return (
        <div className='container'>
          <div className='row'>
            <div className="col-7"></div>
            <div className='col-4'>
            <div className='message-sent'>
                <p>{text}</p>
                <img src={photoURL} alt="" />
              </div>
            </div>
            <div className="col-2"></div>

          </div>
        </div>
      );
    }
  }
}

export default App;
