import { Link } from "react-router-dom";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img
        src="/assets/resilient-mind-logo.png"
        alt="Resilient Mind Logo"
        className="h-10 w-auto object-contain"
      />
      <span className="font-serif text-lg font-semibold tracking-tight text-gradient-gold">
        Resilient Mind
      </span>
    </Link>
  );
};

export default Logo;
