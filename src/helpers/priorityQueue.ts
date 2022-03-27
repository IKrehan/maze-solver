import Node from './node';

export default class PriorityQueue {
  private elements: Node[];
  constructor() {
    this.elements = [];
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }

  front(): Node {
    return this.elements[0];
  }

  /* Add item to queue ordering by priority */
  enqueue(element: Node): void {
    let contain = false;

    for (const [index, item] of this.elements.entries()) {
      if (item.f > element.f) {
        this.elements.splice(index, 0, element);
        contain = true;
        break;
      }
    }

    if (!contain) {
      this.elements.push(element);
    }
  }

  dequeue(): Node {
    const element = this.elements.shift();

    if (!element) {
      throw new Error('Cannot get from empty queue');
    }

    return element;
  }

  show(): Node[] {
    return this.elements;
  }

  /* Search item using binary search */
  contains(element: Node): boolean {
    const searchItem = (
        x: Node,
        start: number,
        end: number,
    ): boolean => {
      if (start > end) return false;
      const mid = Math.floor((start + end)/2);

      const item = this.elements[mid];

      if (item === x) {
        return true;
      };

      if (item.f > x.f) {
        return searchItem(x, start, mid-1);
      } else {
        return searchItem(x, mid+1, end);
      }
    };

    return searchItem(
        element,
        0,
        this.elements.length-1,
    ) || false;
  }

  clear() {
    this.elements = [];
  }
}
