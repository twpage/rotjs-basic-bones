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

// }
export class Entity {
    public location: Coordinate
    public bg_color : Bones.ROTColor
    public id: number

    constructor(
        public entityType : Bones.Enums.EntityType,
        public code: string,
        public color: Bones.ROTColor,
    ) {
        this.id = Bones.Utils.generateID()
    }
}