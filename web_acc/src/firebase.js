// src/firebase.js

// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // <<< THÊM DÒNG NÀY
// import { getAnalytics } from "firebase/analytics"; // Bạn có thể giữ hoặc xóa dòng này nếu không dùng Analytics

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// --- Lưu ý: Không nên chia sẻ trực tiếp API Key và các thông tin nhạy cảm này công khai ---
const firebaseConfig = {
  apiKey: "AIzaSyCcsUz0cAen2-B8_bkz8wKQYk7NwF7NI4k", // <<< Khóa API của bạn
  authDomain: "web-acc-7b3fa.firebaseapp.com",
  projectId: "web-acc-7b3fa",
  storageBucket: "web-acc-7b3fa.appspot.com", // <<< Kiểm tra lại giá trị này trên Firebase Console, thường là .appspot.com
  messagingSenderId: "4987318552",
  appId: "1:4987318552:web:a5b5ae7b57cf8fc341ee6d",
  measurementId: "G-8H6W2L7KV9"
};
// ------------------------------------------------------------------------------------

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app); // <<< THÊM DÒNG NÀY ĐỂ TẠO BIẾN AUTH

// Khởi tạo Analytics nếu bạn cần dùng
// const analytics = getAnalytics(app);

// Export đối tượng auth để các component khác có thể sử dụng
export { auth }; // <<< Bây giờ dòng này sẽ hoạt động vì 'auth' đã được định nghĩa