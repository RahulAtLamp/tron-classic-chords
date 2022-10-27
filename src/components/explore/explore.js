import React from "react";
import { ParallaxHover } from "react-parallax-hover";
import "./explore.css";
import NFT1 from "../../images/nft1.png";
import NFT2 from "../../images/nft2.png";
import NFT3 from "../../images/nft3.png";
import NFT4 from "../../images/nft4.png";
import NFT5 from "../../images/nft5.png";
import NFT6 from "../../images/nft6.png";
import NFT7 from "../../images/nft7.png";
import NFT8 from "../../images/nft8.png";

const Explore = () => {
  return (
    <div>
      <div className="exp-header">Explore</div>
      <div className="exp-main">
        <div className="exp-pa">
          <ParallaxHover borderRadius={20} scale={5} width={300} height={400}>
            <div className="exp-bg">
              <img className="exp-nft" src={NFT1} />
              <div className="exp-txt">Name</div>
              <div className="exp-txt">Description</div>
              <div className="exp-txt">Price</div>
            </div>
          </ParallaxHover>
        </div>
        <div className="exp-pa">
          <ParallaxHover borderRadius={20} scale={5} width={300} height={400}>
            <div className="exp-bg">
              <img className="exp-nft" src={NFT2} />
              <div className="exp-txt">Name</div>
              <div className="exp-txt">Description</div>
              <div className="exp-txt">Price</div>
            </div>
          </ParallaxHover>
        </div>
        <div className="exp-pa">
          <ParallaxHover borderRadius={20} scale={5} width={300} height={400}>
            <div className="exp-bg">
              <img className="exp-nft" src={NFT3} />
              <div className="exp-txt">Name</div>
              <div className="exp-txt">Description</div>
              <div className="exp-txt">Price</div>
            </div>
          </ParallaxHover>
        </div>
        <div className="exp-pa">
          <ParallaxHover borderRadius={20} scale={5} width={300} height={400}>
            <div className="exp-bg">
              <img className="exp-nft" src={NFT4} />
              <div className="exp-txt">Name</div>
              <div className="exp-txt">Description</div>
              <div className="exp-txt">Price</div>
            </div>
          </ParallaxHover>
        </div>
        <div className="exp-pa">
          <ParallaxHover borderRadius={20} scale={5} width={300} height={400}>
            <div className="exp-bg">
              <img className="exp-nft" src={NFT5} />
              <div className="exp-txt">Name</div>
              <div className="exp-txt">Description</div>
              <div className="exp-txt">Price</div>
            </div>
          </ParallaxHover>
        </div>
        <div className="exp-pa">
          <ParallaxHover borderRadius={20} scale={5} width={300} height={400}>
            <div className="exp-bg">
              <img className="exp-nft" src={NFT6} />
              <div className="exp-txt">Name</div>
              <div className="exp-txt">Description</div>
              <div className="exp-txt">Price</div>
            </div>
          </ParallaxHover>
        </div>
        <div className="exp-pa">
          <ParallaxHover borderRadius={20} scale={5} width={300} height={400}>
            <div className="exp-bg">
              <img className="exp-nft" src={NFT7} />
              <div className="exp-txt">Name</div>
              <div className="exp-txt">Description</div>
              <div className="exp-txt">Price</div>
            </div>
          </ParallaxHover>
        </div>
        <div className="exp-pa">
          <ParallaxHover borderRadius={20} scale={5} width={300} height={400}>
            <div className="exp-bg">
              <img className="exp-nft" src={NFT8} />
              <div className="exp-txt">Name</div>
              <div className="exp-txt">Description</div>
              <div className="exp-txt">Price</div>
            </div>
          </ParallaxHover>
        </div>
      </div>
      <br />
    </div>
  );
};

export default Explore;
