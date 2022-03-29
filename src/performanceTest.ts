import MazeSolver from './solver';
import MazeBuilder from './maze';
import colorful from './utils/colorful';

const {columns, rows} = process.stdout;
const testAlgo = async (mazes: number) => {
  let time = 0;

  for (let i = 0; i < mazes; i++) {
    const maze = new MazeBuilder({
      width: Math.floor(columns/4)-1,
      height: Math.floor(rows/2)-1,
      displayMaze: false,
    });
    const solver = new MazeSolver(maze, false);


    const {duration} = await solver.solve();
    time += duration;
  }

  return {
    mazes,
    time,
  };
};

testAlgo(1000)
    .then(({mazes, time}) => {
      console.log(`Average Solve Time: ${colorful('yellow', time/mazes)}ms`);
    });
