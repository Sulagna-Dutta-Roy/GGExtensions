@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(bg.jpg);
}

.container {
  position: relative;
  max-width: 300px;
  width: 100%;
  border-radius: 12px;
  padding: 20px 30px 30px; /* Increased padding */
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

header {
  color: #333;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.input_field {
  position: relative;
  height: 50px; /* Increased height */
  margin-top: 20px; /* Increased top margin */
  width: 100%;
}

.refresh_button {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: #1940a5;
  height: 40px; /* Increased height */
  width: 40px; /* Increased width */
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

.refresh_button:active {
  transform: translateY(-50%) scale(0.98);
}

.input_field input,
.button button {
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  border-radius: 8px;
  font-size: 18px; /* Increased font size */
}

.input_field input {
  padding: 0 15px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.captch_box input {
  color: #6b6b6b;
  font-size: 28px; /* Increased font size for captcha display */
  pointer-events: none;
}

.captch_input input:focus {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
}

.message {
  font-size: 16px; /* Increased font size */
  margin: 20px 0; /* Increased margin */
  color: #1940a5;
  display: none;
}

.message.active {
  display: block;
}

.button button {
  background: #1940a5;
  color: #fff;
  cursor: pointer;
  user-select: none;
}

.button button:active {
  transform: scale(0.99);
}

.button.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.difficulty select {
  height: 50px; /* Increased height */
  font-size: 18px; /* Increased font size */
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.error_message {
  font-size: 14px;
  color: red;
  margin-top: 10px;
}
