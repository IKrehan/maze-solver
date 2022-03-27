import MazeSolver from './solver';
import MazeBuilder from './maze';

const maze = new MazeBuilder();
const solver = new MazeSolver(maze, false);
solver.solve();
