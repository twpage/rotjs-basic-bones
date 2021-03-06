import * as Bones from '../bones'
import { TerrainType } from '../game-enums/enums'

export const WALL : Bones.Entities.ITerrainDefinition  = {
    entityType: Bones.Enums.EntityType.Terrain,
    terrainType: TerrainType.WALL,
    code: '#',
    color: Bones.Color.default_fg,
    bg_color: null,
    blocksVision: true,
    blocksWalking: true,
}

export const FLOOR : Bones.Entities.ITerrainDefinition  = {
    entityType: Bones.Enums.EntityType.Terrain,
    terrainType: TerrainType.FLOOR,
    code: '.',
    color: Bones.Color.default_fg,
    bg_color: null,
    blocksVision: false,
    blocksWalking: false,
}
