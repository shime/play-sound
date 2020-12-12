import {ChildProcess} from "child_process";

type Players =
    'mplayer' |
    'afplay' |
    'mpg123' |
    'mpg321' |
    'play' |
    'omxplayer' |
    'aplay' |
    'cmdmp3';

interface PlayOpts {
    players: Players[];
    player: Players;
}

type PlayMethodOptions = Partial<{
    [key in Players]: Array<string | number>;
} & {
    timeout: number;
}>;

declare class Play {
    constructor(opts?: Partial<PlayOpts>);

    player: unknown;
    players: Players[];
    urlRegex: RegExp;

    play(what: string, options?: PlayMethodOptions, next?: (err: Error) => void): ChildProcess;
    play(what: string, next?: Function): ChildProcess;

    test( next?: (err: Error) => void): ChildProcess;
}

declare function defaultExport(opts?: Partial<PlayOpts>): Play;

export = defaultExport;
