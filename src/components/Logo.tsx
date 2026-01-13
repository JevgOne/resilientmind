import { Link } from "react-router-dom";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="Resilient Mind Logo"
        className="h-16 w-auto object-contain"
      />
    </Link>
  );
};

export default Logo;
