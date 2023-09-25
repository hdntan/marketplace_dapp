import React, { useState } from 'react'
import { useParams } from 'react-router';
import banner from '../bg.jpg'
import { ethers } from 'ethers';
import Marketplace from '../Marketplace.json';
import axios from 'axios';

const NFTpage = (props) => {

  const {tokenId} = useParams();
  const [data, updateData] = useState({});
  const [dataFetched, updateDataFetched] = useState(false);
  const [message, updateMessage] = useState("");
  const [currAddress, updateCurrAddress] = useState("0x");

  const getNftById =async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addr =await signer.getAddress();
      let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);
      let listedToken = await contract.getListedTokenForId(tokenId);
      console.log('item by id', listedToken.owner);
      const tokenURI = await contract.tokenURI(tokenId);
      let metadata = await axios.get(tokenURI);
      console.log('metadata', metadata, tokenId);
  
      let price = ethers.utils.formatUnits(listedToken.price.toString(),'ether');
  
      
      let item = {
        price: price,
        tokenId: tokenId,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: metadata.data.image,
        name: metadata.data.name,
        description: metadata.data.description,
    }
    updateData(item);
    updateDataFetched(true);
    updateCurrAddress(addr);
  
     
      
      
    } catch (error) {
      
    }
  }

  const buyNft = async() => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);
      const salePrice = ethers.utils.parseUnits(data.price, 'ether');
      let transaction = await contract.executeSale(tokenId, {value:salePrice});
      await transaction.wait();
      alert('You successfully bought the NFT!');
    } catch (error) {
      alert("Buy Error",error);
    }
   
  }

  if(!dataFetched) getNftById();

  return (
    <div >
           
            <div className="flex ml-20 justify-center mt-20">
                <img src={data.image} alt="" className="w-2/5" />
                <div className="text-xl ml-20 space-y-8 shadow-2xl rounded-lg border-2 p-5 flex flex-col items-start justify-center">
                    <div>
                        Name: {data.name}
                    </div>
                    <div>
                        Description: {data.description}
                    </div>
                    <div>
                        Price: <span className="">{data.price + " ETH"}</span>
                    </div>
                    <div>
                        Owner: <span className="text-sm">{data.owner}</span>
                    </div>
                    <div>
                        Seller: <span className="text-sm">{data.seller}</span>
                    </div>
                    <div>
                    { currAddress != data.owner && currAddress != data.seller ?
                        <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={buyNft} >Buy this NFT</button>
                        : <div className="text-emerald-700">You are the owner of this NFT</div>
                    }
                    
                    <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default NFTpage