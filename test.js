var array = [
  'Bank Transfer',
  'Bank Transfer',
  'Bank Transfer',
  'Bank Transfer',
  'Bank Transfer',
  'Bank Transfer',
  'Bank Transfer',
  'Bank Transfer',
  'Bank Transfer',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'Cash Deposit to Bank',
  'iTunes Gift Card',
  'iTunes Gift Card',
  'iTunes Gift Card',
  'abc',
  'abc',
];

// The spread operator ... expands an iterable object into a list of arguements (basically takes each element in an array out and returns 1 by 1 into a new iterable object) and at the same time makes a new reference such that the original iterable object is not changed.
// This is useful for passing individual elements of an array into a function as an argument 1 by 1.
// Used to make new copies or concatenate iterables together.

// The Set constructor takes an iterable and produces a set object of its unique values

let unique = [...new Set(array)];

var arrayOfVar = [];
// loop through unique payment type
for (i in unique) {
  // dynamically create a string that looks like a variable
  var str = `paymentType${i} = 0`;
  // evaluate the string as javascript so it creates an actual variable
  // then push it to an array
  arrayOfVar.push(eval(str));
  // loop through actual array list
  for (y in array) {
    // for that payment type of unique[i] if it matches, it will add one to the variable count.
    // when it loops over the whole array, it will change to the next unique payment type and create a variable for it
    if (unique[i] == array[y]) {
      arrayOfVar[i] += 1;
    }
  }
}

console.log(arrayOfVar);

// match and turn the two arrays into an object
var dict = {};
for (i in unique) {
  dict[unique[i]] = arrayOfVar[i];
}

console.log(dict);
console.log(unique);
console.log(arrayOfVar);

// Turn the object into an array of arrays
var sorted = [];
for (paymentType in dict) {
  sorted.push([paymentType, dict[paymentType]]);
}
console.log(sorted);

sorted.sort((a, b) => {
  // b[1] - a[1] refers to the 1st index element's number value - the 0th index element's number
  return b[1] - a[1];
});

console.log(sorted);

// Turn the sorted array into an object
var objSorted = {};
sorted.forEach((item) => {
  objSorted[item[0]] = item[1];
});

console.log(objSorted);
