import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, message } from "antd";
import { MenuOutlined, MinusOutlined } from "@ant-design/icons";
import request from "../../http";
import { setUserInfo, getUserInfo } from "../../utils/storage";

const Navigation = () => {
  const navLinks = [
    {
      title: "主页",
      path: "/home",
    },
    {
      title: "博客",
      path: "/blog",
    },
    {
      title: "友链",
      path: "/friendsLinks",
    },
    {
      title: "留言堆",
      path: "/messagestack",
    },
  ];
  // 导航栏的出现与否
  let [menuActive, setMenuActive] = useState(false);
  // 导航栏垂直状态出现的tailwind字段设置
  let [menuActiveStr, setMenuActiveStr] = useState(
    menuActive ? "left-0" : "-left-80"
  );
  // 导航栏水平状态出现的tailwind字段设置
  let [menuTopShow, setMenuTopShow] = useState("");
  // 用户信息
  const [userInfo, setUserInfoState] = useState({});
  const handleMenuClick = () => {
    setMenuActive(!menuActive);
  };
  // 记录当前点击页面索引
  // 这样做显然是有问题的，比如手动输入地址时，标题不会改变
  const handleClick = (title) => {
    document.title = title;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMenuActiveStr((menuActiveStr = menuActive ? "left-0" : "-left-80"));
    // 滚动处理函数
    const onScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop >= 70) {
        setMenuTopShow("-translate-y-[80px]");
      } else {
        setMenuTopShow("translate-y-0");
      }
    };
    // 添加滚动监听
    window.addEventListener("scroll", onScroll);
    return () => {
      setMenuTopShow("translate-y-0");
      window.removeEventListener("scroll", onScroll);
    };
  }, [menuActive]);

  useEffect(() => {
    // 如果localStorage中没有用户信息才去请求
    request
      .get("http://localhost/user/2")
      .then((res) => {
        if (res) {
          setUserInfoState(res[0]);
          setUserInfo(res[0]); // 存储到localStorage
        }
      })
      .catch((err) => {
        message.error("获取用户信息失败");
        console.error(err);
      });
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-50 ${menuTopShow}  transition-all duration-600 ease-in-out dark:bg-[--bg-dark-theme-color] bg-white`}
    >
      <nav className="flex justify-between items-center px-3 lg:px-10 py-5 shadow-sm dark:shadow-[#334155] relative">
        <Link to="/home">
          <span className="absolute top-[10px] left-[20px]">
            <img
              className="w-[46px] lg:w-[60px]"
              src={require("../../assets/images/logo.webp")}
              alt="logo"
            />
          </span>
        </Link>
        <ul
          className={`flex flex-col mr-4 h-[calc(100vh-68.35px)] font-bold  absolute top-[68.35px] dark:bg-[--bg-dark-theme-color] bg-white lg:flex-row lg:static lg:items-center lg:h-full ${menuActiveStr} transition-all duration-300 ease-in-out`}
        >
          {navLinks.map((link, index) => (
            <li
              className="px-10 py-3 pr-40 text-lg hover:text-blue-300 order-none lg:pr-20 lg:px-0 lg:py-0"
              key={index}
              onClick={handleMenuClick}
            >
              <Link
                to={link.path}
                onClick={() => {
                  handleClick(link.title);
                }}
              >
                {link.title}
              </Link>
            </li>
          ))}
          <span className="order-first pl-8 lg:order-last lg:p-0">
            <Avatar size="large" src={userInfo?.avatar} />
            <span className="ml-3">{userInfo?.NAME}</span>
          </span>
        </ul>
        <span className="self-center lg:hidden">
          {menuActive ? (
            <MenuOutlined
              style={{ fontSize: "26px" }}
              onClick={handleMenuClick}
            />
          ) : (
            <MinusOutlined
              style={{ fontSize: "26px" }}
              onClick={handleMenuClick}
            />
          )}
        </span>
      </nav>
    </header>
  );
};

export default Navigation;
