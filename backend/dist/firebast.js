"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDUPY8gADOXbNMWvSdoarHuDuCzK4JGnE8",
    authDomain: "stock-market-a2641.firebaseapp.com",
    projectId: "stock-market-a2641",
    storageBucket: "stock-market-a2641.appspot.com",
    messagingSenderId: "906283944801",
    appId: "1:906283944801:web:33594f99fb22fe42b35320",
    measurementId: "G-2G3YJH42KL",
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
const auth = (0, auth_1.getAuth)();
const provider = new auth_1.GoogleAuthProvider();
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send((0, auth_1.signInWithPopup)(auth, provider)
        .then((result) => {
        const credential = auth_1.GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
    })
        .catch((error) => {
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = auth_1.GoogleAuthProvider.credentialFromError(error);
        // ...
    }));
});
exports.Login = Login;
