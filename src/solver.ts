import Maze, {MazeStructures, NodePosition} from 'maze';
import Node from 'helpers/node';
import PriorityQueue from 'helpers/priorityQueue';
import sleep from 'utils/sleep';

export default class MazeSolver {
  entry: Node;
  exit: Node;

  constructor(public maze: Maze, public delaySteps = false) {
    this.maze = maze;
    this.delaySteps = delaySteps;
    this.entry = new Node(this.maze, maze.entry);
    this.exit = new Node(this.maze, maze.exit);
  }

  async solve() {
    const queue = new PriorityQueue();
    queue.enqueue(this.entry);

    while (!queue.isEmpty()) {
      const current = queue.dequeue();
      await this.updateNode(current, MazeStructures.CHECKED);

      if (current.position.toString() === this.exit.position.toString()) {
        return await this.findPath(current);
      }

      for (const next of current.getNeighbours()) {
        const {g, h, f} = this.calculateNodeData(next, current);
        next.setData(g, h, f);

        if (queue.contains(next) && next.g > queue.front().g) {
          return;
        }

        await this.updateNode(next, MazeStructures.NEXT);
        queue.enqueue(next);
      }
    }
  }

  calculateNodeData(current: Node, next: Node) {
    const g = current.g + 1;
    const h = this.heuristic(
        next.position,
        this.exit.position,
    );

    return {g, h, f: g + h};
  }

  async findPath(node: Node) {
    const path = [];
    let end: Node | null = node;

    while (end !== null) {
      path.unshift(end);
      await this.updateNode(end, MazeStructures.WALKED);

      end = end.previous;
    }

    return path;
  }

  async updateNode(node: Node, structure: MazeStructures) {
    this.maze.updateCell(node.position, structure);
    this.delaySteps && await sleep(90);
  }

  heuristic(a: NodePosition, b:NodePosition) {
    return (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2;
  }
}
