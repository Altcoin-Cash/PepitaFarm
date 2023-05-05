import { ethers } from "ethers";
import Farm from "./Farm";

interface FarmContextInterface {
    lpFarms: Farm[]
    singleStakeFarms: Farm[]
    prices: Map<string, ethers.BigNumber>
    initialFetchDone: boolean
}

export default FarmContextInterface