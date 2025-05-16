import { useState, useEffect } from "react";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const storedInfo = localStorage.getItem("userInfo");
    if (storedInfo) {
      setUserInfo(JSON.parse(storedInfo));
    }
  }, []);

  return (
    <div className="px-5 lg:my-10">
      <div className="inline-block">
        <h1 className="intro text-[clamp(3.5rem,3.4446vw+1.5rem,7rem)] font-bold">
          👋 Hi, I'm {userInfo.NAME}.
        </h1>
      </div>
      <p className="text-xl mt-5 lg:mt-10">
        {userInfo.about ||
          "我将要在这里分享我的总结、想法和生活，一些东西正在慢慢构建，让我们一起在互联网中游荡，这里是我的站点"}
      </p>
    </div>
  );
};

export default Profile;
