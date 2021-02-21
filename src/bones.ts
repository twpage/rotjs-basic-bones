import * as Engine from './game-engine' 
export { Engine }

// import * as Components from './game-components'
// export { Components }
import { Coordinate, Directions } from './game-components'
export { Coordinate }
export { Directions }

import * as Utils from './game-components/utils'
export { Utils }

import * as Color from './game-components/color'
export { Color }

import * as Enums from './game-enums/enums'
export { Enums }

import * as Entities from './game-entities'
export { Entities }

export type ROTColor = [number, number, number]
export * as Config from './config'
