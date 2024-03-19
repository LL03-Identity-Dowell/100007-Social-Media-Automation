import React, {useEffect, useState} from "react";
import {profile} from "../../assets";

function MyTeam({close}) {
    const [username, setUserName] = useState();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userInfo"));
    setUserName(user?.username);
    close();
  }, []);

    return (
        <div className="bg-pens bg-cover bg-center h-[90vh]">
      <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
        <div className="flex justify-center items-center flex-col h-full w-full">
            <div>
                <h2 className="text-customBlue font-bold text-2xl xl:text-4xl pb-12">
                    Meet our Team
                </h2>
            </div>
            <div className="flex justify-center items-center mt-4 flex-col">
                <img
                    src={profile}
                    alt="profile"
                    className="rounded-full w-[40px] h-[40px] "
                />
                <p className="text-customBlue font-semibold text-lg py-2">Admin</p>
                <h4 className="font-bold text-md text-customGray">{username}</h4>
                <h2 className="font-semibold text-3xl text-customTextBlue mt-12">
                    Members
                </h2>
                <div className="flex gap-4 mt-6">
                    <img
                        src={profile}
                        alt="profile"
                        className="rounded-full w-[40px] h-[40px] "
                    />
                    <img
                        src={profile}
                        alt="profile"
                        className="rounded-full w-[40px] h-[40px] "
                    />
                    <img
                        src={profile}
                        alt="profile"
                        className="rounded-full w-[40px] h-[40px] "
                    />
                    <img
                        src={profile}
                        alt="profile"
                        className="rounded-full w-[40px] h-[40px] "
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
    );
}

export default MyTeam;
