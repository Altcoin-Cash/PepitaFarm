import tw from 'twin.macro'
import Stake from '../farms/stake'

import { ethers } from "ethers"
import { useEffect, useState } from 'react'
import InitialPool from '../../../types/InitialPool'
import Farm from '../../../types/Farm'
import Pool from '../../../types/Pool'

interface FarmsProps {
    initialFarms: Farm[]
    tokenPrices: Map<string, ethers.BigNumber>
}

const Farms: React.FC<FarmsProps> = ({ initialFarms, tokenPrices }) => {
    const [farms, setFarms] = useState<Farm[]>(initialFarms)
    const [prices, setPrices] = useState<Map<string, ethers.BigNumber>>(tokenPrices)

    useEffect(() => {
        setFarms(initialFarms)
        setPrices(tokenPrices)
    }, [initialFarms, tokenPrices])

    return (
        <div tw="py-4 px-6 flex flex-shrink-0 flex-wrap items-center justify-evenly">
            {
                farms.map((item, index) => (
                    <div key={index}>
                        <Stake basicInfo={item.basicInfo} pool={item.pool as Pool} prices={prices} />
                    </div>
                ))
            }
        </div>
    )
}

export default Farms
