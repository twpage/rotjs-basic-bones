export class Queue<T> {
    private elements: T[] = [];
  
    // Enqueue an element to the end of the queue
    enqueue(element: T): void {
      this.elements.push(element);
    }
  
    // Dequeue an element from the front of the queue
    dequeue(): T | undefined {
      return this.elements.shift();
    }
  
    // Remove an element from the end of the queue
    pop(): T | undefined {
        return this.elements.pop();
    }
  
    // Peek at the front element of the queue without removing it
    peek(): T | undefined {
      return this.elements[0];
    }
  
    // Check if the queue is empty
    isEmpty(): boolean {
      return this.elements.length === 0;
    }
  
    // Check if the queue is  not empty
    isNotEmpty(): boolean {
      return !(this.isEmpty())
    }
  
    // Get the size of the queue
    size(): number {
      return this.elements.length;
    }
  
    // Clear all elements from the queue
    clear(): void {
      this.elements = [];
    }
}
  
//   // Example usage:
//   const myQueue = new Queue<number>();
  
//   myQueue.enqueue(1);
//   myQueue.enqueue(2);
//   myQueue.enqueue(3);
  
//   console.log(myQueue.peek()); // Output: 1
  
//   console.log(myQueue.dequeue()); // Output: 1
  
//   console.log(myQueue.size()); // Output: 2
  
//   console.log(myQueue.isEmpty()); // Output: false
  
//   myQueue.clear();
  
//   console.log(myQueue.isEmpty()); // Output: true
  