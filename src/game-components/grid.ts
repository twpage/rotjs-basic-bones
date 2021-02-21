import { Coordinate } from "./coordinate"
import * as Bones from '../bones'

interface Dict<T> {
    [key: number]: T
}

export class GridOfEntities<T> {

    // things: Dict<ThingInterface> = {}
    things: Dict<T> = {}
    
    clearAll () {
        this.things = {}
    }
    
    clone() : GridOfEntities<T> {
        let new_GoT = new GridOfEntities<T>()
        new_GoT.things = {...this.things}
        return new_GoT
    }
    
    hasAt (xy: Coordinate) : boolean {
        var key = Bones.Utils.xyToKey(xy)
        
        if (key in this.things) {
            return true
        } else { 
            return false
        }
    }
    
    getAt (xy: Coordinate) : T {
        if (this.hasAt(xy)) {
            var key = Bones.Utils.xyToKey(xy)
            return this.things[key]
        } else {
            return null
        }
    }
    
    // setAt (xy: Coordinate, something: Thing) : boolean {
    setAt (xy: Coordinate, something: T) : boolean {
        if (this.hasAt(xy)) {
            return false
        } else {
            var key = Bones.Utils.xyToKey(xy)
            this.things[key] = something
            
            // if its a Thing, set its location on the object as well 
            if (something instanceof Bones.Entities.Entity) {
                (something as any).location = xy
            } 

            // something["location"] = xy

            return true
        }
    }
    
    removeAt (xy: Coordinate) : boolean {
        // returns true if we removed something, false if not
        if (this.hasAt(xy)) {
            var key = Bones.Utils.xyToKey(xy)
            delete this.things[key]
            return true
        } else {
            return false
        }
    }
    
    getAllCoordinates() : Array<Coordinate> {
        let xy: Coordinate
        let numberkey : number
        let coords : Array<Coordinate> = []
        
        for (let key in this.things) {
            numberkey = parseInt(key)
            xy = Bones.Utils.keyToXY(numberkey)
            coords.push(xy)
        }
        
        return coords
    }
    
    getAllThings() : Array<T> {
        let values : Array<T> = []
        for (let key in this.things) {
            values.push(this.things[key])
        }
        
        return values
    }

    getAllItems() : Array<IGridOfEntitiesItem<T>> {
        let xy: Coordinate
        let numberkey : number

        let items : Array<IGridOfEntitiesItem<T>> = []
        for (let key in this.things) {
            numberkey = parseInt(key)
            xy = Bones.Utils.keyToXY(numberkey)
            items.push({
                xy: xy,
                item: this.things[key]
            })
        }

        return items
    } 
}

interface IGridOfEntitiesItem<T> {
    xy: Coordinate,
    item: T
}