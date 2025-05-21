import React from "react";
// import { profileAvatar } from "../../assets";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="py-8  flex gap-[700px] items-center justify-between">
      <article className="px-4">
        <h2 className="font-bold text-xl text-white">Hi, Tcrown10</h2>
        <p className="text-sm">Let’s keep our Environment Clean</p>
      </article>
      <button className="flex">
        <img src="https://res.cloudinary.com/detc4yjdi/image/upload/v1743679474/profileAvatar_bsyj0i.png" alt="profileAvatar" />
      </button>
    </div>
  );
};

export default Header;
