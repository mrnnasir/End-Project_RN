let fullMeal = [];
let mealCategory = [];

let catName = document.getElementById("catName");//Input element
let output = document.getElementById("output1"); //Div-For list of Category
let mealSec = document.getElementById("mealSec"); //Div-For Filtered Category

//Button
let mealCatList = document.getElementById("mealCatList"); //For List of Category
let mealCat = document.getElementById("mealCat"); //For Filtered Category

//Fetching data using API
//async function allows us to use 'await' inside the main() until a Promise is resolved.
async function main() {
  const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=s")
  const data = await resp.json()
  if (data.meals && data.meals.length > 0) {
    fullMeal=data.meals;
  }
}
main();

//List of Category---
//To store Unique category value to a variable---
function getUniCat() {
  const uniqueCat = new Set(); //Array of each unique value (category) will be stored in uniqueCat variable

  //By using forEach method, we are adding each unique value from 'fullMeal' that meets the condition to uniqueCat variable, which is a Set().
  fullMeal.forEach(meal => {
    if (meal.strCategory) {
      uniqueCat.add(meal.strCategory);
    }
  });
  return [...uniqueCat];//Since uniqueCat is a Set, we need to convert this to an Array by using Spread Operator
}

//To add the content in HTML
function catList(msg) {
  //Div will be created with class
  let outputDiv = document.createElement("div");
  outputDiv.classList.add("outputD");

  //P-tag will be created with class
  let outputP = document.createElement("p");
  outputP.classList.add("outputCatP");

  //msg argument will be added to the body of html
  outputP.textContent = msg;
  outputDiv.appendChild(outputP);
  output.append(outputDiv);
}

//To listen button function about the request---
mealCatList.addEventListener("click", function (){
  //To remove the collection past elements from the class of a previously declared Div 'outputD'
  let removeElement = document.getElementsByClassName("outputD");
  [...removeElement].forEach(el => el.remove())

  let count = 1;
  mealCategory = getUniCat(); //List of categories will be stored in mealCategory
  mealCategory.sort(); //Items in mealCategory will be alphabetically sorted
  mealCategory.forEach(meal => {catList(count++ + '. ' + meal);}); //It will call the catList function to execute the operation
})

//Filtered Category---
//To add the content in HTML
function printScreen(msg) {
  //Div will be created with class
  let mealDiv = document.createElement('div');
  mealDiv.classList.add('mealNaD');

  //P-tag will be created with class
  let mealP = document.createElement('p');
  mealP.classList.add('mealNaP');

  //msg argument will be added to the body of html
  mealP.innerHTML = msg
  mealDiv.appendChild(mealP)
  mealSec.appendChild(mealDiv)
}

//To listen button function about the request---
mealCat.addEventListener("click", function() {
  //To remove the collection past elements from the class of a previously declared Div 'mealNaD'
  let removeElement = document.getElementsByClassName('mealNaD');
  [...removeElement].forEach(el => el.remove());

  //Store user input in lower case
  let userCat = catName.value.trim().toLowerCase()

  //Check inserted user category with listed category in fullMeal then store the matched items in filterCategory
  let filterCategory = fullMeal.filter(cat => cat.strCategory.toLowerCase() === userCat);

  //Applied condition for user's convenience
  if(userCat === '') {
    printScreen('Oops! You forgot to enter category name. Please try again!');
  }
  //filterCategory.length === 0 -> means the item is not in the list. Hence, 0.
  //If inserted user category name is spelled wrong, it will not be in the list. So, length will render 0.
  else if (filterCategory.length === 0) {
    printScreen(`Oops! <u>${userCat}</u> is a wrong name. Please enter a correct category name!`)
  }
  else {
    let count = 1;
    filterCategory.forEach(cat => {
      //printScreen(count++ + '. ' + cat.strMeal + ': ' + cat.strCategory) --> General code
      //To highlight the category within .js, I used style within span-tag
      printScreen(`${count++}. ${cat.strMeal}: <span style="color: red;">${cat.strCategory}</span>`)
    })
  }
})
