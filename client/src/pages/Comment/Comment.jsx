import React, { useEffect } from "react";

function Comment({ show }) {
  useEffect(() => {
    show();
  }, []);

  return (
    <div className="relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto">
      <div className="w-3/5 m-auto p-4 border">
        <div className="text-3xl md:text-4xl text-center">Comments</div>
        <div className="mt-4 p-2 flex flex-row">
          <div className="border rounded-full h-16 w-16 place-content-center text-center"></div>
          <div className="py-4 pl-1 pr-2 ml-1 w-full ">
            <form>
              <input
                type="text"
                className="w-full rounded"
                placeholder="Type your comments"
              />
            </form>
            <div
              id="display-comments"
              className=" p-2 mt-4 flex flex-row"
            >
              <div className="border rounded-full h-12 w-12 "></div>
              <div className="ml-2 px-2 w-full">
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim
                  quos a eum? Nobis, id beatae. Expedita maiores dolorum porro
                  ex aut ad perspiciatis adipisci dolorem?
                </p>
              </div>
              {/*  */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
