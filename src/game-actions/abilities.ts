import * as ROT from 'rot-js'
import * as Bones from '../bones'
import { Game } from "../game-engine";
import { GameEvent } from "../game-engine/events";
import { Shapes } from '../game-components';
import { VisionSource } from '../game-enums/enums';
import { Combat } from '.';


export function zap(game: Game, initiating_event: GameEvent) : boolean {
    // swap to new location
    let zapper = initiating_event.actor
    let source_xy = zapper.location.clone()
    let dest_xy = initiating_event.eventData.to_xy
    let mob_at = game.current_region.actors.getAt(dest_xy)
    
    return Combat.execAttack(game, zapper, source_xy, dest_xy, mob_at)
}

export function jump(game: Game, initiating_event: GameEvent) : boolean {
    // swap to new location
    let jumper = initiating_event.actor
    let source_xy = jumper.location.clone()
    let dest_xy = initiating_event.eventData.to_xy
    game.current_region.actors.removeAt(source_xy)
    game.current_region.actors.setAt(dest_xy, jumper)
    
    game.display.drawList([source_xy, dest_xy])
    return true
}

export function summonMonsterNearby(game: Game, initiating_event: GameEvent) : boolean {
    let summoner = initiating_event.actor
    let seen_spots_xys = summoner.fov.getAllCoordinatesAndEntities()
    //.filter((xy_entity: ICoordinateAndEntity, idx: number) => {
    seen_spots_xys = seen_spots_xys.filter((xy_entity: typeof seen_spots_xys[0], idx: number) => { return xy_entity.entity == VisionSource.Self })
    seen_spots_xys = ROT.RNG.shuffle(seen_spots_xys)

    let mob = new Bones.Entities.Actor(Bones.Definitions.Actors.MOB)
    game.scheduler.add(mob, true) // need to add to scheduler manually since we already started the region

    game.current_region.actors.setAt(seen_spots_xys[0].xy, mob)
    game.display.drawPoint(seen_spots_xys[0].xy)

    return true
}

export function plantGrass(game: Game, initiating_event: GameEvent) : boolean {
    let loc_xy = initiating_event.actor.location.clone()
    let grass = new Bones.Entities.Terrain(Bones.Definitions.Terrain.GRASS)

    game.current_region.terrain.removeAt(loc_xy)
    game.current_region.terrain.setAt(loc_xy, grass)

    return true
}

export function teleportSelfToRandomSpot(game: Game, initiating_event: GameEvent) : boolean {
    
    // these are spots where we can safely land
    let safe_spot_xys = game.current_region.getWalkableTerrainWithoutActors()
    
    // shuffle them first
    safe_spot_xys = ROT.RNG.shuffle(safe_spot_xys)

    let safe_destination_xy : Bones.Coordinate = safe_spot_xys[0]

    for (let safe_xy of safe_spot_xys) {
        // filter out spots that might be right next to another actor
        let is_next_to_another_actor = false
        let safe_rect = new Shapes.Rectangle(safe_xy.x - 2, safe_xy.y - 2, 4, 4)

        // for (let adj_xy of safe_xy.getAdjacent()) {
        for (let nearby_xy of safe_rect.getAllPoints()) {
            if (game.current_region.actors.hasAt(nearby_xy)) {
                is_next_to_another_actor = true
                break
            }
        }

        if (!(is_next_to_another_actor)) {
            safe_destination_xy = safe_xy
            break
        }
    }
    
    // swap to new location
    let teleportee = initiating_event.actor
    let source_xy = teleportee.location.clone()
    game.current_region.actors.removeAt(source_xy)
    game.current_region.actors.setAt(safe_destination_xy, teleportee)
    
    game.display.drawList([source_xy, safe_destination_xy])

    return true
}