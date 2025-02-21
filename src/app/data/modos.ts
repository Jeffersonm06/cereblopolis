export const modes: Modo[] = [
    {
        name: "Temporizado",
        icon: "stopwatch-outline",
        type: "single-player"
    },
    {
        name: "Livre",
        icon: "leaf-outline",
        type: "single-player"
    },
    {
        name: "Mata Mata",
        icon: "skull",
        type: "single-player"
    },
    {
        name: "Temporizado",
        icon: "stopwatch-outline",
        type: "multplayer"
    },
    {
        name: "Livre",
        icon: "leaf-outline",
        type: "multplayer"
    },
    {
        name: "Mata Mata",
        icon: "skull",
        type: "multplayer"
    },
    {
        name: "Bate e volta",
        icon: "swap-horizontal",
        type: "multplayer"
    },
]

export interface Modo {
    name: string,
    icon: string,
    type: 'single-player' | 'multplayer'
}