import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { VITE_APP_HOST } = import.meta.env;

const TodoList = ({ token, setToken }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [nickName, setNickName] = useState("");
  const [tabStatus, setTabStatus] = useState("all");
  const [filterTodos, setFilterTodos] = useState([]);
  const [notFinish, setNotFinish] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        if (token) {
          axios.defaults.headers.common["Authorization"] = token;

          const res = await axios.get(`${VITE_APP_HOST}/users/checkout`);
          console.log(res);
          setNickName(res.data.nickname);

          getTodos();
        } else {
          navigate("/");
        }
      } catch (err) {
        alert("登入失敗");
        console.log("登入失敗", err);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    })();
  }, [token]);

  useEffect(() => {
    const notFinishItem = todos.filter((e) => e.status === false);
    setNotFinish(notFinishItem.length);
  }, [todos]);

  useEffect(() => {
    if (tabStatus === "all") {
      setFilterTodos(todos);
    } else if (tabStatus === "notFinish") {
      const notFinish = todos.filter((e) => e.status === false);
      setFilterTodos(notFinish);
    } else if (tabStatus === "finish") {
      const finish = todos.filter((e) => e.status === true);
      setFilterTodos(finish);
    }
  }, [tabStatus, todos]);

  // 取得用戶待辦資訊
  const getTodos = async () => {
    const res = await axios.get(`${VITE_APP_HOST}/todos/`, {
      headers: {
        Authorization: token,
      },
    });
    setTodos(res.data.data);
  };

  // 新增待辦資訊
  const addTodo = async () => {
    if (!newTodo) return;
    const todo = {
      content: newTodo,
    };
    await axios.post(`${VITE_APP_HOST}/todos/`, todo, {
      headers: {
        Authorization: token,
      },
    });
    setNewTodo("");
    getTodos();
    setTabStatus("all");
  };

  // 鍵盤enter新增事項
  const handleInputKeyPress = (event) => {
    if (event.key === "Enter") {
      addTodo(); // 调用添加待办事项的函数
    }
  };

  // 刪除待辦資訊
  const deleteTodo = async (id) => {
    await axios.delete(`${VITE_APP_HOST}/todos/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    getTodos();
  };

  // 已完成項目
  const finishTodo = async (id) => {
    try {
      await axios.patch(
        `${VITE_APP_HOST}/todos/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      getTodos();
    } catch (error) {
      console.log("失敗", error.response.data.message);
    }
  };

  // 刪除已完成項目
  const clearFinishItem = async () => {
    todos.filter((e) => {
      if (e.status) {
        deleteTodo(e.id);
      }
      alert("刪除成功");
    });
  };

  // 登出到登入頁面
  const signOut = async () => {
    // 清除存储 Token 的 Cookie
    document.cookie = "Todo=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setToken("");
    alert("登出成功");
    navigate("/");
  };

  return (
    <div className="todoListPage bg-half">
      <nav className="my-nav">
        <a href="#">
          <img src="https://upload.cc/i1/2022/03/23/8vTzYG.png" alt="title" />
        </a>
        <div>
          <a className="fw-bold text-dark" href="#" onClick={signOut}>
            <span>{nickName}的代辦 </span>
          </a>
          <a href="#" className="mx-2 text-dark" onClick={signOut}>
            登出
          </a>
        </div>
      </nav>

      <div className="conatiner todoListPage vhContainer">
        <div className="todoList_Content">
          <div className="inputBox">
            <input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleInputKeyPress}
              placeholder="新增待辦事項"
            />
            <a
              className="btn btn-dark d-flex align-items-center"
              onClick={addTodo}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  d="M18.6364 8.93184H11.8182V2.11364C11.8182 1.36091 11.2073 0.75 10.4545 0.75H9.54548C8.79275 0.75 8.18184 1.36091 8.18184 2.11364V8.93184H1.36364C0.610908 8.93184 0 9.54275 0 10.2955V11.2045C0 11.9573 0.610908 12.5682 1.36364 12.5682H8.18184V19.3864C8.18184 20.1391 8.79275 20.75 9.54548 20.75H10.4545C11.2073 20.75 11.8182 20.1391 11.8182 19.3864V12.5682H18.6364C19.3891 12.5682 20 11.9573 20 11.2045V10.2955C20 9.54275 19.3891 8.93184 18.6364 8.93184Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>

          <div className="todoList_list">
            <ul className="todoList_tab">
              <li>
                <a
                  href="#"
                  className={tabStatus === "all" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setTabStatus("all");
                  }}
                >
                  全部
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={tabStatus === "notFinish" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setTabStatus("notFinish");
                  }}
                >
                  待完成
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={tabStatus === "finish" ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setTabStatus("finish");
                  }}
                >
                  已完成
                </a>
              </li>
            </ul>
            <div className="todoList_items">
              <ul className="todoList_item">
                {filterTodos.length === 0 ? (
                  <li
                    className="todoList_label"
                    style={{ justifyContent: "space-around", cursor: "auto" }}
                  >
                    目前尚無項目
                  </li>
                ) : (
                  ""
                )}
                {filterTodos.map((todo) => {
                  return (
                    <li key={todo.id}>
                      <label className="todoList_label">
                        <div className="d-flex justify-content-center">
                          <input
                            className="todoList_input"
                            type="checkbox"
                            checked={todo.status}
                            onChange={() => finishTodo(todo.id)}
                          />
                          <span>{todo.content}</span>
                        </div>

                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteTodo(todo.id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M1.14747 1.1475C1.19391 1.10102 1.24905 1.06414 1.30975 1.03897C1.37045 1.01381 1.43551 1.00086 1.50122 1.00086C1.56693 1.00086 1.63199 1.01381 1.69269 1.03897C1.75339 1.06414 1.80853 1.10102 1.85497 1.1475L7.99997 7.2925L14.1475 1.1475C14.2413 1.05368 14.3685 1.00098 14.5012 1.00098C14.6339 1.00098 14.7611 1.05368 14.855 1.1475C14.9488 1.24132 15.0015 1.36857 15.0015 1.50125C15.0015 1.63394 14.9488 1.76118 14.855 1.855L8.70747 8L14.8525 14.1475C14.9463 14.2413 14.999 14.3686 14.999 14.5012C14.999 14.6339 14.9463 14.7612 14.8525 14.855C14.7586 14.9488 14.6314 15.0015 14.4987 15.0015C14.366 15.0015 14.2388 14.9488 14.145 14.855L7.99997 8.7075L1.85247 14.8525C1.75682 14.9344 1.63378 14.9772 1.50794 14.9724C1.38211 14.9675 1.26274 14.9153 1.17369 14.8263C1.08464 14.7372 1.03248 14.6179 1.02762 14.492C1.02276 14.3662 1.06556 14.2431 1.14747 14.1475L7.29247 8L1.14747 1.8525C1.05435 1.75882 1.00208 1.6321 1.00208 1.5C1.00208 1.36791 1.05435 1.24119 1.14747 1.1475Z"
                              fill="#333333"
                            />
                          </svg>
                        </a>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <div className="todoList_statistics">
                <p> {notFinish}個待完成項目</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    clearFinishItem();
                  }}
                >
                  清除已完成項目
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
