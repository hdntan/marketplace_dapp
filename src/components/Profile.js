import { ethers } from 'ethers';
import React, { useState } from 'react';
import Marketplace from '../Marketplace.json';
import axios from 'axios';
import NftItem from './NftItem';

const Profile = () => {

  const [address, setAddress] = useState('0x');
  const [balance, setBalance] = useState(0);

 

  const [items, setItems] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);


  const getAllItem = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const balanceOf = await signer.getBalance();
    const addr = await signer.getAddress();
    let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);
    let transaction = await contract.getMyNFTs();
   const items = await Promise.all(transaction.map(async i => {
    const tokenURI = await contract.tokenURI(i.tokenId);
    let metadata = await axios.get(tokenURI);
    console.log('metadata', metadata, i.tokenId);

    let price = ethers.utils.formatUnits(i.price.toString(),'ether');
    let item = {
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      image: metadata.data.image,
      name: metadata.data.name,
      description: metadata.data.description,
    };
    console.log('item', item);
    return item;
   }));
   setDataFetched(true);
   setItems(items);
   setAddress(addr);
  //  setBalance( balanceOf);

  }
  if(!dataFetched)
  getAllItem();


  return (
    <div className='w-screen mt-10'>
      <div className='flex flex-col  items-center justify-center border-2 h-[200px] mx-20'>
      <h2 className="font-bold">Wallet Address</h2>  
                    {address}

        <div className='flex gap-8 mt-10'>
          <div>
          <h2 className="font-bold">Total Item</h2>  
                    {balance}
          </div>
         

          <div>
          <h2 className="font-bold">Balance</h2>  
                    {balance}
          </div>
        </div>
        

      </div>
      <div className='mt-10'>
        <div>MY NFT</div>
        <div className='flex gap-8 mt-5 items-center justify-center mb-20'>
            {
              items.map((item, index) => {
                return <NftItem data={item} key={index}/>
              })
            }
        </div>
      </div>
    </div>
  )
}

export default Profile