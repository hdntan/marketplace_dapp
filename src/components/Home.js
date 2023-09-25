import React, { useEffect, useState } from 'react'
import NftItem from './NftItem'
import { ethers } from 'ethers';
import Marketplace from '../Marketplace.json';
import axios from 'axios';

const Home = ({connect = false}) => {

  const sampleItem = [
    {
      "name": "NFT1",
      "description": "hahahahaha",
      "website": "http",
      "image": "https://trainghiemso.vn/wp-content/uploads/2021/08/anh-nen-august-2021-2-800x450.jpg",
      "price": "0.01ETH",
      "currentlySelling":"true",
      "address":"0x0101001"
    },
    {
      "name": "NFT2",
      "description": "hahahahaha",
      "website": "http",
      "image": "https://trainghiemso.vn/wp-content/uploads/2021/08/anh-nen-august-2021-2-800x450.jpg",
      "price": "0.01ETH",
      "currentlySelling":"true",
      "address":"0x0101001"
    },
    {
      "name": "NFT3",
      "description": "hahahahaha",
      "website": "http",
      "image": "https://trainghiemso.vn/wp-content/uploads/2021/08/anh-nen-august-2021-2-800x450.jpg",
      "price": "0.01ETH",
      "currentlySelling":"true",
      "address":"0x0101001"
    }
  ];

  const [items, setItems] = useState(sampleItem);
  const [dataFetched, setDataFetched] = useState(false);


  const getAllItem = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);
    let transaction = await contract.getAllNFTs();
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
  }
  if(!dataFetched) {
   
    getAllItem();

  }


  return (
    <div className='mt-20 flex flex-col items-center justify-center'>

        <div className='font-bold text-xl'>TOP NFTs</div>
        <div className='flex gap-8 mt-5'>
            {
              items.map((item, index) => {
                return <NftItem data={item} key={index}/>
              })
            }
        </div>
    </div>
  )
}

export default Home