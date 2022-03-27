import MazeSolver from './solver';
import MazeBuilder from './maze';

const maze = new MazeBuilder();
const solver = new MazeSolver(maze, true);
solver.solve();
