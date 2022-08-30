import { useState } from "react";
import arrow from "../public/images/right-arrow.png";
import datacopy from "../public/images/datacopy.png";

let puid;
const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [disabled1, setDisabled] = useState("disabled");

  const api_key = "VgJrFKlks6HR78eXAzpoXZk2MEiulhme";

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");

    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;
    var requestOptions = {
      method: "GET",
    };
    let fetchURL = `${baseURL}?owner=${wallet}`;
    if (collection.length) {
      console.log("fetching nfts for collection owned by address");
      fetchURL = `${fetchURL}&contractAddresses%5B%5D=${collection}`;
    }
    if (puid) {
      fetchURL = `${fetchURL}&pageKey=${puid}`;
      console.log(fetchURL);
    }
    nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    puid = nfts.pageKey;
    if (puid) {
      setDisabled("");
    } else {
      setDisabled("disabled");
    }
    if (nfts) {
      console.log("nfts:", nfts);
      setNFTs(nfts.ownedNfts);
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };

      const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`;
      var fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;

      if (puid) {
        fetchURL = `${fetchURL}&startToken=${puid}`;
        console.log(fetchURL);
      }
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      puid = nfts.nextToken;
      if (puid) {
        setDisabled("");
      } else {
        setDisabled("disabled");
      }
      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts);
      }
    }
  };

  const NFTCard = ({ nft }) => {
    const fcopy = () => {
      var copyText = nft.contract.address;
      navigator.clipboard.writeText(copyText);
      alert("Copied address");
    };
    let id1 = parseInt(nft.id.tokenId);

    return (
      <div className="w-1/4 flex flex-col ">
        <div className="rounded-md">
          <img
            className="object-cover h-128 w-full rounded-t-md"
            src={nft.media[0].gateway}
          ></img>
        </div>
        <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
          <div className="">
            <h2 className="text-xl text-gray-800">{nft.title}</h2>
            <p className="text-gray-600">Id: {id1}</p>
            <p className="text-gray-600">{nft.contract.address}</p>
            <div className="group relative w-6">
              <button
                onClick={() => {
                  fcopy();
                }}
              >
                <img className={"w-full"} src={datacopy.src} />
                <div class="opacity-0 group-hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-xs text-cyan-500 font-semibold">
                  copy address
                </div>
              </button>
            </div>
          </div>
          <div className="flex-grow mt-2">
            <p className="text-gray-600">{nft.description}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          className="w-1/5"
          disabled={fetchForCollection}
          type={"text"}
          placeholder="Add your wallet address"
          onChange={(e) => setWalletAddress(e.target.value)}
          value={wallet}
        ></input>
        <input
          className="w-1/5"
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={"text"}
          placeholder="Add the collection address"
        ></input>
        <button
          onClick={() => {
            setCollectionAddress("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d");
            collection = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";
            console.log(collection);
            if (fetchForCollection === false) {
              document.getElementById("c1").click();
            }
            puid = undefined;
            setDisabled("disabled");
            fetchNFTsForCollection();
          }}
        >
          Bored Ape Yacht Club
        </button>
        <label className="text-gray-600 ">
          <input
            id="c1"
            onChange={(e) => {
              setFetchForCollection(e.target.checked);
            }}
            type={"checkbox"}
            className="mr-2"
          ></input>
          Fetch for collection
        </label>
        <div className="flex flex-col w-full justify-center items-center gap-y-2">
          <button
            className={
              "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
            }
            onClick={() => {
              puid = undefined;
              setDisabled("disabled");
              if (fetchForCollection) {
                fetchNFTsForCollection();
              } else fetchNFTs();
            }}
          >
            Let's go!{" "}
          </button>
          <button
            id="button_arrow"
            className="disabled:opacity-30 w-12"
            onClick={() => {
              if (fetchForCollection) {
                fetchNFTsForCollection();
              } else fetchNFTs();
            }}
            disabled={disabled1}
          >
            {" "}
            <div className="group relative w-12">
              <img className={"w-full"} src={arrow.src}></img>
              <div className="opacity-0 group-hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-fuchsia-400">
                next page
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {NFTs.length &&
          NFTs.map((nft) => {
            return <NFTCard nft={nft}></NFTCard>;
          })}
      </div>
    </div>
  );
};

export default Home;
