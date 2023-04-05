var users={p:'testuser'}

function sign_in_click(){

    var x = document.getElementById("welcome_page");
    x.style.display="none";
    document.getElementById("sign-in").style.display="block";
}
function sign_up_click(){
    var x = document.getElementById("welcome_page");
    x.style.display="none";
    document.getElementById("sign-up").style.display="block";
}
function sign_in_check(){
   var user_name = document.getElementById("username").value;
   var password = document.getElementById("password").value;
   console.log(user_name, password)
   console.log(users)
    var my_password = users[user_name];
    if(my_password==password){
        alert("move to game");
    }
   else{
        alert("wrong user name or password");
   }
}
function sign_up_check(){
    
}
