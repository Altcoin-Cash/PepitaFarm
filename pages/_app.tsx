import { GlobalStyles } from 'twin.macro'
import '../styles/globals.css'
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import getWeb3Provider from '../helpers/web3/getWeb3Provider'
import FarmsContext from '../context/FarmsContext'
import getInitialPools from '../helpers/getInitialPools'
import FarmContextInterface from '../types/FarmContextInterface'
import { useState, useEffect } from 'react'
import Farm from '../types/Farm'
import getDummyPools from '../helpers/getDummyPools'
import farmsdata from '../data/farms.data'
import { stakesdata } from '../data/stakes.data'
import InitialPool from '../types/InitialPool'
import getUpdatedPrices from '../helpers/getUpdatedPrices'
import { ethers } from 'ethers'
import Pool from '../types/Pool'

function MyApp({ Component, pageProps }) {
  const [dummyLpFarms, setDummyLpFarms] = useState<Farm[]>(getDummyPools(farmsdata))
  const [dummySingleFarms, setDummySingleFarms] = useState<Farm[]>(getDummyPools(stakesdata))

  const [lpFarms, setLpFarms] = useState(null)
  const [singleStakeFarms, setSingleStakeFarms] = useState(null)
  const [prices, setPrices] = useState(null)

  const [farmContext, setFarmContext] = useState<FarmContextInterface>(createFarmContextValue())

  useEffect(() => {
    getInitialPools().then(initialPools => {
      console.log("Got initial pools")

      const tokens = initialPools.map(p => p.stakedToken)
      getUpdatedPrices(tokens).then(priceArray => {
        const pools = initialPools.map(ip => ip.toPool())
        const mappedLpFarms = dummyLpFarms.map(farm => mapInitialPoolToFarm(farm, pools))
        const mappedSingleFarms = dummySingleFarms.map(farm => mapInitialPoolToFarm(farm, pools))

        setLpFarms(mappedLpFarms)
        setSingleStakeFarms(mappedSingleFarms)

        setPrices(priceArray)

        const farmContextValue = createFarmContextValue(mappedLpFarms, mappedSingleFarms, priceArray, true)
        setFarmContext(farmContextValue)

        console.log("Farm context value", farmContextValue)
      })
    })
  }, [])

  function createFarmContextValue(
    lps: Farm[] = lpFarms,
    singles: Farm[] = singleStakeFarms,
    pricesArray: Map<string, ethers.BigNumber> = prices,
    done: boolean = false
  ): FarmContextInterface {

    const value: FarmContextInterface = {
      lpFarms: lps,
      singleStakeFarms: singles,
      prices: pricesArray,
      initialFetchDone: done
    }

    return value
  }


  const mapInitialPoolToFarm = (farm: Farm, pools: Pool[]): Farm => {
    const farmStakeToken = farm.basicInfo.lpTokenAddress.toLowerCase()
    const farmPool = pools.find(pool => pool.stakedToken.address.toLowerCase() === farmStakeToken)
    farm.pool = farmPool
    return farm
  }

  return (
    <>
      <Web3ReactProvider getLibrary={getWeb3Provider}>
        <GlobalStyles />
        <FarmsContext.Provider value={farmContext}>
          <Component {...pageProps} />
        </FarmsContext.Provider>
      </Web3ReactProvider>
    </>
  )
}

export default MyApp
