function showPassword() {
  const myPassword = document.getElementById("pwd");
  if (myPassword.type === "password") {
    myPassword.type = "text";
  } else {
    myPassword.type = "password";
  }
}
