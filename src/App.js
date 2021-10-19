import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import ReactPlayer from 'react-player';

export const StyledNumberInput = styled.input.attrs((props) => ({
  type: 'number',
  min: 1,
  max: 10,
  defaultValue: props.value,
}))`
border-radius: 50px;
border: none;
background-color: #117999;
padding: 5px;
font-weight: bold;
color: #000000;
width: 50px;
cursor: ;
box-shadow: 2px 8px 4px -2px rgba(250, 250, 0, 0.5);
-webkit-box-shadow: 2px 3px 10px -2px rgba(0, 0, 0, 0.5);
-moz-box-shadow: 2px 8px 4px -2px rgba(250, 250, 0, 0.5);
:active {
  box-shadow: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
}
`;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #117999;
  padding: 10px;
  font-weight: bold;
  color: #000000;
  width: 300px;
  cursor: pointer;
  box-shadow: 2px 8px 4px -2px rgba(0, 200, 250, .1);
  -webkit-box-shadow: 2px 3px 10px -2px rgba(0, 200, 250, .9);
  -moz-box-shadow: 2px 8px 4px -2px rgba(0, 200, 250, 0.1);
  :active {
    box-shadow: none;
    -webkit-box-shadow: 2px 3px 10px -2px rgba(0, 200, 250, 1.0);
    -moz-box-shadow: none;
  }
  :hover {
    -webkit-box-shadow: 2px 3px 30px -2px rgba(239, 146, 235, 1.0);
  }
`;

export const StyledButton1 = styled.button`
  padding: 0px;
  border-radius: 0px;
  border: none;
  background-color: #000000;
  padding: 0px;
  font-weight: bold;
  color: #ffffff;
  width: 800px;
  cursor: pointer;
  box-shadow: 2px 8px 4px -2px rgba(239, 146, 235, .5);
  -webkit-box-shadow: 2px 3px 10px -2px rgba(239, 146, 235, 1.0);
  -moz-box-shadow: 2px 8px 4px -2px rgba(239, 146, 235, 0.5);
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: ;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: column;
  }
`;

export const StyledImg1 = styled.img`
height: 0px;
center
position: fixed;
  margin-bottom: 0px;
  margin-top: 20px;
  @media (min-width: 767px) {
    width: 760px;
    height: 256px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg3 = styled.img`
  width: 300px;
  height: 300px;
  @media (min-width: 767px) {
    width: 300px;
    height: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg4 = styled.img`
border-radius: 50px;
color: #ffffff;
cursor: pointer;
box-shadow: 2px 8px 4px -2px rgba(239, 146, 235, 0.5);
-webkit-box-shadow: 2px 3px 10px -2px rgba(239, 146, 235, 1.0);
-moz-box-shadow: 2px 8px 4px -2px rgba(239, 146, 235, 0.5);
:active {
  box-shadow: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
}
:hover {
  -webkit-box-shadow: 2px 3px 20px -2px rgba(0, 200, 250, 0.9);
}
`;

export const Gallery = styled.div`
  height: 0px;
  position: fixed;
  margin-bottom: 0px;

  .photobanner {
    position: fixed;
    top: 0px;
    right: 0px;
    overflow: hidden;
    white-space: nowrap;
    animation: bannermove 60s linear infinite alternate;

    &:hover {
      animation-play-state: ;
    }
  }

  .photobanner img {
    height: 175px;
    margin: 0 .0em;
  }

  @keyframes bannermove {
    70% {
      transform: translate( -50%, 0);
    }
    70% {
      transform: translate( 50%, 0);
    }
  }
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("1 Secret Society Owl NFT = .07 ETH");
  const [claimingNft, setClaimingNft] = useState(false);
  const [mintQuantity, setMintQuantity] = useState(1)

  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback("Preparing your ApeFren NFT...");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(_amount)
      .send({
        // gasLimit: "2500000",
        to: "0xc2b0cdb9f9d930c82f2360f979cee025bfc78281",
        from: blockchain.account,
        value: blockchain.web3.utils.toWei(( .04 * _amount).toString(), "ether"),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("It seems the transaction was cancelled | 1 ApeFren is .04 ETH");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          <s.TextDescription style={{ textAlign: "center" }}>
                  Woohoo! Your ApeFren is sleeping at {" "}
                  <a
                    target={""}
                    href={"https://opensea.io/collection/ApeFren"}
                  >
                    Opensea.io
                  </a>
                </s.TextDescription>
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{ backgroundColor: "var(--black)" }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 50 }}>
        <s.TextTitle
          style={{ textAlign: "center", fontSize: 42, fontWeight: "bold" }}
        >
          {/* <StyledImg1 alt={""} src={i91}/> */}
          
        </s.TextTitle>
        <ResponsiveWrapper flex={10} style={{ padding: 0 }}>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <s.TextTitle
              style={{ textAlign: "center", fontSize: 26, fontWeight: "bold" }}

            >
              {data.totalSupply}/4000
              <s.SpacerSmall/>
            </s.TextTitle>
          </s.Container>
          <s.Container
            flex={10}
            jc={"center"}
            ai={"center"}
            style={{ backgroundColor: "#000000", padding: 20 }}
          >
            {Number(data.totalSupply) == 4000 ? (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                SOLD OUT!
                </s.TextTitle>
                <s.SpacerMedium />
                <s.TextDescription style={{ textAlign: "center" }}>
                  You can still trade ApeFren's at {" "}
                  <a
                    target={""}
                    href={"https://opensea.io/collection/ApeFren"}
                  >
                    ApeFren NFT Collection
                  </a>
                </s.TextDescription>
              </>
            ) : (
              <>
                <s.TextDescription style={{ textAlign: "center" }}>
                  {feedback}
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    {/* <s.TextTitle style={{ textAlign: "center", fontSize: 16 }}>
                - excluding gas -
                </s.TextTitle> */}
                    <s.SpacerMedium />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT WALLET
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.TextDescription style={{ textAlign: "center" }}>
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledNumberInput 
                    value={mintQuantity}
                      onChange={(e) => setMintQuantity(e.target.value) }/>
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs(mintQuantity);
                        getData();
                      }}
                    >
                      {claimingNft ? "Busy..." : `Purchase ${mintQuantity} ApeFren`}
                    </StyledButton>
                  </s.Container>
                )}
              </>
            )}
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerSmall />
        {/* <s.TextTitle style={{ textAlign: "center", fontSize: 16 }}>
                Mobile users must open fantombeeingo.io with MetaMask Browser
                </s.TextTitle> */}
        <s.TextDescription style={{ textAlign: "center", fontSize: 20 }}>
                   <s.TextDescription style={{ textAlign: "center", fontSize: 16 }}>
                   {" "}
                  {/* <Gallery>
          <div className='photobanner'>
            <img src={i10} alt='' />
            <img src={i26} alt='' />
            <img src={i25} alt='' />
            <img src={i24} alt='' />
            <img src={i23} alt='' />
            <img src={i22} alt='' />
            <img src={i21} alt='' />
            <img src={i20} alt='' />
            <img src={i19} alt='' />
            <img src={i12} alt='' />
            <img src={i31} alt='' />
            <img src={i30} alt='' />
            <img src={i29} alt='' />
            <img src={i28} alt='' />
            <img src={i27} alt='' />
            <img src={i10} alt='' />
            <img src={i12} alt='' />
            <img src={i13} alt='' />
            <img src={i14} alt='' />
            <img src={i15} alt='' />
            <img src={i16} alt='' />
            <img src={i17} alt='' />
            <img src={i18} alt='' />
            <img src={i19} alt='' />
            <img src={i20} alt='' />
            <img src={i21} alt='' />
            <img src={i22} alt='' />
            <img src={i23} alt='' />
            <img src={i24} alt='' />
            <img src={i25} alt='' />
            <img src={i26} alt='' />
            <img src={i10} alt='' />
          </div>
        </Gallery> */}
                </s.TextDescription>
          {/* <button 
  onClick={() =>  window.open('https://ftmscan.com/address/0x39885efab63a6dbc168c2966dc7e4f28b972bb05#writeContract')}
>
Click here to mint straight from smart contract on ftmscan
</button> */}
          </s.TextDescription>
          <s.SpacerLarge/>
          <s.SpacerSmall />
          {/* <div>
            <a href="https://tbc.exchange">
<StyledImg4 src={i2} style={{ width: 220, height: 160, padding: 10 }}/>
</a>
....
<a href="https://discord.gg/syJpegd2hh">
<StyledImg4 src={i1} style={{ width: 220, height: 160, padding: 10 }}/>
</a>
....
<a href="https://opensea.io/collection/tweethebee">
<StyledImg4 src={i8} style={{ width: 220, height: 160, padding: 10 }}/>
</a>
....
<a href="https://paintswap.finance/collection/0x39885efab63a6dbc168c2966dc7e4f28b972bb05">
<StyledImg4 src={i8} style={{ width: 220, height: 160, padding: 10 }}/>
</a>
</div> */}
<s.SpacerMedium />
                {/* <s.TextDescription style={{ width: 600, padding: 10, textAlign: "center" }}>
                   {" "}
                  <a
                    target={""}
                    href={"https://discord.gg/Rx2b4JTxJr"}
                  >
                    Enter the Hive to Play Beeingo, Live on Discord 
                  </a>
                </s.TextDescription> */}
        <s.Container jc={"top"} ai={"center"} style={{ width: "70%" }}>
          {/* <ReactPlayer url='https://youtu.be/IiH9dNAmgB4'/> */}
          <s.SpacerSmall />
          {/* <img src={i4} style={{ width: 96, height: 96, padding: 10 }} /> */}
          {/* <s.TextDescription style={{ textAlign: "center" }}>
                  {" "}
                  <a
                    target={""}
                    href={"https://tbc.exchange"}
                  >
                    Copyright © FantomBeeingo.io 2021 All rights reserved
                  </a>
                </s.TextDescription> */}
          {/* <ReactPlayer url='https://youtu.be/HgjwmDoPNx4'/> */}
        </s.Container>
      </s.Container>
  </s.Screen>
  );
}

export default App;