import * as Bones from '../bones'
import { Terrain } from '../game-entities/terrain'
import { GridOfEntities } from './grid'
import { ISize } from './utils'

export class Region {
    public id: number
    public terrain: GridOfEntities<Terrain>

    constructor(public size: ISize, public depth: number) {
        this.id = Bones.Utils.generateID()
        this.terrain = new GridOfEntities<Terrain>()
    }
}

export function regionGenerator(region: Region) {
    
}