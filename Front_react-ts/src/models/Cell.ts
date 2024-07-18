import {Colors} from "./Colors";
import {Figure} from "./figures/Figure";
import {Board} from "./Board";


export class Cell {
  readonly x: number;
  readonly y: number;
  readonly color: Colors;
  figure: Figure | null;
  board: Board;
  available: boolean; // Можешь ли переместиться
  id: number; // Для реакт ключей
  activeFigure: any;


  

  constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = figure;
    this.board = board;
    this.available = false;
    this.id = Math.random()
    
  }

  getActiveFigure() {
    const activeBoard = this.board.getBoard()
    const activeFigure = activeBoard.flatMap(row => row.map(cell => cell.figure?.color !== this.figure?.color))
    return activeFigure
      

  }
  
  setFigure (figure: Figure) {
    this.figure = figure;
    figure.cell = this;
    if (this.figure.name === 'Пешка') {
      this.figure.changeFigure(this.figure.cell);
    }
  }

  addLostFigure (figure: Figure) {
    figure.color === Colors.BLACK
     ? this.board.lostBlackFigures.push(figure)
     : this.board.lostWhiteFigures.push(figure);
  }

  moveFigure(target: Cell) {
    if(this.figure && this.figure?.canMove(target)) {
      this.figure.moveFigure(target);
      // console.log(this.board.cells)
      console.log(this.getActiveFigure())
      if (target.figure) {
        this.addLostFigure(target.figure)
      }
      target.setFigure(this.figure)
      this.figure = null;
      
      
    }
  }

  isEmpty () {
    return this.figure === null;
  }
 
  isEnemy (target: Cell) : boolean {
    if (target.figure){
      return this.figure?.color !== target.figure.color
    }
      return false;
  
  }
  isEmptyVertical(target: Cell): boolean {
    // Исключаем текущую ячейку из возможных target
    if (this.x !== target.x) {
      return false;
    }
    // 
    const min = Math.min(this.y, target.y);
    const max = Math.max(this.y, target.y);
    for (let y = min + 1; y < max; y++) {
      if (!this.board.getCell(this.x, y).isEmpty()) {
        return false
      }
    }
    return true
  }
  
  isEmptyHorizontal(target: Cell):boolean {
    // Исключаем текущую ячейку из возможных target
    if (this.y !== target.y) {
      return false;
    }
    //  Изменения x в горизонтальной ориентации одинаковые, поэтому вычисляем разницу между текущей ячейкой и и target
    const min = Math.min(this.x, target.x);
    const max = Math.max(this.x, target.x);
    for (let x = min + 1; x < max; x++) {
      if (!this.board.getCell(x, this.y).isEmpty()) {
        return false
      }
    }
    return true
  }
  
  isEmptyDiagonal(target: Cell): boolean {
    //  Изменения x и y в диагонали одинаковые, поэтому вычисляем разницу между текущей ячейкой и и target
    // Если значения разниц x и y отличаются, значит это не диагональ
    const absX = Math.abs(target.x - this.x); 
    const absY = Math.abs(target.y - this.y); 
   
    if (absX!== absY) {
      return false;
    }

  
     
    // Вычисляем направление движения вдоль диагонали положительное или отрицательное
    const dy = this.y < target.y ? 1 : -1;
    const dx = this.x < target.x ? 1 : -1;

    // Проверяем, что в каждой ячейке между текущей и target находится фигура
    for (let i = 1; i < absY; i++) {
      if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) {
        return false
      }
    }
    return true
  }

}