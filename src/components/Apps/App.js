import React from "react";
import { Link } from "react-router-dom";
import PlayStore from "../../assest/image/playstore.svg";
import AppStore from "../../assest/image/appstore.svg";

function App() {
  return (
    <div className=" flex items-center justify-center py-6 ">
      <div className="flex flex-col items-center w-[590px] gap-4 p-4 bg-[#E2FCD6] rounded-lg shadow-lg py-6">
        <h1 className="text-[32px] text-headingDarkClr font-bold">
          Download  app
        </h1>
        <p className="text-sm text-headingDarkClr leading-5 w-14px px-8 pb-4 ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed aliqua.
        </p>
        <div className="flex flex-row gap-3 justify-center">
          <Link to="#">
            <img src={PlayStore} alt="Download on Google Play" className="w-221 h-auto" />
          </Link>
          <Link to="#">
            <img src={AppStore} alt="Download on the App Store" className="w-221 h-auto" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
