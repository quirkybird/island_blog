import { useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import { Avatar } from 'antd';
import {MenuOutlined, MinusOutlined} from '@ant-design/icons';
const Navigation = () => {
  const navLinks = [
    {
      title: "主页",
      path: "/",
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
      title: "播放器",
      path: "/qbmusic"
    }
  ];
  let [menuActive, setMenuActive] = useState(false)
  let [menuActiveStr, setMenuActiveStr] = useState(menuActive ? "left-0" : "-left-80")
  const  handleMenuClick = () => {
     setMenuActive(!menuActive)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMenuActiveStr(menuActiveStr = menuActive ? "left-0" : "-left-80")
   }, [menuActive])
  
  return (
      <header className='fixed left-0 right-0 z-10'>
      <nav className="flex justify-between px-10 py-5 items-start shadow-sm bg-white">
          <Link to="/"><span className="text-xl font-bold lg:text-3xl">quirkybird's blog</span></Link>
          <ul className={`flex flex-col mr-4 h-[calc(100vh-76px)] font-bold  absolute top-[68.35px] bg-white lg:flex-row lg:static lg:items-center lg:h-full ${menuActiveStr} transition-all duration-300 ease-in-out`}>
            {navLinks.map((link, index) => (
            <li className="px-10 py-3 pr-40 text-lg hover:text-blue-300 order-none lg:pr-20 lg:px-0 lg:py-0" key={index} onClick={handleMenuClick}>
              <Link to={link.path}>{link.title}</Link>
            </li>
            ))}
            <span className="order-first pl-8 lg:order-last lg:p-0">
             <Avatar size="large"  src={<img src="https://p26-passport.byteacctimg.com/img/user-avatar/27f273980e0597820475cc6fd66cf037~120x120.awebp" alt="avatar" />} />
             <span className='ml-3'>quirkybird</span>
            </span>
          </ul>
          <span className="self-center lg:hidden">
            {menuActive ? 
            <MenuOutlined style= {{fontSize: "26px"}} onClick={handleMenuClick}  /> 
            : <MinusOutlined style= {{fontSize: "26px"}} onClick={handleMenuClick} />}
          </span>
        </nav>
      </header>
  );
};

export default Navigation;
