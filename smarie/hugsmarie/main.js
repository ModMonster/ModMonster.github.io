hugCounter = 0

function hugSmarie()
{
  var smarie = document.getElementById("smarie")
  
  hugCounter++;

  if (hugCounter == 1) {    
    document.getElementById("hugCounter").innerHTML = "Smarie has been hugged " + hugCounter + " time!";
    smarie.classList.add("shake");

    // Smariesong!
    var smariesong = new Audio("smariesong.m4a");
    smariesong.play();
  }
  else {
    document.getElementById("hugCounter").innerHTML = "Smarie has been hugged " + hugCounter + " times!";
  }
  
  // Bounce a little Smarie!
  smarie.classList.add("bounce")
  setTimeout(function(){
      smarie.classList.remove("bounce")
  }, 500);
}