import { useState } from "react";
import axios from "axios";
import Work from "../assets/img.png";
import { NavLink, useNavigate } from "react-router-dom";

const { VITE_APP_HOST } = import.meta.env;

function SignUp() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    checkPassword: "",
  });
  const [message, setMessage] = useState("");

  const [inputErrors, setInputErrors] = useState({
    email: false,
    password: false,
    nickname: false,
    checkPassword: false,
  });

  const navigate = useNavigate(); // 把hook取出來做使用

  const signUp = async () => {
    // 检查输入框是否为空
    const hasEmptyFields = Object.values(form).some((value) => value === "");

    if (hasEmptyFields) {
      // 设置输入错误状态
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        email: form.email === "",
        password: form.password === "",
        nickname: form.nickname === "",
        checkPassword: form.checkPassword === "",
      }));

      setMessage("請填寫所有欄位");
      return;
    }

    if (form.password !== form.checkPassword) {
      alert("兩次密碼不一樣");
      return;
    }
    try {
      // post 路徑 資料 headers
      // get 路徑 headers
      const res = await axios.post(`${VITE_APP_HOST}/users/sign_up`, form);
      setMessage("註冊成功. UID: " + res.data.uid);
      navigate("/"); // 當登入成功後轉址到登入頁
    } catch (err) {
      setMessage("註冊失敗:" + err.message);
    }
  };

  function handleInput(e) {
    // 清除相应的输入错误状态
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: false,
    }));

    // console.log(e.target.name);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div>
      <div className="conatiner signUpPage">
        <div>
          <nav className="side">
            <a href="#">
              <img
                src="https://upload.cc/i1/2022/03/23/8vTzYG.png"
                alt="title"
              />
            </a>
          </nav>
          <img className="d-m-n" src={Work} alt="work" />
        </div>
        <div>
          <form className="formControls">
            <h2 className="formControls_txt">註冊帳號</h2>
            <label htmlFor="email" className="formControls_label">
              Email
            </label>
            <input
              className="formControls_input"
              id="email"
              value={form.email}
              name="email"
              onChange={handleInput}
              placeholder="請輸入Email"
            />
            {inputErrors.email && (
              <div className="text-danger">此欄位不可為空</div>
            )}
            <label htmlFor="nickname" className="formControls_label">
              暱稱
            </label>
            <input
              className="formControls_input"
              id="nickname"
              type="text"
              value={form.nickname}
              name="nickname"
              onChange={handleInput}
              placeholder="請輸入暱稱"
            />
            {inputErrors.nickname && (
              <div className="text-danger">此欄位不可為空</div>
            )}
            <label htmlFor="password" className="formControls_label">
              Password
            </label>
            <input
              className="formControls_input"
              id="password"
              value={form.password}
              name="password"
              onChange={handleInput}
              placeholder="請輸入密碼"
            />
            {inputErrors.password && (
              <div className="text-danger">此欄位不可為空</div>
            )}
            <label htmlFor="checkPassword" className="formControls_label">
              再次輸入密碼
            </label>
            <input
              className="formControls_input"
              value={form.checkPassword}
              name="checkPassword"
              id="checkPassword"
              onChange={handleInput}
              placeholder="請再次輸入密碼"
            />
            {inputErrors.checkPassword && (
              <div className="text-danger">此欄位不可為空</div>
            )}
            <button
              type="button"
              onClick={signUp}
              className="formControls_btnSubmit"
            >
              註冊帳號
            </button>
            <p>{message}</p>
            <NavLink
              className="formControls_btnLink"
              style={{ textDecoration: "none" }}
              to="/"
            >
              登入
            </NavLink>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
