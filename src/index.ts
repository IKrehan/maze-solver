import MazeSolver from './solver';
import MazeBuilder from './maze';

const {columns, rows} = process.stdout;
const maze = new MazeBuilder({
  width: Math.floor(columns/4)-1,
  height: Math.floor(rows/2)-1,
});

const solver = new MazeSolver(maze, true);
solver.solve();
