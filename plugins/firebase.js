import firebase from "firebase";
if(!firebase.apps.length){
    firebase.initializeApp({
        apiKey: "AIzaSyBEC03EeQl8OsTU0jBK21pkeIcSwp0fnRI",
        authDomain: "nuxt-to-do-38270.firebaseapp.com",
        projectId: "nuxt-to-do-38270",
        storageBucket: "nuxt-to-do-38270.appspot.com",
        messagingSenderId: "105155808920",
        appId: "1:105155808920:web:0ad721856841da29f2caed"
})
}

export default firebase;