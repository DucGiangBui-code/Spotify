const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

// Switch to sign-up mode
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

// Switch to sign-in mode
sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Handle sign-up form submission
const signUpForm = document.querySelector(".sign-up-form");
signUpForm.addEventListener("submit", function (e) {
  e.preventDefault();
  // Here you would normally handle registration logic
  alert("Sign up successful! Please sign in.");
  container.classList.remove("sign-up-mode"); // Switch back to sign-in
});

// Handle sign-in form submission
const signInForm = document.querySelector(".sign-in-form");
signInForm.addEventListener("submit", function (e) {
  e.preventDefault();
  // Here you would normally handle authentication logic
  // For demo, get the username
  const username =
    signInForm.querySelector('input[type="text"]').value || "User";
  // Redirect to main web and pass username in URL
  window.location.href = `index.html?username=${encodeURIComponent(username)}`;
});
document.addEventListener("DOMContentLoaded", function () {
  const socialIcons = document.querySelectorAll('.social-icon');

  if (socialIcons.length) {
    socialIcons[0].addEventListener('click', function (e) {
      e.preventDefault();
      alert('You are connecting with Facebook!');
      window.open('https://www.facebook.com/login/', '_blank');
    });
    socialIcons[1].addEventListener('click', function (e) {
      e.preventDefault();
      alert('You are connecting with Twitter!');
      window.open('https://twitter.com/i/flow/login', '_blank');
    });
    socialIcons[2].addEventListener('click', function (e) {
      e.preventDefault();
      alert('You are connecting with Google!');
      window.open('https://accounts.google.com/signin', '_blank');
    });
    socialIcons[3].addEventListener('click', function (e) {
      e.preventDefault();
      alert('You are connecting with LinkedIn!');
      window.open('https://www.linkedin.com/login', '_blank');
    });
  }
});

window.handleGoogleSignIn = function(response) {
  // Decode the JWT to get the user's name
  const id_token = response.credential;
  const payload = JSON.parse(atob(id_token.split('.')[1]));
  const username = payload.name || payload.email || "User";

  // Redirect to main page with username in URL
  window.location.href = `index.html?username=${encodeURIComponent(username)}`;
};
