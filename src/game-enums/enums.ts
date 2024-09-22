export enum EventType {
    NONE,
    WAIT,
    ATTEMPT_MOVE,
    MOVE,
    ATTACK,
    GAMETICK,
    DEMO_FANCY,
    DEMO_EXTRA_FANCY,
    DEMO_NOTURNCOUNT,
    
    MENU_START,
    MENU_CANCEL,
    MENU_UPDATE,
    MENU_SELECT,

    TARGETING_START,
    TARGETING_UPDATE,
    TARGETING_CANCEL,
    TARGETING_SELECT,
    TARGETING_ERROR,
    
    // START_GAME,
    // QUIT_GAME,

    ABILITY_PLANT,
    ABILITY_SUMMON,
    ABILITY_TELEPORT,
    ABILITY_ZAP,
    ABILITY_JUMP,

    ANIMATION,

    GAME_NEW,
}

export enum AnimationType {
    PATH,
    FLASH,
}

export enum MenuType {
    PLAYER_ABILITIES,
    GAME_CONFIG,
    GAME_INTRO,
}

export enum EntityType {
    Terrain,
    AnimationBlip,
    Actor
}

export enum TerrainType {
    WALL,
    FLOOR,
    GRASS,
}

export enum ActorType {
    HERO,
    ARCHITECT,
    MOB,
}

export enum VisionSource {
    NoVision,
    Self,
    Remote,
}

export enum UI { // translates from physical input into 'game speak'
    ERROR,
    UP,             // default WASD, Arrow keys, Gamepad 4-dir pad
    DOWN,
    LEFT,
    RIGHT,
    CONFIRM_ACTION, // default SPACE/ENTER or 'A' button
    NEXT_SECONDARY, // default e or 'X' button
    CANCEL_BACK,    // default ESC/q or 'B' button
    PLAYER_MENU,    // default i or 'Y' button
    GAME_MENU,      // default / or ? or START button
}

export enum GameState {
    INTRO_MENU,
    GAME_CORE,
    GAME_TARGETING,
    GAME_MENU,
}
