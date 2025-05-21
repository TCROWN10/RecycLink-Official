import { Link } from "react-router-dom";
import logo from "../assets/images/logo/transparent/RecycLink icon.png";

type Props = {
  hideText?: boolean;
};

const Logo = (props: Props) => {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center">
        <img 
          src={logo} 
          alt="RecycLink Logo" 
          className="h-8 w-8"
        />
      {!props.hideText && (
          <span className="ml-2 text-xl font-bold">RecycLink</span>
      )}
    </Link>
    </div>
  );
};

export default Logo;
