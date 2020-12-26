import {offline} from './firebase';
import battle from './battle';
import demoGame from './demoGame';
import demoUser, {getUser as _demoGetUser} from './demoUser';
import demoPuzzlelist from './demoPuzzlelist';
import demoComposition from './demoComposition';
import game from './game';
import user from './user';
import puzzlelist from './puzzlelist';
import puzzle from './puzzle';
import composition from './composition';
import {getUser as _getUser} from './user';

export const BattleModel = battle;
export const GameModel = offline ? demoGame : game;
export const UserModel = offline ? demoUser : user;
export const PuzzlelistModel = offline ? demoPuzzlelist : puzzlelist;
export const PuzzleModel = puzzle;

export const getUser = offline ? _demoGetUser : _getUser;
export const CompositionModel = offline ? demoComposition : composition;
