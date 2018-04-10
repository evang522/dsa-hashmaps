'use strict';
// insertFirst, remove, insertLast, find

class _Node {

  constructor(value,next) {
    this.value=value;
    this.next=next;
  }
}


class LinkedList {
  constructor() {
    this.head  = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      return this.insertFirst(item);
    }

    let currentNode = this.head;

    while (currentNode.next !== null) {
      currentNode = currentNode.next;
    }
    currentNode.next = new _Node(item,null);
  }

  remove(node) {
    if (!this.head) {
      return false;
    }

    if (this.head.value === node) {
      this.head = this.head.next;    
      return true;
    }

    let currentNode = this.head;
    let previousNode = null;


    while ((currentNode !== null) && (currentNode.value !== node)) {
      previousNode = currentNode;
      currentNode=currentNode.next;
    }

    if (currentNode === null) {
      console.log('Item not found');
      return false;
    }

    previousNode.next = currentNode.next;
    return true;
  }


  find(item) {
    if (this.head === null) {
      return console.log('Array contains no items');
    }

    if (this.head.value === item) {
      console.log('Found your item: ', item);
      return;
    }

    let currentNode = this.head;

    while (currentNode.value !== item && currentNode !== null) {
      currentNode = currentNode.next;
    }

    if (currentNode.value === item) {
      console.log('Found your item!: ', item);
    } else {
      console.log('Your item could not be found');
    }

  }

  insertBefore(value,valueOfNext) {
    
    if (!this.head) {
      return console.log('There is no key to insert before');
    }
    let currentNode = this.head;
    let previousNode = this.head;

    while (currentNode.value !== valueOfNext && currentNode !== null) {
      previousNode = currentNode;
      currentNode = currentNode.next;
    }

    previousNode.next = new _Node(value, currentNode);
  
  }


  insertAfter(value=null, valueOfPrev) {
    
    if (!value) {
      return console.log('You didn\'t provide a value to insert');
    }

    if (!this.head) {
      return console.log('No value to insert After');
    }

    if (this.head.next === null) {
      return this.insertLast(value);
    }

    let currentNode = this.head;
    // let previousNode = null;

    while(currentNode.value !== valueOfPrev && currentNode.next !== null) {
      // previousNode = currentNode;
      currentNode = currentNode.next;
    }
    
    const newNode = new _Node(value,currentNode.next);
    currentNode.next = newNode;
  }

  insertAt(index,value=null) {
    if (!this.head) {
      return console.log('This list has no items');
    }

    if (!value) {
      return console.log('You did not provide a value!');
    }

    let counter = 0;
    let currentNode = this.head;
    let previousNode = null;
    while (counter !== index && currentNode.next !== null) {
      previousNode = currentNode;
      currentNode = currentNode.next;
      counter++;
    }

    if (counter !== index) {
      return console.log('You cannot insert an item at a location further ahead in the array than the array extends');
    }

    previousNode.next = new _Node(value, currentNode);
  }
}



// EXTRA-CLASS FUNCTIONS (non list-specific)
const displayList = (linkedlist) => {
  if (!linkedlist.head) {
    console.log('This list has no items');
    return;
  }
  let iteratedNode = linkedlist.head;

  console.log('<==LIST BEGINNT==>');
  while(iteratedNode !== null) {
    console.log(iteratedNode.value);
    iteratedNode = iteratedNode.next;

  }
  console.log('<==LIST STOPPT==>');
};




//============================================ Implement HashMap with Separate Chaining ======================================>


//============================================ Node Class ======================================>


class HashMap {
  constructor(initialCapacity=8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i=0; i<string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }


  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error('Not Found');
    }
    let currentNode = this._slots[index];
    while(currentNode.next !== null && currentNode.value.key !== key) {
      currentNode = currentNode.next;
    }
    return currentNode.value.value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    console.log(index);
    if (!this._slots[index]) {
      this._slots[index] = new LinkedList();
    }
    
    if (this._slots[index].find(key)) {
      this._slots[index].remove(key);
      this._slots[index].insertLast({key,value});
      return;
    }

    this._slots[index].insertLast({key,value});
    this.length++;
  }


  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const index = hash % this._capacity;

    return index;
  }

  // for (let i=start; i<start + this._capacity; i++) {
  //   const index = i % this._capacity;
  //   const slot = this._slots[index];
  //   if (slot  === undefined || (slot.key === key && !slot.deleted)) {
  //     return index;
  //   }
  // }


  _resize(size) {
    console.log('resize was called');
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value);
      }
    }
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key Error');
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }



}
HashMap.MAX_LOAD_RATIO = .8;
HashMap.SIZE_RATIO = 3;


//============================================ Helper Functions ======================================>

const display = (hashmap)  => {
  for (let i=0;i<hashmap._slots.length; i++) {
    let currentNode = hashmap._slots[i] ? hashmap._slots[i].head : null;
    if (currentNode) {
      while (currentNode !== null) {
        console.log(currentNode.value);
        currentNode = currentNode.next;
      }
    }
  }
  console.log('Capacity: ',hashmap._capacity);
  console.log('Length: ', hashmap.length);
};





//============================================ Main Function ======================================>

function main() {
  const testHash = new HashMap();
  testHash.set('harry','potter');
  testHash.set('harry','potter');
  display(testHash);
}

main();