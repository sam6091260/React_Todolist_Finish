import { useState } from "react";
import axios from "axios";

const { VITE_APP_HOST } = import.meta.env;

function SignOut() {
  const [token, setToken] = useState("");

  const signOut = async () => {
    try {
      // 清除本地存储的 token
      localStorage.removeItem("hexschoolTodoToken");

      // 重置 token 状态
      setToken("");
      document.cookie = "Todo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      const res = await axios.post(
        `${VITE_APP_HOST}/users/sign_out`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      setToken("登出錯誤: " + err.message);
    }
  };

  return (
    <div className="mt-5 col-5">
      <h2 className="fw-bold">登出</h2>
      <input
        className="form-control mt-1"
        value={token}
        onChange={(e) => {
          setToken(e.target.value);
        }}
        placeholder="Token"
      />
      <button
        type="button"
        onClick={signOut}
        className="fw-bold btn btn-dark mt-4"
      >
        Sign Out
      </button>
      <p>{token}</p>
    </div>
  );
}

export default SignOut;
