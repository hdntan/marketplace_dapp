

import React from 'react'
import { Link } from 'react-router-dom'

const NftItem = (data) => {

    const newTo = {
        path:"/nftpage/"+data.data.tokenId
    }
  return (
    <Link to={newTo.path}>
    <div className='w-72 rounded-lg flex flex-col items-center justify-center '>
        <img className='object-cover w-72 h-80 rounded-lg ' src={data.data.image}/>
       
        <div className= "text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
                <strong className="text-xl">{data.data.name}</strong>
                <p className="display-inline">
                    {data.data.description}
                </p>
            </div>
    </div>
    </Link>
    
  )
}

export default NftItem