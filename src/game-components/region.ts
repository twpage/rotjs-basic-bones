import * as ROT from 'rot-js'
import * as Bones from '../bones'
import { Actor } from '../game-entities'
import { Terrain } from '../game-entities/terrain'
import { EntityType } from '../game-enums/enums'
import { GridOfEntities } from './grid'
import { ISize } from './utils'

export class Region {
    public id: number
    public terrain: GridOfEntities<Terrain>
    public actors: GridOfEntities<Actor>
    public start_xy : Bones.Coordinate

    constructor(public size: ISize, public depth: number) {
        this.id = Bones.Utils.generateID()
        this.terrain = new GridOfEntities<Terrain>()
        this.actors = new GridOfEntities<Actor>()

        regionGenerator(this)
    }
}

function regionGenerator(region: Region) {
    // generate terrain
    // keep track of safe terrain while we generate
    let safe_xys : Bones.Coordinate[] = []

    let callback = (x: number, y: number, value: number) => {
        let xy = new Bones.Coordinate(x, y)
        let terrain : Bones.Entities.Terrain
        if (value == 1) {
            terrain = new Bones.Entities.Terrain({entityType: EntityType.Terrain, code: '#', color: Bones.Color.default_fg})
        } else {
            terrain = new Bones.Entities.Terrain({entityType: EntityType.Terrain, code: '.', color: Bones.Color.default_fg})
            safe_xys.push(xy)
        }

        region.terrain.setAt(xy, terrain)
    }
    let d = new ROT.Map.Digger(region.size.width, region.size.height)
    d.create(callback)

    // shuffle our safe spaces first
    safe_xys = ROT.RNG.shuffle(safe_xys)

    // set a safe spot for the player
    region.start_xy = safe_xys.pop()

    // add some mobs
    for (let i = 0; i < 2; i++) {
        let mob = new Bones.Entities.Actor(`mob_{$i}`, false, {entityType: EntityType.Actor, code: 'x', color: Bones.Color.black})
        let safe_xy = safe_xys.pop()
        region.actors.setAt(safe_xy, mob)
    }

    return true
}