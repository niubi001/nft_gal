import datacopy from "../public/images/datacopy.png";

export default NFTCard = ({ nft }) => {
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
