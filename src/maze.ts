import shuffleArray from './utils/shuffleArray';
import randomNumber from './utils/randomNumber';
const {columns, rows} = process.stdout;

export enum MazeStructures {
  WALL,
  ENTRY,
  EXIT,
  PATH,
  CHECKED,
  WALKED,
  NEXT
}

export type NodePosition = [number, number]

export default class MazeBuilder {
  cols: number;
  rows: number;
  maze: MazeStructures[][];
  entry: NodePosition;
  exit: NodePosition;

  constructor(
    public width = Math.floor(columns/4)-1,
    public height = Math.floor(rows/2)-1,
  ) {
    this.width = width;
    this.height = height;

    this.cols = 2 * this.width + 1;
    this.rows = 2 * this.height + 1;

    this.entry = [0, 0];
    this.exit = [0, 0];

    this.maze = this.initArray(MazeStructures.PATH);

    // place initial walls
    this.maze.forEach((row, r) => {
      row.forEach((_, c) => {
        switch (r) {
          case 0:
          case this.rows - 1:
            this.maze[r][c] = MazeStructures.WALL;
            break;

          default:
            if ((r % 2) == 1) {
              if ((c == 0) || (c == this.cols - 1)) {
                this.maze[r][c] = MazeStructures.WALL;
              }
            } else if (c % 2 == 0) {
              this.maze[r][c] = MazeStructures.WALL;
            }
        }
      });

      if (r == 0) {
        // place exit in top row
        const doorPos = this.posToSpace(randomNumber(1, this.width));
        this.maze[r][doorPos] = MazeStructures.EXIT;
        this.exit = [r+1, doorPos];
      }

      if (r == this.rows - 1) {
        // place entrance in bottom row
        const doorPos = this.posToSpace(randomNumber(1, this.width));
        this.maze[r][doorPos] = MazeStructures.ENTRY;
        this.entry = [r-1, doorPos];
      }
    });

    // start partitioning
    this.partition(1, this.height - 1, 1, this.width - 1);

    this.display();
  }

  getCell(pos: NodePosition): MazeStructures {
    return this.maze[pos[0]][pos[1]];
  }

  updateCell(pos: NodePosition, status: MazeStructures) {
    this.maze[pos[0]][pos[1]] = status;
    this.display();
  }

  initArray(value: MazeStructures): MazeStructures[][] {
    return new Array(this.rows).fill(null).map(() => {
      return new Array(this.cols).fill(value);
    });
  }


  posToSpace(x: number) {
    return 2 * (x-1) + 1;
  }

  posToWall(x: number) {
    return 2 * x;
  }

  inBounds(r: number, c: number) {
    if (
      (typeof this.maze[r] == 'undefined') ||
      (typeof this.maze[r][c] == 'undefined')
    ) {
      return false; // out of bounds
    }
    return true;
  }

  partition(r1: number, r2: number, c1: number, c2: number) {
    // create partition walls
    // ref: https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method

    let horiz; let vert; let x; let y; let start; let end;

    if ((r2 < r1) || (c2 < c1)) {
      return false;
    }

    if (r1 == r2) {
      horiz = r1;
    } else {
      x = r1+1;
      y = r2-1;
      start = Math.round(x + (y-x) / 4);
      end = Math.round(x + 3*(y-x) / 4);
      horiz = randomNumber(start, end);
    }

    if (c1 == c2) {
      vert = c1;
    } else {
      x = c1 + 1;
      y = c2 - 1;
      start = Math.round(x + (y - x) / 3);
      end = Math.round(x + 2 * (y - x) / 3);
      vert = randomNumber(start, end);
    }

    for (let i = this.posToWall(r1)-1; i <= this.posToWall(r2)+1; i++) {
      for (let j = this.posToWall(c1)-1; j <= this.posToWall(c2)+1; j++) {
        if ((i == this.posToWall(horiz)) || (j == this.posToWall(vert))) {
          this.maze[i][j] = MazeStructures.WALL;
        }
      }
    }

    const gaps = shuffleArray([true, true, true, false]);

    // create gaps in partition walls

    if (gaps[0]) {
      const gapPosition = randomNumber(c1, vert);
      this.maze[
          this.posToWall(horiz)
      ][this.posToSpace(gapPosition)] = MazeStructures.PATH;
    }

    if (gaps[1]) {
      const gapPosition = randomNumber(vert+1, c2+1);
      this.maze[
          this.posToWall(horiz)
      ][this.posToSpace(gapPosition)] = MazeStructures.PATH;
    }

    if (gaps[2]) {
      const gapPosition = randomNumber(r1, horiz);
      this.maze[
          this.posToSpace(gapPosition)
      ][this.posToWall(vert)] = MazeStructures.PATH;
    }

    if (gaps[3]) {
      const gapPosition = randomNumber(horiz+1, r2+1);
      this.maze[
          this.posToSpace(gapPosition)
      ][this.posToWall(vert)] = MazeStructures.PATH;
    }

    // recursively partition newly created chambers

    this.partition(r1, horiz-1, c1, vert-1);
    this.partition(horiz+1, r2, c1, vert-1);
    this.partition(r1, horiz-1, vert+1, c2);
    this.partition(horiz+1, r2, vert+1, c2);
  }

  isGap(...cells: number[][]): boolean {
    return cells.every((array) => {
      const [row, col] = array;
      if (this.maze[row][col] !== MazeStructures.PATH) {
        const validStructures = [MazeStructures.ENTRY, MazeStructures.EXIT];
        if (!validStructures.includes(this.maze[row][col])) {
          return false;
        }
      }
      return true;
    });
  }

  countSteps(
      array: number[][],
      r: number,
      c: number,
      val: number,
      stop: MazeStructures,
  ) {
    if (!this.inBounds(r, c)) {
      return false; // out of bounds
    }

    if (array[r][c] <= val) {
      return false; // shorter route already mapped
    }

    if (!this.isGap([r, c])) {
      return false; // not traversable
    }

    array[r][c] = val;

    if (this.maze[r][c] === stop) {
      return true; // reached destination
    }

    this.countSteps(array, r-1, c, val+1, stop);
    this.countSteps(array, r, c+1, val+1, stop);
    this.countSteps(array, r+1, c, val+1, stop);
    this.countSteps(array, r, c-1, val+1, stop);
  }

  display() {
    console.clear();
    this.maze.forEach((row) => {
      row.forEach((cell) => {
        const colors = {
          [MazeStructures.WALL]: '\x1b[47m \x1b[8m',
          [MazeStructures.ENTRY]: '\x1b[42m \x1b[8m',
          [MazeStructures.EXIT]: '\x1b[41m \x1b[8m',
          [MazeStructures.PATH]: '\x1b[48m \x1b[8m',
          [MazeStructures.CHECKED]: '\x1b[45m \x1b[8m',
          [MazeStructures.WALKED]: '\x1b[44m \x1b[8m',
          [MazeStructures.NEXT]: '\x1b[43m \x1b[8m',
        };

        process.stdout.write(colors[cell] + cell.toString() + '\x1b[0m');
      });

      process.stdout.write('\n');
    });
  }
}
