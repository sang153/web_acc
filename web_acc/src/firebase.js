
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyCcsUz0cAen2-B8_bkz8wKQYk7NwF7NI4k", 
  authDomain: "web-acc-7b3fa.firebaseapp.com",
  projectId: "web-acc-7b3fa",
  storageBucket: "web-acc-7b3fa.appspot.com",
  messagingSenderId: "4987318552",
  appId: "1:4987318552:web:a5b5ae7b57cf8fc341ee6d",
  measurementId: "G-8H6W2L7KV9"
};
// ------------------------------------------------------------------------------------


const app = initializeApp(firebaseConfig);


const auth = getAuth(app); 


export { auth }; 