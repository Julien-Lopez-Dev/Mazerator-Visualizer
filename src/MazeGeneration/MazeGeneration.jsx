import React, { Component } from "react";
import Node from "./Node/Node";
import { DFSGeneration } from "./algorithms/DFSGeneration";

import "./MazeGeneration.css";
import {
  Container,
  Row,
  Col,
  Button,
  Nav,
  NavDropdown,
  Navbar,
} from "react-bootstrap";

const STARTING_NODE_X = 0;
const STARTING_NODE_Y = 0;

export default class MazeGeneration extends Component {
  constructor() {
    super();
    this.state = {
      isAnimating: false,
      currentAnimation: [],
      gridSize: 15,
      grid: [],
      nodeSize: "48px",
      canvasSize: "728px",
    };
  }

  componentDidMount() {
    const grid = createGrid(this.state.gridSize);
    this.setState({ grid });

    document.getElementById(
      "mazeContainer"
    ).style.height = this.state.canvasSize;
    document.getElementById(
      "mazeContainer"
    ).style.width = this.state.canvasSize;

    // document.querySelector("body").style.backgroundColor = "#252525";
  }

  componentWillUnmount() {
    this.setState({
      grid: [],
    });
  }

  visualizeMaze() {
    const { grid } = this.state;
    const startNode = grid[STARTING_NODE_X][STARTING_NODE_Y];
    const orderedNodeList = DFSGeneration(grid, startNode);
    this.animateMaze(orderedNodeList);
  }

  animateMaze(orderedNodeList) {
    const animationArr = [];
    for (let i = 0; i < orderedNodeList.length; i++) {
      animationArr.push(
        setTimeout(() => {
          const node = orderedNodeList[i];
          const nodeElement = document.getElementById(
            `node-${node.row}-${node.col}`
          );
          nodeElement.classList.add("node-visited");
        }, 50 * i)
      );
    }

    setTimeout(() => {
      const { grid } = this.state;
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
          const node = grid[row][col];

          if (node.visited) {
            const pathElement = document.getElementById(
              `node-${node.row}-${node.col}`
            );
            pathElement.classList.add("is-path");
          } else {
            const wallElement = document.getElementById(
              `node-${node.row}-${node.col}`
            );
            wallElement.classList.add("is-wall");
          }
        }
      }

      // document
      //   .getElementById("mazeContainer")
      //   .classList.add("mazeContainerAfter");
    }, 50 * orderedNodeList.length);

    this.setState({ currentAnimation: animationArr });
  }

  stopAnimations(animationArr) {
    for (let i = 0; i < animationArr.length; i++) {
      clearTimeout(animationArr[i]);
    }
  }

  clearMaze() {
    this.stopAnimations(this.state.currentAnimation);
    this.resetMazeGrid(this.state.gridSize);

    const { grid } = this.state;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const node = grid[row][col];
        const nodeElement = document.getElementById(
          `node-${node.row}-${node.col}`
        );
        nodeElement.classList.remove("node-visited");
      }
    }
  }

  resetMazeGrid(size) {
    this.stopAnimations(this.state.currentAnimation);

    const newGridSize = size;

    this.setState({ gridSize: newGridSize, grid: [] }, () => {
      const newGrid = createGrid(this.state.gridSize);
      let newNodeSize;

      if (this.state.gridSize === 10) {
        newNodeSize = "72px";
      } else if (this.state.gridSize === 15) {
        newNodeSize = "48px";
      } else if (this.state.gridSize === 25) {
        newNodeSize = "28.8px";
      }

      this.setState({ grid: newGrid, nodeSize: newNodeSize }, () => {
        for (let row = 0; row < this.state.gridSize; row++) {
          for (let col = 0; col < this.state.gridSize; col++) {
            document.getElementById(
              `node-${row}-${col}`
            ).style.height = this.state.nodeSize;
            document.getElementById(
              `node-${row}-${col}`
            ).style.width = this.state.nodeSize;
          }
        }
      });
    });

    this.forceUpdate();
  }

  render() {
    const { grid } = this.state;

    return (
      <div className="body">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>Mazerator</Navbar.Brand>
          <Button
            variant="success"
            onClick={() => {
              this.visualizeMaze();
            }}
          >
            Generate Maze
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              this.clearMaze();
            }}
          >
            Clear Maze
          </Button>
        </Navbar>
        <Container className="bodyContainer" fluid="md">
          <Row>
            <Col>
              <div id="mazeContainer" className="mazeContainer">
                {grid.map((row, rowIndex) => {
                  return (
                    <div key={rowIndex}>
                      {row.map((node, nodeIndex) => {
                        const { row, col } = node;
                        return (
                          <Node
                            key={nodeIndex}
                            id={`node-${node.row}-${node.col}`}
                            col={col}
                            row={row}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <Container className="btnContainer">
                <Button
                  variant="info"
                  onClick={() => {
                    this.resetMazeGrid(25);
                  }}
                >
                  25x25
                </Button>
                <Button
                  variant="info"
                  onClick={() => {
                    this.resetMazeGrid(15);
                  }}
                >
                  15x15
                </Button>
                <Button
                  variant="info"
                  onClick={() => {
                    this.resetMazeGrid(10);
                  }}
                >
                  10x10
                </Button>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const createGrid = (gridSize) => {
  const nodeGrid = [];
  for (let row = 0; row < gridSize; row++) {
    const rowArr = [];
    for (let col = 0; col < gridSize; col++) {
      rowArr.push(createNode(row, col));
    }
    nodeGrid.push(rowArr);
  }
  return nodeGrid;
};

const createNode = (row, col) => {
  return {
    id: `${row},${col}`,
    col,
    row,
    isStart: row === STARTING_NODE_X && col === STARTING_NODE_Y,
    visited: false,
  };
};
