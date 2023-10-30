import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const dowellLoginUrl =
    "https://100014.pythonanywhere.com/?redirect_url=" +
    window.location.origin;

// const dowellLogoutUrl =
//     "https://100014.pythonanywhere.com/sign-out?redirect_url=" +
//     window.location.origin +
//     "/100018-dowellWorkflowAi-testing/%23";

// const getUserInfoOther = async (session_id) => {
//     const session = {
//         session_id,
//     };

//     const res = await axios({
//         method: "post",
//         url: "https://100093.pythonanywhere.com/api/userinfo/",
//         data: session,
//     });

//     // console.log(res.data);
//     sessionStorage.setItem("userInfo", JSON.stringify(res.data));
// };

const getUserInfo = async (session_id) => {
    const session = {
        session_id,
    };

    const res = await axios({
        method: "post",
        url: "https://100014.pythonanywhere.com/api/userinfo/",
        data: session,
    });

    console.log(res.data);
    sessionStorage.setItem("userInfo", JSON.stringify(res.data));
};

export default function useDowellLogin() {
    const [searchParams, setSearchParams] = useSearchParams();

    const localSession = sessionStorage.getItem("session_id")
        ? JSON.parse(sessionStorage.getItem("session_id"))
        : null;
    // const localId = sessionStorage.getItem("id")
    //     ? JSON.parse(sessionStorage.getItem("id"))
    //     : null;

    useEffect(() => {
        const session_id = searchParams.get("session_id");
        console.log(session_id)
        // const id = searchParams.get("id");

        // if (session_id) {
        //     sessionStorage.setItem("session_id", session_id);
        //     if (id || localId) {
        //         sessionStorage.setItem("id", id);
        //         getUserInfoOther(session_id);
        //     } else {
        getUserInfo(session_id);

        // }
        if (!localSession && !session_id) {
            window.location.replace(dowellLoginUrl);
        }
    }, []);
}