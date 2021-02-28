import * as Bones from '../bones'

// export class Entity {
//     constructor(
//         public location: Coordinate)
//     location: Coordinate
//     code: string
//     color: ROTColor
//     bg_color ?: ROTColor
//     entityType: EntityType

import { Coordinate } from "../bones";
import { EntityType } from '../game-enums/enums';

// }
export class Entity {
    public entityType : Bones.Enums.EntityType
    public code: string
    public color: Bones.ROTColor
    public bg_color : Bones.ROTColor

    public location: Coordinate
    public id: number

    constructor(entity_def : IEntityDefinition) {
        this.id = Bones.Utils.generateID()

        this.entityType = entity_def.entityType
        this.color = entity_def.color
        this.bg_color = entity_def.bg_color
        this.code = entity_def.code
    }
}

export interface IEntityDefinition {
    entityType : EntityType
    code : string
    color: Bones.ROTColor
    bg_color? : Bones.ROTColor
}