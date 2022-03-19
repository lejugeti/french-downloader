import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = (props) => {
  return (
    <div>
      <div className='navbar-container'>
        <Link to='/search' className='navigation-link'>
          Recherche
        </Link>
        <Link to='/downloads' className='navigation-link'>
          Téléchargements
        </Link>
      </div>
      <hr className='navbar-separator' />
    </div>
  );
};

export default Navbar;
