import React, { useState } from 'react'
import { useLocation } from 'react-router';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../pinata';
import Marketplace from '../Marketplace.json';

const UploadNft = () => {

    const [formParams, setFormParams] = useState({name: '', description: '', price: ''});
    const [fileUrl, setFileUrl] = useState(null);
    const ethers = require("ethers");

    const [message, setMessage] = useState('');
    const location = useLocation();
    const [imageBase64, setImageBase64] = useState(null);

    const onChangFile = async(e) => {
        var file = e.target.files[0];
        const reader = new FileReader();
        if(file) reader.readAsDataURL(file);

        reader.onload = (readerEvent) => {
            const file = readerEvent.target.result;
            setImageBase64(file);
        }

        try {
            const response = await uploadFileToIPFS(file);
            if(response.success == true) {
                console.log("Upload image to Pinata", response.pinataURL);
                setFileUrl(response.pinataURL);
            } 
        }
        catch(e) {
            console.log('err upload image', e);
        }
    }

    const uploadMetadataToIPFS = async () => {
        const {name, description, price} = formParams;
        if(!name || !description || ! price|| !fileUrl) {
            return;
        }
        const nftJSON = {
            name, description, price, image: fileUrl
        };

        
        try {

            const  response = await uploadJSONToIPFS(nftJSON);
            if(response.success) {
                console.log("UPLOAD JSON to Pinata", response);
                return response.pinataURL;
            }
            
        } catch (error) {
            console.log("err upload jsonNFT ", error);
        }
    }

    const uploadNft = async (e) => {
        e.preventDefault();

        try {
            const metadataURL = await uploadMetadataToIPFS();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            setMessage("Please wait...");
    
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);
            const price = ethers.utils.parseUnits(formParams.price,'ether');
            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();
            let transaction = await contract.createToken(metadataURL, price, {value: listingPrice });
            await transaction.wait();

            alert("upload success");
            setMessage("");
            setFormParams({name:'', description:'', price:''});
            window.location.replace("/");

        } catch (error) {
            alert("upload error: " + error);
        }
       
    }
    
  return (
    <div className='flex  flex-col items-center justify-center mt-5 gap-8 '>
         <h3>UPLOAD NFT</h3>
        <div className='flex  items-center justify-center border-2  shadow-md rounded px-8 pt-4 pb-8 mb-4'>
        <div className='w-72 rounded-lg '>
       
         <img className='object-cover  w-72 h-80 rounded-lg ' src={imageBase64}/>
            </div>
        <form className=' px-8 pt-4 pb-8 mb-4'>
           
            <div className=''>
           
            <div className='flex flex-col items-start mt-5'>
                <label>NFT name</label>
                <input className='border-2 py-2 px-3 rounded-lg w-full focus:outline-none' type='text' placeholder='Nft#123' value={formParams.name} onChange={e => setFormParams({...formParams,name: e.target.value})}></input>
            </div>
            <div className='flex flex-col items-start mt-5'>
                <label>NFT Description</label>
                <textarea className='border-2 py-2 px-3 rounded-lg w-full focus:outline-none focus:shadow-outline' type='text' cols="40" rows="5" placeholder='Nft#123' value={formParams.description} onChange={e =>setFormParams({...formParams, description: e.target.value})}></textarea>
            </div>
            <div className='flex flex-col items-start mt-5'>
                <label>Price(ETH) </label>
                <input className='border-2 py-2 px-3 rounded-lg w-full focus:outline-none' type='number' placeholder='Nft#123' value={formParams.price} onChange={e => setFormParams({...formParams, price: e.target.value})}></input>
            </div>
            <div className='flex flex-col items-start mt-5'>
                <label>Upload Image </label>
                <input className='file:rounded-lg file:py-1 file:text-white file:bg-blue-500 file:border-transparent file:font-bold py-2  rounded-lg w-full focus:outline-none hover:file:bg-blue-700 file:cursor-pointer' type='file' placeholder='Nft#123' accept='image/png, image/gif, image/jpeg, image/jpg, image/webp'  onChange={onChangFile}></input>
            </div>
           
                <button className='w-full text-white mt-5 border-2 py-2 px-5 border-transparent bg-blue-500 rounded-lg font-bold hover:bg-blue-700' onClick={uploadNft}>UPLOAD</button>
            </div>
            
         
        </form>
        </div>
        
    </div>
  )
}

export default UploadNft