import React from 'react';
import "./MintNft.scss";
import ConfettiExplosion from 'react-confetti-explosion';

function MintNft(props) {
    const [isExploding, setIsExploding] = React.useState(false);

    return (
        <div className='mint-nft-main'>
            <div className="mint-nft-container">
                <div className="mint-nft-header">
                    <h2 className="mint-nft-h2">Mint the ART</h2>
                </div>
                <div className="mint-nft-data">
                    <div className="mint-nft-video">
                        <video className='mint-nft-v' src="videos/sample.mp4" controls download />
                    </div>
                    <div className="mint-nft-name">
                        <input type="text" placeholder='Name' className='mint-nft-n' />
                    </div>
                    <div className="mint-nft-description">
                        <textarea className='mint-nft-d' placeholder='Description'></textarea>
                    </div>
                    <div className="mint-nft-qty">
                        <input type="number" placeholder='No. of NFTs' className='mint-nft-num' />
                    </div>
                    <div className="mint-nft-price">
                        <input type="number" placeholder='Price in TRX' className='mint-nft-p' />
                    </div>
                    <div className="mint-nft-btn">
                        <button className="mint-nft-b" onClick={() => { setIsExploding(true) }}>Mint{isExploding ? <ConfettiExplosion particleCount={300} height={1080} width={1080} /> : null}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.forwardRef(MintNft);