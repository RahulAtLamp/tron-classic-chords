import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import MenuIcon from "./MenuIcon";
import "./navbar.scss";
import { useNavigate } from "react-router-dom";

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const Navbar = () => {
  // const [error, setError] = useState();
  let navigate = useNavigate();
  const { isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector()
  })
  const { disconnect } = useDisconnect()

  // const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [connected, setConnection] = useState(false);

  const connectWallet = () => {
    connect();
  };

  useEffect(() => {
    if (isConnected) {
      setConnection(true);
    } else {
      setConnection(false);
    }
  }, [isConnected])


  useEffect(() => {
    if (isConnected) {
      setConnection(true);
    } else {
      setConnection(false);
    }
  }, [])


  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <img style={{ width: "250px", height: "80px" }} src={logo} />
      </Link>
      {/* <div onClick={handleClick} className="nav-icon">
        {open ? <FiX /> : <FiMenu />}
      </div> */}
      {/* <ul className={open ? "nav-links" : "nav-links active"}> */}
      <ul className="nav-links">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            <div className="navtextstyle">Home</div>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/player" className="nav-link">
            <div className="navtextstyle">Player</div>
          </Link>
        </li>
        <li className="nav-item" style={{ flexGrow:1 }}>
          <Link to="/explore" className="nav-link">
            <div className="navtextstyle">Explore</div>
          </Link>
        </li>
        {
          connected
            ?
            <>
              <li className="nav-item">
                <Link to="/streaming" className="nav-link">
                  <div className="navtextstyle">Stream</div>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  <div className="navtextstyle">Profile</div>
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-disconnect" onClick={() => { disconnect() }}>disconnect</button>
              </li>
            </>
            :
            <li className="nav-item">
              <button className="nav-button" onClick={() => { connectWallet() }}>Connect</button>
            </li>
        }
      </ul>
      <div className="nav-ham-menu" onClick={() => { setMenu(!menu) }}>
        <MenuIcon />
      </div>
      {
        menu
          ?
          <div className="mobile-menu">
            <ul>
              <li>
                <span onClick={() => { navigate("/") }}>Home</span>
              </li>
              <li>
                <span onClick={() => { navigate("/player") }}>Player</span>
              </li>
              <li>
                <span onClick={() => { navigate("/explore") }}>Explore</span>
              </li>
              {
                connected
                  ?
                  <>
                    <li>
                      <span onClick={() => { navigate("/streaming") }}>Stream</span>
                    </li>
                    <li>
                      <span onClick={() => { navigate("/profile") }}>Profile</span>
                    </li>
                    <button className="nav-button" onClick={() => { disconnect(); }}>Disconnect</button>
                  </>
                  :
                  <button className="nav-button" onClick={() => { connectWallet() }}>Connect</button>
              }
            </ul>
          </div>
          :
          null
      }
    </nav>
  );
};

export default Navbar;
