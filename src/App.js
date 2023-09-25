import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from './components/Home';
import Profile from './components/Profile';
import NFTpage from './components/NFTpage';
import UploadNft from './components/UploadNft';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';


function App() {

  const [connect, setConnect] = useState(false);
    const [currAddress, setCurrAddress] = useState('');
    const location = useLocation();

    const getAddress = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        console.log('address',addr);
        setCurrAddress(addr);
        setConnect(true);
        console.log("connect here", connect);
    }

    const connectWallet = async() => {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if(chainId !== '0x5')
        {
          //alert('Incorrect network! Switch your metamask network to Rinkeby');
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x5' }],
         })
        }  
        await window.ethereum.request({ method: 'eth_requestAccounts' })
          .then(() => {
          
            console.log("here");
            getAddress();
           
            window.location.replace(location.pathname)
          });
    }

    useEffect(() => {
        if(window.ethereum == undefined)
          return;
        let val = window.ethereum.isConnected();
        if(val)
        {
          console.log("here");
          getAddress();
          // setConnect(val);
    
        }
    
        window.ethereum.on('accountsChanged', function(accounts){
          window.location.replace(location.pathname)
        })
      });
  
      if(!connect) return (
        <div className="App">
     
      <Navbar connectUser={connectWallet} userAddress={currAddress}/>
      </div>
      )
  return (
    <div className="App">
     
      <Navbar connectUser={connectWallet} userAddress={currAddress}/>
      
<Routes>
        <Route path='/' element={<Home connect={connect}/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/nftpage/:tokenId' element={<NFTpage/>}/>
        <Route path='/uploadnft' element={<UploadNft/>}/>



      </Routes>
    
        
      
       
     
     
    </div>
  );
}

export default App;
