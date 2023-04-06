//Variables
var users={p:'testuser'}
var currnet_user = null;
var records = {};//{user_name:score}
var score = 0;
var game_started = false;

// function that is called when the user click on the sign in button
function sign_in_click(){

    document.getElementById("welcome_page").style.display="none";
    document.getElementById("sign-in").style.display="block";
}
// function that is called when the user click on the sign up button
function sign_up_click(){
    var x = document.getElementById("welcome_page");
    x.style.display="none";
    document.getElementById("sign-up").style.display="block";
}
// checking if the user name and password are correct
function sign_in_check(){
    var user_name = document.getElementById("username1").value;
    var password = document.getElementById("password-in").value;
    var my_password = users[user_name];
    if(my_password==password){
        currnet_user = user_name;
        alert("move to game");
    }
    else{
        alert("wrong user name or password");
    }
}
// checking if the user name is already exists and if not, add it to the users dictionary
function sign_up_check(){
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    var user_name = document.getElementById("username2").value;
    var password = document.getElementById("password-up").value;
    var confirm_password = document.getElementById("psw-repeat").value;
    console.log(user_name, password, confirm_password)
    var email = document.getElementById("email").value;
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(password == confirm_password){
        if(!(user_name in users)){
            if(regex.test(password) == true){
                if(email_regex.test(email) == false){
                    alert("email is not valid");
                }else{
                users[user_name]=password;
                alert("move to game");
            }
            }
            else{
                alert("password must be at least 8 characters long, and must contain at least one number and one letter.");
            }
        }
        else{
            alert("user name already exists");
        }
    
    }
    
}
// function that is called when the user click on back button
function back_to_welcome(){
    document.getElementById("welcome_page").style.display="block";
    document.getElementById("sign-in").style.display="none";
    document.getElementById("sign-up").style.display="none";
}
function start{
    game_started = true;
}
