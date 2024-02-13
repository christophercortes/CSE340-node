function showPassword() {
  const myPassword = document.getElementById("accountPassword");
  if (myPassword.type === "password") {
    myPassword.type = "text";
  } else {
    myPassword.type = "password";
  }
}
