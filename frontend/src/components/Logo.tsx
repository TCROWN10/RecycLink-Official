import { Link } from "react-router-dom";
// import logo from "../assets/images/logo/transparent/RecycLink icon.png";

type Props = {
  hideText?: boolean;
};

const Logo = (props: Props) => {
  return (
    <Link
      to="/"
      className="btn btn-ghost btn-neutral normal-case text-sm lg:text-xl font-bold lg:px-4 hover:bg-transparent"
    >
      <img src="https://res.cloudinary.com/detc4yjdi/image/upload/v1743686566/RecycLink_icon_o6blil.png" alt="" className="h-6 lg:h-7" />
      {!props.hideText && (
        <span className="font-extrabold pl-1">RecycLink</span>
      )}
    </Link>
  );
};

export default Logo;
