import { useState } from "react";
import axios from "axios";
import Work from "../assets/img.png";
import { NavLink, useNavigate } from "react-router-dom";

const { VITE_APP_HOST } = import.meta.env;

function SignIn({ token, setToken }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  // const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nickName, setNickName] = useState("");
  const [inputErrors, setInputErrors] = useState({
    email: false,
    password: false,
  });
  const navigate = useNavigate();

  const signIn = async () => {
    setIsLoading(true);
    // 检查输入框是否为空
    const hasEmptyFields = Object.values(form).some((value) => value === "");

    if (hasEmptyFields) {
      // 设置输入错误状态
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        email: form.email === "",
        password: form.password === "",
      }));

      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${VITE_APP_HOST}/users/sign_in`, form);
      setToken(res.data.token);
      setNickName(res.data.nickname);
      setForm({
        email: "",
        password: "",
      });
      const { token } = res.data;
      document.cookie = `Todo=${token};`;
      setIsLoading(false);
      navigate("/todo");
    } catch (err) {
      setIsLoading(false);
      setToken("登入失敗: " + err.message);
      setForm({
        // 清空输入框
        ...form,
        email: "",
        password: "",
      });
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
    <div className="conatiner loginPage ">
      <div>
        <nav className="side">
          <a href="#">
            <img src="https://upload.cc/i1/2022/03/23/8vTzYG.png" alt="title" />
          </a>
        </nav>
        <img className="d-m-n" src={Work} alt="work" />
      </div>
      <div>
        <form className="formControls">
          <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
          <label htmlFor="email" className="formControls_label">
            Email
          </label>
          <input
            className="formControls_input"
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleInput}
            placeholder="請輸入Email"
          />
          {inputErrors.email && (
            <div className="text-danger">此欄位不可為空</div>
          )}
          <label htmlFor="password" className="formControls_label">
            Password
          </label>
          <input
            className="formControls_input"
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleInput}
            placeholder="請輸入密碼"
          />
          {inputErrors.password && (
            <div className="text-danger">此欄位不可為空</div>
          )}

          <button
            type="button"
            onClick={signIn}
            className="formControls_btnSubmit"
            disabled={isLoading}
          >
            登入
          </button>
          <p className="text-danger">{token}</p>

          <NavLink
            className="formControls_btnLink"
            style={{ textDecoration: "none" }}
            to="/signup"
          >
            註冊帳號
          </NavLink>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
