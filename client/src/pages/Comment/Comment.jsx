import React, { useEffect } from "react";

function Comment({ show }) {
  useEffect(() => {
    show();
  }, []);

  return (
    <div className="relative h-[100vh] max-w-7xl mx-auto lg:h-auto overflow-y-hidden lg:overflow-y-auto">
      <div className="w-3/5 m-auto p-4 border">
        <div className="text-3xl md:text-4xl text-center">Comments</div>
        <div className="mt-4 p-2 border flex flex-row">
            <div className="border rounded-full h-16 w-16 place-content-center text-center">averta</div>
            <div className="py-4 pl-1 pr-2 ml-1 w-full">
                <form>
                    <input type="text" className="w-full rounded " />
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
