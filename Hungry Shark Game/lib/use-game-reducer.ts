import { useReducer, ReducerWithoutAction } from 'react';

export type SharkDirection = 'left' | 'right';

export interface Coords {
  x: number;
  y: number;
}

export interface SharkState extends Coords {
  facing: SharkDirection;
}

export type FoodType =
  | 'blowfish'
  | 'crab'
  | 'fish'
  | 'octopus'
  | 'shrimp'
  | 'squid'
  | 'tropical-fish';

export interface FoodState extends Coords {
  id: string;
  type: FoodType;
}

export interface GameState {
  shark: SharkState;
  food: FoodState[];
  score: number;
  timeRemaining: number;
  started: boolean;
}

export type MoveType = 'MOVE_UP' | 'MOVE_DOWN' | 'MOVE_LEFT' | 'MOVE_RIGHT';

export type ActionType = 'INIT' | 'TICK' | MoveType;

export interface Action {
  type: ActionType;
}

export type GameDispatch = (action: Action) => void;

const sharkFoodKeys: FoodType[] = [
  ...arr(5).map((): FoodType => 'fish'),
  ...arr(3).map((): FoodType => 'tropical-fish'),
  ...arr(2).map((): FoodType => 'crab'),
  ...arr(2).map((): FoodType => 'shrimp'),
  ...arr(1).map((): FoodType => 'octopus'),
  ...arr(1).map((): FoodType => 'blowfish'),
  ...arr(1).map((): FoodType => 'squid'),
];

const bottomDwellers: FoodType[] = ['crab', 'octopus', 'shrimp'];

const allSlots: number[] = arr(10).map((_, i) => i);

const initialState: GameState = {
  shark: { x: 1, y: 5, facing: 'right' },
  food: [newFood(allSlots)],
  score: 0,
  timeRemaining: 60,
  started: false,
};

export const useGameState = () => {
  const [state, dispatch] = useReducer(
    gameReducer as ReducerWithoutAction<any>,
    initialState
  );
  return [state as GameState, dispatch as GameDispatch];
};

function gameReducer(state: GameState, action: Action): GameState {
  if (action.type === 'INIT') {
    return initialState;
  }

  // pause game if time runs out
  if (state.timeRemaining === 0) {
    return state;
  }

  // update shark position
  const nextShark = sharkReducer(state.shark, action);

  // update food position on each TICK
  const movedFood =
    action.type === 'TICK' ? state.food.map(moveFoodToTheLeft) : state.food;

  // only keep food that was not eaten
  const survivingFood = movedFood.filter(
    (food) => food.x !== nextShark.x || food.y !== nextShark.y
  );

  // remove food that is now off the grid
  const foodStillOnScreen = survivingFood.filter((food) => food.x >= 0);

  // spawn more food if needed
  const respawnedFood =
    foodStillOnScreen.length < 6
      ? [newFood(availableSlotsForNewFood(nextShark, foodStillOnScreen))]
      : [];

  const nextFood = foodStillOnScreen.concat(respawnedFood);

  // calculate score
  const foodEaten = state.food.length - survivingFood.length;
  const nextScore = state.score + foodEaten;

  // time remaining
  const nextTimeRemaining =
    action.type === 'TICK' ? state.timeRemaining - 1 : state.timeRemaining;

  // state.started is semantically clearer than timeRemaining !== 0
  const nextStarted = Boolean(nextTimeRemaining);

  return {
    shark: nextShark,
    food: nextFood,
    score: nextScore,
    timeRemaining: nextTimeRemaining,
    started: nextStarted,
  };
}

function sharkReducer(sharkState: SharkState, action: Action): SharkState {
  const { x, y } = sharkState;

  switch (action.type) {
    case 'MOVE_UP':
      return {
        ...sharkState,
        y: y > 0 ? y - 1 : y,
      };
    case 'MOVE_DOWN':
      return {
        ...sharkState,
        y: y < 9 ? y + 1 : y,
      };
    case 'MOVE_LEFT':
      return {
        ...sharkState,
        x: x > 0 ? x - 1 : x,
        facing: 'left',
      };
    case 'MOVE_RIGHT':
      return {
        ...sharkState,
        x: x < 9 ? x + 1 : x,
        facing: 'right',
      };
    default:
      return sharkState;
  }
}

function moveFoodToTheLeft(food: FoodState): FoodState {
  return {
    ...food,
    x: food.x - 1,
  };
}

function availableSlotsForNewFood(
  nextShark: SharkState,
  foodStillOnScreen: FoodState[]
): number[] {
  return allSlots.filter((slot) => {
    if (nextShark.x === 9 && nextShark.y === slot) {
      return false;
    }
    if (foodStillOnScreen.some((food) => food.x === 9 && food.y === slot)) {
      return false;
    }
    return true;
  });
}

function newFood(availableSlots: number[] = allSlots): FoodState {
  // only render a bottom dweller if there's a free slot
  const availableTypes = availableSlots.includes(9)
    ? sharkFoodKeys
    : sharkFoodKeys.filter((foodType) => !bottomDwellers.includes(foodType));

  // select one of the available types at random
  const type: FoodType = randomItem(availableTypes);

  // bottomDweller is always at y = 9, else random from available slots
  const isBottomDweller = bottomDwellers.includes(type);
  const y = isBottomDweller
    ? 9
    : randomItem(availableSlots.filter((slot) => slot !== 9));

  const id = `${type}-${Date.now()}`;
  const food: FoodState = { id, x: 9, y, type };
  return food;
}

function randomItem(items: any[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function arr(length: number) {
  return Array.from({ length });
}
