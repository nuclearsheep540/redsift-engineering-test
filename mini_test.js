/**
TASK ONE
Count how many Apples, Pears, Lemons, Oranges, Pineapples, Tomatoes, Mangos and Bananas are in the list.
*/
const task1 = [
    "apple",
    "pear",
    "lemon",
    "orange",
    "pineapple",
    "tomato",
    "lettuce",
    "mango",
    "apple",
    "pineapple",
    "lemon",
    "pear",
    "pear",
]

function count(array) {
    let expected_fruits = {
        "Apple": 0, 
        "Pear": 0,
        "Lemon": 0,
        "Orange": 0,
        "Pineapple": 0,
        "Tomato": 0,
        "Mango": 0,
        "Banana":0
    }

    array.map((fruit) => {
        // Title-case those fruits so we can check strict equity
        fruitCase = fruit[0].toUpperCase() + fruit.substring(1)

        // If the fruit is to be expected
        if (Object.keys(expected_fruits).includes(fruitCase)) {
            // increment value
            expected_fruits[fruitCase]++
        }
    })
    return expected_fruits
}

/**
TASK TWO
a) What is the performance, in terms of, Big O notation, of the below code?
    O(n^2) = O Squared
b) Write a solution that has better performance
c) What is the performance of your new solution?
    O(n)
*/

const domains = { // Example to show data shape only.
    "one.com": { policy: "block" },
    "two.com": { policy: "none" },
    "three.com": { policy: "none" },
    "four.com": { policy: "block" },
}

const getBlockPolicyState = (domains) => {
    // getting number of keys in the data structure
    // 0(n) => object may be hashed, but to lookup properties (keys) we need to sort and loop through object
    numDomains = Object.keys(domains).length;

    // looping through each key to push it's policy value into var policyArr
    // O(n^2)=> literally looping through each item individually, with an extra loop inside(entries), so it's squared
    for (let i = 0; i < numDomains; i++) {
        policyArr.push(Object.entries(domains)[i][1].policy);
    }

    // returns true as soon as one == True
    // Unless we go by the assumption we evaluate true at the median value O(k) or: O(n/2)
    // It's safer to assume worse case of O(n) if we had to loop through the whole array to find the value
    oneDomain = policyArr.some((item) => item === "block");

    // returns true after whole array has been checked that all == true
    // O(n) because requires to loop through all items
    allDomains = policyArr.every((item) => item === "block");

    return { oneDomain, allDomains };
    // Result is O(n^2) (O Squared) based on the slowest operation = the for-loop with another loop inside
    // to improve this, we can achieve a linear O(n) if we refactor the for-loop
};

const domains = {
    "one.com": {policy: "block"},
    "two.com": { policy: "none" },
    "three.com": { policy: "none" },
    "four.com": { policy: "block" },
}

const improvedGetBlockPolicyState = (domains) => {
    // removing the object push with entries, and utlising a map on the entries is O(n) efficient
    const policyArr = Object.entries(domains).map((domain) => {
        return domain[1].policy
    })
    oneDomain = policyArr.some((item) => item === "block");
    allDomains = policyArr.every((item) => item === "block");
    return { oneDomain, allDomains };
  };


/**
TASK THREE
Find the first recurring character of the below lists
*/
const task8 = [
    [2,5,1,2,3,5,1,2,4],
    [2,1,1,2,3,5,1,2,4],
    [2,3,4,5],
    [2,5,5,2,3,5,1,2,4]
  ]

function dupe(array) {
    let res = []
    // for every array in the data structure
    array.forEach((arr) => {
        let result = undefined
        let record = []
        
        // loop until we evaluate true
        arr.some((num) => {
            // if this num is in record, return it
            if (record.includes(num)) {
                return result = num

            // else keep adding
            } else if (!record.includes(num)) {
                record.push(num)

            // otherwise, undefined
            } else {
                return result
            }
        })
        res.push(result)
    })
    return res
}