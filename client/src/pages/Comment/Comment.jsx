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
          <div className="py-4 pl-1 pr-2 ml-1 w-full">
            <form>
              <input
                type="text"
                className="w-full rounded "
                placeholder="Type your comments"
              />
            </form>
            <div id="display-comments" className="border p-2 mt-4 flex flex-row">
              <div className="border rounded-full h-12 w-12 "></div>
              {/* <span className="ml-4 border">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
                atque ullam a libero aliquid, quos harum quis quasi mollitia,
                fuga dolor voluptatum, suscipit reprehenderit reiciendis.
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
