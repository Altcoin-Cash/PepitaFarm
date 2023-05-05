import { ethers } from "ethers"
import LpToken from "./LpToken"
import Pool from "./Pool"
import Token from "./Token"

class InitialPool {
  stakedToken: Token | LpToken
  allocationPoints: number
  fee: number
  pid: number
  masterChad: ethers.Contract

  constructor(stakedToken: Token | LpToken, allocationPoints: number, pid: number, fee: number, masterChad: ethers.Contract) {
    this.stakedToken = stakedToken
    this.allocationPoints = allocationPoints
    this.masterChad = masterChad
    this.pid = pid
    this.fee = fee
  }

  toPool(): Pool {
    return new Pool(
      this.stakedToken,
      this.allocationPoints,
      this.pid,
      this.fee,
      this.masterChad
    )
  }
}

export default InitialPool