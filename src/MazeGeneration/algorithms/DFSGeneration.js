export function DFSGeneration(grid, startNode) {
  //retrive grid from state
  const nodeList = getNodes(grid);
  const stack = [];
  let currentNode;
  let orderedNodes = [];

  console.log(nodeList);

  const initialNodeIndex = nodeList.findIndex(
    (element) => element.isStart === true
  );
  //   Choose the initial cell, mark it as visited and push it to the stack
  //   While the stack is not empty
  //       Pop a cell from the stack and make it a current cell
  //       If the current cell has any neighbours which have not been visited
  //           Push the current cell to the stack
  //           Choose one of the unvisited neighbours
  //           Remove the wall between the current cell and the chosen cell
  //           Mark the chosen cell as visited and push it to the stack

  currentNode = nodeList[initialNodeIndex];
  currentNode.visited = true;
  stack.push(currentNode);

  while (stack.length > 0) {
    currentNode = stack[stack.length - 1];
    orderedNodes.push(currentNode);
    stack.pop();
    if (checkNeighbors(currentNode, grid)) {
      stack.push(currentNode);
      const newNode = chooseNeighbors(currentNode, grid);

      newNode.visited = true;
      stack.push(newNode);
    }
  }
  return orderedNodes;
}

function chooseNeighbors(currentNode, grid) {
  const neighbors = getNeighbors(currentNode, grid);
  const validNeighbors = [];

  neighbors.forEach((neighbor) => {
    if (!neighbor.visited && validateNeighbor(currentNode, neighbor, grid)) {
      validNeighbors.push(neighbor);
    }
  });

  const randomIdx = Math.floor(Math.random() * validNeighbors.length);
  return validNeighbors[randomIdx];
}

function getNeighbors(node, grid) {
  const { col, row } = node;
  const neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}

function checkNeighbors(currentNode, grid) {
  const neighbors = getNeighbors(currentNode, grid);

  const validNeighbors = [];

  neighbors.forEach((neighbor) => {
    if (!neighbor.visited && validateNeighbor(currentNode, neighbor, grid)) {
      validNeighbors.push(neighbor);
    }
  });

  if (validNeighbors.length > 0) {
    return true;
  } else {
    return false;
  }
}

function validateNeighbor(currentNode, neighbor, grid) {
  const { col, row } = neighbor;
  const neighbors = [];

  if (row > 0 && currentNode !== grid[row - 1][col]) {
    neighbors.push(grid[row - 1][col]);
  }
  if (row < grid.length - 1 && currentNode !== grid[row + 1][col]) {
    neighbors.push(grid[row + 1][col]);
  }
  if (col > 0 && currentNode !== grid[row][col - 1]) {
    neighbors.push(grid[row][col - 1]);
  }
  if (col < grid[0].length - 1 && currentNode !== grid[row][col + 1]) {
    neighbors.push(grid[row][col + 1]);
  }

  let invalidNeighbors = [];
  neighbors.forEach((n) => {
    if (n.visited === true) {
      invalidNeighbors.push(n);
    }
  });
  if (invalidNeighbors.length > 0) {
    return false;
  } else {
    return true;
  }
}

function getNodes(grid) {
  const nodes = [];
  grid.forEach((e) => {
    e.forEach((d) => {
      nodes.push(d);
    });
  });
  return nodes;
}
