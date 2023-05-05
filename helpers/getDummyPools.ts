import Farm from "../types/Farm"
import InitialPool from "../types/InitialPool"

const getDummyPools = (farmsData): Farm[] => {
  const dummyPools = []
  for (const farm of farmsData) {
      dummyPools.push({
          basicInfo: {
              first: farm.first,
              second: farm.second ?? null,
              approved: farm.approved,
              earn: farm.earn,
              pid: farm.pid,
              lpTokenAddress: farm.lpTokenAddress,
              getLP: farm.getLP
          },
          pool: new InitialPool(null, -1, farm.pid, -1, null)
      })
  }

  return dummyPools
}

export default getDummyPools 