import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

export const StyledNumberInput = styled.input.attrs((props) => ({
  type: 'number',
  min: 1,
  max: 20,
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
  -webkit-box-shadow: 2px 3px 10px -2px rgba(0, 0, 0, .5);
  -moz-box-shadow: 2px 8px 4px -2px rgba(0, 200, 250, 0.1);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :hover {
    -webkit-box-shadow: 0px 0px 10px -2px rgba(0, 255, 200, 1.0);
  }
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

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
  const [mintQuantity, setMintQuantity] = useState(1)

  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback("");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, _amount)
      .send({
        // gasLimit: "2500000",
        to: "0x7385675B374824DAa3d7f915716C58D090B9EF0f",
        from: blockchain.account,
        value: blockchain.web3.utils.toWei(( .07 * _amount).toString(), "ether"),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          <s.TextDescription style={{ textAlign: "center" }}>
                  Mint Successful! Your NFT can be seen at {" "}
                  <a
                    target={""}
                    href={"https://opensea.io/collection/officers-club"}
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
          
        </s.TextTitle>
        <ResponsiveWrapper flex={10} style={{ padding: 0 }}>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <s.TextTitle
              style={{ textAlign: "center", fontSize: 26, fontWeight: "bold" }}

            >
              {data.totalSupply}/10000
            </s.TextTitle>
          </s.Container>
          <s.Container
            flex={10}
            jc={"center"}
            ai={"center"}
            style={{ backgroundColor: "#000000", padding: 20 }}
          >
            {Number(data.totalSupply) == 10000 ? (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>
                SOLD OUT!
                </s.TextTitle>
                <s.TextDescription style={{ textAlign: "center" }}>
                  You can still trade at {" "}
                  <a
                    target={""}
                    href={"https://opensea.io/collection/officers-club"}
                  >
                    Officer's Club NFT Collection
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
                      {claimingNft ? "Busy..." : `Purchase ${mintQuantity} OC NFT`}
                    </StyledButton>
                  </s.Container>
                )}
              </>
            )}
          </s.Container>
        </ResponsiveWrapper>
      </s.Container>
  </s.Screen>
  );
}

export default App;