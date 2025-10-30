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

//To display the popup modal---
function showPopup(mealName, instructions) {
  // Get the popup modal element from HTML
  const modal = document.getElementById("popupModal");

  // Get elements inside the modal for title and text
  const popupTitle = document.getElementById("popupTitle");
  const popupText = document.getElementById("popupText");

  // Get the "close" (×) button
  const closePopup = document.getElementById("closePopup");

  // Set the meal name as the title of the popup
  popupTitle.textContent = mealName;

  // Set the instructions as the popup content
  popupText.textContent = instructions;

  // Display the popup (default CSS keeps it hidden)
  modal.style.display = "block";

  // When user clicks the close (×) button, hide the popup
  closePopup.onclick = () => modal.style.display = "none";

  // When user clicks anywhere outside the popup box, close it as well
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}



//To display each meal item on the screen---
function printScreen(mealObj, index) {
  // Create a new <div> for each meal
  let mealDiv = document.createElement('div');
  mealDiv.classList.add('mealNaD'); // Add CSS class for styling

  // Create a <p> tag to show the meal name and category
  let mealP = document.createElement('p');
  mealP.classList.add('mealNaP'); // Add CSS class for styling text

  // Add meal name and category into HTML
  // Make the meal name clickable with red color and underline
  mealP.innerHTML = `${index}. <span class="mealName"
      style="color: red; cursor: pointer; text-decoration: underline;">
      ${mealObj.strMeal}</span>: ${mealObj.strCategory}`;

  // Add click listener to the meal name span
  // When clicked, open popup showing that meal's instructions
  mealP.querySelector('.mealName').addEventListener('click', function() {
    showPopup(mealObj.strMeal, mealObj.strInstructions);
  });

  // Add the <p> into the meal <div>
  mealDiv.appendChild(mealP);

  // Finally, add the meal <div> into the main meal section in HTML
  mealSec.appendChild(mealDiv);
}



//To listen button function about the request---
mealCat.addEventListener("click", function() {
  // Remove all previous meal elements to refresh the section
  let removeElement = document.getElementsByClassName('mealNaD');
  [...removeElement].forEach(el => el.remove());

  // Get user input, convert it to lowercase, and remove extra spaces
  let userCat = catName.value.trim().toLowerCase();

  // Filter all meals that match the entered category
  let filterCategory = fullMeal.filter(cat => cat.strCategory.toLowerCase() === userCat);

  // If input field is empty, show error popup
  if (userCat === '') {
    showPopup('Error', 'Oops! You forgot to enter category name. Please try again!');
  }
  // If no meals match the entered category, show error popup
  else if (filterCategory.length === 0) {
    showPopup('Error', `Oops! "${userCat}" is not a valid category. Please try again.`);
  }
  // Otherwise, display all meals for that category
  else {
    let count = 1; // Counter for numbering
    filterCategory.forEach(cat => printScreen(cat, count++)); // Print each meal
  }
});
