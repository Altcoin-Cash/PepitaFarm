import Pool from './Pool'
import BasicInfo from "./BasicInfo"
import InitialPool from './InitialPool'

interface Farm {
  basicInfo: BasicInfo,
  pool: InitialPool | Pool
}

export default Farm