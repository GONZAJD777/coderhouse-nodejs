const arrayNum = [1,2,3,4,5];

const myFunctionMap = (array, callback) => {
    const newArray = [];
    array.forEach(element => {
        const newValue = callback(element);
        newArray.push(newValue);        
    });
    return newArray;
}

const result = myFunctionMap(arrayNum, x => x+2);

console.log(result);