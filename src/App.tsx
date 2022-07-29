import React, { useEffect } from "react";
import "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { login, logout, selectUser } from "./features/userSlice";
import { auth } from "./firebase";
import Feed from "./components/Feed";
import Auth from "./components/Auth";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  useEffect(() => {
    // onAuthStateChanged .. firebaseのユーザに何らかの変化が起きた時に毎回呼び出される関数 Ex.. ユーザが変わった時など
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            // firebaseに.uid, .photoURL, .displayName 属性がある。??
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout);
      }
    });
    // useEffectにはクリーンアップ関数を指定できる→Appコンポーネントがアンマウントされるときに実行される処理がクリーンアップ関数
    // 今回は認証後実行する必要がないのでunSub()している！
    return () => unSub();
  }, [dispatch]);
  return (
    <>
      {user.uid ? (
        <div className="styles.app">
          <Feed />
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
