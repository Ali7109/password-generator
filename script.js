// Get references to the relevant HTML elements
const lengthSlider = document.querySelector(".pass-length input");
const options = document.querySelectorAll(".option input");
const generateBtn = document.querySelector(".generate-btn");

// Define character sets for different types of characters
const characters = {
	lowercase: "abcdefghijklmnopqrstuvwxyz",
	uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	numbers: "0123456789",
	symbols: "~`!@#$%^&*()_-+={[}]|::;\"'<,>.?",
};

//Password strength complexity algorithm
// Calculate password strength based on various factors
function calculatePasswordStrength(password) {
	const minLength = 8; // Minimum required password length
	const minVariety = 3; // Minimum character variety (lowercase, uppercase, digits, symbols)
	const minUnpredictability = 0.7; // Minimum unpredictability ratio

	const lengthFactor = Math.min(1, password.length / minLength);
	const varietyFactor = Math.min(
		1,
		calculateCharacterVariety(password) / minVariety
	);
	const unpredictabilityFactor =
		calculateUnpredictability(password) / minUnpredictability;

	const overallStrength =
		(lengthFactor + varietyFactor + unpredictabilityFactor) / 3;

	return overallStrength * 100;
}

// Calculate the variety of characters used in the password
function calculateCharacterVariety(password) {
	const categories = {
		lowercase: /[a-z]/,
		uppercase: /[A-Z]/,
		digits: /\d/,
		symbols: /[!@#$%^&*()_\-+={[}\]|:;'"<,>.?~`]/,
	};

	let variety = 0;
	for (const category in categories) {
		if (categories[category].test(password)) {
			variety++;
		}
	}
	return variety;
}

// Calculate the unpredictability ratio of the password
function calculateUnpredictability(password) {
	const entropy = calculateEntropy(password);
	const maxEntropy = Math.log2(
		Math.pow(characters.lowercase.length, password.length)
	);

	return entropy / maxEntropy;
}

// Calculate the entropy of the password
function calculateEntropy(password) {
	const uniqueCharacters = new Set(password);
	const characterCount = password.length;
	const uniqueCount = uniqueCharacters.size;

	return Math.log2(Math.pow(uniqueCount, characterCount));
}

// Function to generate a password based on user options
const generatePassword = () => {
	// Initialize variables
	let staticPass = "";
	let randomPassword = "";
	let passLength = lengthSlider.value;
	let spaces = false;
	let duplicates = true;
	let choices = 0;

	// Iterate through the options to build the character set
	options.forEach((option) => {
		if (option.checked) {
			staticPass += characters[option.id];
			choices++;
			if (option.id === "ex-dup") {
				duplicates = false;
			}
			if (option.id === "inc-spaces") {
				spaces = true;
			}
		}
	});

	// Insert spaces if specified by the user
	if (spaces) {
		staticPass =
			staticPass.substring(0, 1) +
			" " +
			staticPass.substring(3, staticPass.length);
	}

	// Generate the random password
	for (let i = 0; i < passLength; i++) {
		let char = staticPass[Math.floor(Math.random() * staticPass.length)];
		if (!duplicates) {
			if (!randomPassword.includes(char)) {
				randomPassword += char;
			} else {
				i--;
			}
		} else {
			randomPassword += char;
		}
	}

	// Determine password strength and update the indicator
	const indicator = document.querySelector(".pass-indicator");

	let complexity = calculatePasswordStrength(randomPassword);
	let indicatorVisualCol = indicator.querySelector("span");
	let indicatorStyle = indicator.style;

	indicatorStyle.width = `${complexity}%`;
	if (complexity > 90) {
		indicatorVisualCol.innerHTML = "Very Strong";
		indicatorStyle.backgroundColor = "green";
	} else if (complexity > 70) {
		indicatorVisualCol.innerHTML = "Strong";
		indicatorStyle.backgroundColor = "orange";
	} else if (complexity > 50) {
		indicatorVisualCol.innerHTML = "Moderate";
		indicatorStyle.backgroundColor = "yellow";
	} else {
		indicatorVisualCol.innerHTML = "Weak";
		indicatorStyle.backgroundColor = "red";
	}

	// Display the generated password in the output field
	const output = document.querySelector(".input-box input");
	output.value = randomPassword;
};

// Function to update the slider label based on its value
const updateSlider = () => {
	const len = document.querySelector(".pass-length .details span");
	len.innerHTML = lengthSlider.value;
};

// Function to copy the generated password to the clipboard
const copyToClipboard = () => {
	const output = document.querySelector(".input-box input");
	navigator.clipboard.writeText(output.value);
	alert("Password copied to clipboard");
};

// Initialize the slider label
updateSlider();

// Event listeners for slider input and generate button click
lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);
