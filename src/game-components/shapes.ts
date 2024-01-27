import { Coordinate } from "./coordinate"

export enum WallSide {
    Top = 1,
    Bottom,
    Right,
    Left,
}

export class Rectangle {
    id: number
    constructor(public x: number, public y: number, public width: number, public height : number) {
        // this.id = generateID()
    }

    right() : number {
        return this.x + this.width - 1
    }

    bottom(): number {
        return this.y + this.height - 1
    }

    left(): number { return this.x }
    top(): number { return this.y }
    
    area(): number { return this.width * this.height }

    getPerimeterSide(xy: Coordinate) : WallSide {
        if (xy.x == this.left()) { 
            return WallSide.Left
        } else if (xy.x == this.right()) {
            return WallSide.Right
        } else if (xy.y == this.top()) {
            return WallSide.Top
        } else if (xy.y == this.bottom()) {
            return WallSide.Bottom
        } else {
            return null
            // throw new Error(`${xy.toString()} not a wall coordinate`)
        }
    }

    isPointInside(xy: Coordinate) : boolean {
        return ((xy.x > this.x) && (xy.x < this.right()) && (xy.y > this.y) && (xy.y < this.bottom()))
    }

    // isPointInside(xy: Coordinate) : boolean {
    //     return ((xy.x >= this.x) && (xy.x <= this.right()) && (xy.y >= this.y) && (xy.y <= this.bottom()))
    // }

    checkIntersection_Strict(other_rect: Rectangle) : boolean {
        if (
            (this.right() < other_rect.left()) ||
            (other_rect.right() < this.left()) ||
            (this.bottom() < other_rect.top()) ||
            (other_rect.bottom() < this.top())
        ) {
            return false
        } else {
            return true
        }
    }

    checkIntersection_AllowPerimeter(other_rect: Rectangle) : boolean {
        if (
            (this.right() <= other_rect.left()) ||
            (other_rect.right() <= this.left()) ||
            (this.bottom() <= other_rect.top()) ||
            (other_rect.bottom() <= this.top())
        ) {
            return false
        } else {
            return true
        }
    }

    // checkOverlap(other_rect : Rectangle) : boolean {
    //     return this.getCorners().some((xy) => {
    //         return other_rect.isPointInside(xy)
    //     })
    // }
    
    contains(other_rect: Rectangle) : boolean {
        return other_rect.getCorners().every((xy) => {
            return this.isPointInside(xy)
        })
    }

    getPerimeter() : Array<Coordinate> {
        let walls : Array<Coordinate> = []
        for (let x = 0; x < this.width; x++) {
            walls.push(new Coordinate(x + this.x, this.y))
            walls.push(new Coordinate(x + this.x, this.bottom()))
        }

        for (let y = 1; y < this.height - 1; y++) {
            walls.push(new Coordinate(this.x, y + this.y))
            walls.push(new Coordinate(this.right(), y + this.y))
        }

        return walls
    }

    getInterior() : Array<Coordinate> {
        let floors : Array<Coordinate> = []
        for (let x = this.x + 1; x < this.right(); x++) {
            for (let y = this.y + 1; y < this.bottom(); y++) {
                floors.push(new Coordinate(x, y))
            }
        }
        return floors
    }

    getAllPoints(): Array<Coordinate> {
        return this.getInterior().concat(this.getPerimeter())
    }
    
    getCorners() : Array<Coordinate> {
        return [
            new Coordinate(this.x, this.y),
            new Coordinate(this.x, this.bottom()),
            new Coordinate(this.right(), this.y),
            new Coordinate(this.right(), this.bottom()),
        ]
    }

    isCorner(xy: Coordinate) : boolean {
        let corners = this.getCorners()
        return corners.some((corner_xy) => {
            return (corner_xy.compare(xy))
        })
    }

    getPerimeter_NoCorners() : Array<Coordinate> {
        return this.getPerimeter().filter((xy) => {
            return (!(this.isCorner(xy)))
        })
    }

    shiftByOffset (offset_xy: Coordinate) : Rectangle {
        let top_y = this.top()
        let left_x = this.left()
        let w = this.width
        let h = this.height

        let shift_rect = new Rectangle(
            left_x - offset_xy.x,
            top_y - offset_xy.y,
            w,
            h
        )

        return shift_rect
    }

    equalTo (other_rect: Rectangle) : boolean {
        return (
            (this.x == other_rect.x) && 
            (this.y == other_rect.y) &&
            (this.width == other_rect.width) &&
            (this.height == other_rect.height)
        )
    }

    getCenter () : Coordinate {
        // warning: does not convert to integers
        return new Coordinate(this.x + (this.width / 2), this.y + (this.height / 2))
    }
}