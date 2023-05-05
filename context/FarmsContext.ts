import { ethers } from "ethers"
import { createContext } from "react"
import FarmContextInterface from "../types/FarmContextInterface"

const FarmsContext = createContext<FarmContextInterface>({
    lpFarms: null,
    singleStakeFarms: null,
    prices: null,
    initialFetchDone: false
})

export default FarmsContext