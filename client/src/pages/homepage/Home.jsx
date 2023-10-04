import React, { useEffect } from "react";

const Home = ({close}) => {
  useEffect(()=>{
    close()
  }, [])
  return (
  <div>
    <div>
      Home
    </div>
    </div>
  );
};

export default Home;
