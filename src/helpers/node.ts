import Maze, {MazeStructures, NodePosition} from '../maze';

export default class Node {
  constructor(
          public maze: Maze,
          public position: NodePosition,
          public previous: Node|null = null,
          public g = 0,
          public h = 0,
          public f = 0,
  ) {
    this.maze = maze;
    this.position = position;
    this.previous = previous;
    this.g = g;
    this.h = h;
    this.f = f;
  }

  getNeighbours(): Node[] {
    const [x, y] = this.position;

    const neighbours: NodePosition[] = [
      [x+1, y],
      [x-1, y],
      [x, y+1],
      [x, y-1],
    ];

    return neighbours
        .filter((pos) => this.isWalkable(pos))
        .map((item) => new Node(this.maze, item, this));
  }

  isWalkable(pos: NodePosition) {
    return [
      MazeStructures.PATH,
      MazeStructures.EXIT,
      MazeStructures.NEXT,
    ].includes(this.maze.getCell(pos));
  }

  setData(g: number, h: number, f: number) {
    this.g = g;
    this.h = h;
    this.f = f;
  }
}
