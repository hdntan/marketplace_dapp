

import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({connectUser, userAddress}) => {
    const [connect, setConnect] = useState(false);
    const [currAddress, setCurrAddress] = useState('');
    const location = useLocation();

    // const getAddress = async() => {
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const signer = provider.getSigner();
    //     const addr = await signer.getAddress();
    //     console.log('address',addr);
    //     setCurrAddress(addr);
    // }

    // const connectWallet = async() => {
    //     const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    //     if(chainId !== '0x5')
    //     {
    //       //alert('Incorrect network! Switch your metamask network to Rinkeby');
    //       await window.ethereum.request({
    //         method: 'wallet_switchEthereumChain',
    //         params: [{ chainId: '0x5' }],
    //      })
    //     }  
    //     await window.ethereum.request({ method: 'eth_requestAccounts' })
    //       .then(() => {
          
    //         console.log("here");
    //         getAddress();
    //         window.location.replace(location.pathname)
    //       });
    // }

    // useEffect(() => {
    //     if(window.ethereum == undefined)
    //       return;
    //     let val = window.ethereum.isConnected();
    //     if(val)
    //     {
    //       console.log("here");
    //       getAddress();
    //       setConnect(val);
    
    //     }
    
    //     window.ethereum.on('accountsChanged', function(accounts){
    //       window.location.replace(location.pathname)
    //     })
    //   });
    
  return (
    <div className=''>
        <nav className="w-screen">
            <ul className="flex items-end justify-between py-3 pr-5">
                <li className='flex items-end'>
                    <div className='font-bold ml-2 text-xl'>NFT MARKET</div>
                    <div className='font-bold ml-2 text-xl'>{userAddress !=='' ? userAddress :'0x'}</div>

                </li>
                <li className='w-2/6'>
                    <ul className='flex items-end justify-between font-bold mr-10 text-lg '>
                        {
                            location.pathname ==="/" ? 
                            
                            
                            <li className='border-b-2  p-2'>
                                <Link to="/"> Marketplace</Link>
                            </li>

                            :
                            <li className='hover:border-b-2  p-2'>
                                <Link to="/"> Marketplace</Link>
                            </li>
                        }

                        {
                            location.pathname ==="/nftpage" ? 
                            <li className='border-b-2  p-2'>
                            <Link to="/nftpage">List My NFT</Link>
                        </li>
                        :
                        <li className='hover:border-b-2  p-2'>
                            <Link to="/uploadnft">List My NFT</Link>
                        </li>
                        }
                       
                       {
                        location.pathname ==="/profile" ? 
                        <li className='border-b-2  p-2'>
                            <Link to="/profile">Profile</Link>
                        </li>
                        :
                        <li className='hover:border-b-2  p-2'>
                            <Link to="/profile">Profile</Link>
                        </li>
                       }
                         <li>

                            {currAddress == null?   <button className='border-2 py-2 px-4 text-sm text-white font-bold cursor-pointer rounded-md bg-blue-500 hover:bg-blue-700 border-transparent' onClick={connectUser}>Connect Wallet </button>
                            :
                            <div className='flex justify-center items-center w-10 h-10 py-2 px-4 text-sm text-white font-bold cursor-pointer rounded-full bg-green-500 hover:bg-blue-700 border-transparent'> 
                            <p>A</p> </div>

                            }
                    
                </li>
                        
                    </ul>
                </li>
              
               
            </ul>
        </nav>
    </div>
  )
}

export default Navbar