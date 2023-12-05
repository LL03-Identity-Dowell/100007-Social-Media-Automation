import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ViewComments({ show }) {
  const [error, setError] = useState("");

  const { id } = useParams();

  useEffect(() => {
    show();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      const url = `http://127.0.0.1:8000/api/v1/comments/get-post-comments/${id}/`;
      await axios
        .get(url, {
          withCredentials: true,
        })
        .then((response) => {
          let data = response.data.recent_posts;
          console.log(data);
        })
        .catch(() => {
          setError("Server error, Please try again later");
        });
    };
    fetchComments();
  }, []);

  return (
    <div className='relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto'>
      <div className='w-[90%] m-auto p-4  text-left text-gray-500 dark:text-gray-400 '>
        <div className='text-3xl text-center md:text-4xl text-customTextBlue'>
          Comments
        </div>
        <div className='flex flex-row p-2 mt-4'>
          <img src='' className='w-12 h-12 border rounded-full' alt='' />
          <div className='w-full py-4 pl-1 pr-2 ml-1 '>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni,
              repellendus adipisci! Fugiat consequatur repellat optio deleniti
              explicabo modi repudiandae eveniet voluptate aliquam eligendi
              veritatis, est dolor quos laboriosam ipsa recusandae!explicabo
              modi repudiandae eveniet voluptate aliquam eligendi veritatis, est
              dolor quos laboriosam ipsa recusandae!
            </p>

            <div id='display-comments' className='flex flex-row p-2 mt-4 '>
              <img src='' className='w-8 h-8 border rounded-full' alt='' />
              <div className='w-full px-2 ml-2'>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim
                  quos a eum? Nobis, id beatae. Expedita maiores dolorum porro
                  ex aut ad perspiciatis adipisci dolorem?
                </p>
              </div>
            </div>
            <div id='display-comments' className='flex flex-row p-2 mt-4 '>
              <img src='' className='w-8 h-8 border rounded-full' alt='' />
              <div className='w-full px-2 ml-2'>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim
                  quos a eum? Nobis, id beatae. Expedita maiores dolorum porro
                  ex aut ad perspiciatis adipisci dolorem?
                </p>
              </div>
            </div>
            <div id='display-comments' className='flex flex-row p-2 mt-4 '>
              <img src='' className='w-8 h-8 border rounded-full' alt='' />
              <div className='w-full px-2 ml-2'>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim
                  quos a eum? Nobis, id beatae. Expedita maiores dolorum porro
                  ex aut ad perspiciatis adipisci dolorem?
                </p>
              </div>
            </div>
            <div id='display-comments' className='flex flex-row p-2 mt-4 '>
              <img src='' className='w-8 h-8 border rounded-full' alt='' />
              <div className='w-full px-2 ml-2'>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim
                  quos a eum? Nobis, id beatae. Expedita maiores dolorum porro
                  ex aut ad perspiciatis adipisci dolorem?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewComments;
