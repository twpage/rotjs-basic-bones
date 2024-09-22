import * as ROT from 'rot-js/lib/index'
import { Coordinate } from './coordinate'

let MAX_GRID_SIZE = 1024

function isInteger (value: number) : boolean {
    return typeof value === 'number' && 
        isFinite(value) && 
        Math.floor(value) === value
}

export function xyToKey(xy: Coordinate) : number {
    return (xy.y * MAX_GRID_SIZE) + xy.x
} 

export function keyToXY(key: number) : Coordinate {
    // return new Coordinate(key % MAX_GRID_SIZE, Math.floor(key / MAX_GRID_SIZE))
    return new Coordinate(ROT.Util.mod(key, MAX_GRID_SIZE), Math.floor(key / MAX_GRID_SIZE))
}

export function x_and_yToKey(x : number, y: number) : number {
    return (y * MAX_GRID_SIZE) + x
} 

let init_id = 1000
export function generateID() : number {
    init_id += 1
    return init_id
}

export interface ISize {
    width: number
    height: number
}

export function dist2d(from_xy: Coordinate, to_xy: Coordinate) : number {
    let xdiff = (from_xy.x - to_xy.x)
    let ydiff = (from_xy.y - to_xy.y)
    
    return Math.sqrt(xdiff*xdiff + ydiff*ydiff)
}

// export function mod(m: number, n: number) : number {
//     return ((m % n) + n) % n
// }

export function getLineBetweenPoints (start_xy: Coordinate, end_xy: Coordinate) : Array<Coordinate> { 
    // uses bresenham's line algorithm

    if ((!(start_xy)) || (!(end_xy))) {
        console.error("invalid coords passed to getLineBetweenPoints")
    }

    let non_integer = [start_xy.x, start_xy.y, end_xy.x, end_xy.y].some((coord_value: number) => {
        return (!(isInteger(coord_value)))
    })

    if (non_integer) {
        console.error("non-integer coordinates passed in")
    }
        
    // Bresenham's line algorithm
    let x0 : number = start_xy.x
    let y0 : number = start_xy.y
    let x1 : number = end_xy.x
    let y1 : number = end_xy.y

    let dy = y1 - y0
    let dx = x1 - x0
    let t = 0.5
    let points_lst = [new Coordinate(x0, y0)]
    let m : number
    
    if (start_xy.compare(end_xy)) {
        return points_lst
    }
    
    if (Math.abs(dx) > Math.abs(dy)) {
        m = dy / (1.0 * dx)
        t += y0
        if (dx < 0) {
            dx = -1
        } else {
            dx = 1
        }
        
        m *= dx

        while (x0 != x1) {
            x0 += dx
            t += m
            // points_lst.push({x: x0, y: Math.floor(t)}) # Coordinates(x0, int(t)))
            points_lst.push(new Coordinate(x0, Math.floor(t)))
        }
    } else {
        m = dx / (1.0 * dy)
        t += x0
        
        // dy = if (dy < 0) then -1 else 1
        if (dy < 0) {
            dy = -1 
        } else {
            dy = 1
        }
        
        m *= dy
        
        while (y0 != y1) {
            y0 += dy
            t += m
            // points_lst.push({x: Math.floor(t), y: y0}) # Coordinates(int(t), y0))
            points_lst.push(new Coordinate(Math.floor(t), y0))
        }
    }
    
    return points_lst
}