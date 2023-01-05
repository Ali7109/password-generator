const lengthSlider = document.querySelector(".pass-length input")

options = document.querySelectorAll(".option input")
generateBtn = document.querySelector(".generate-btn")

const characters = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "~`!@#$%^&*()_-+={[}]|::;\"'<,>.?"
}

generatePassword = () => {
    let staticPass = "",
        randomPassword = "",
        passLength = lengthSlider.value,
        spaces = false,
        duplicates = true,
        choices = 0
    options.forEach(option => {
        if (option.checked) {
            staticPass += characters[option.id]
            choices++;
            if (option.id === "ex-dup") {
                duplicates = false
            }
            if (option.id === "inc-spaces") {
                spaces = true
            }
        }
    });
    if (spaces) {
        staticPass.concat(staticPass.substring(0, 1), " ", staticPass.substring(3, staticPass.length))
    }
    for (let i = 0; i < passLength; i++) {
        let char = staticPass[Math.floor(Math.random() * staticPass.length)]
        if (!duplicates) {
            if (!randomPassword.includes(char)) {
                randomPassword += char
            } else {
                i--
            }
        } else {
            randomPassword += char
        }
    }

    let lengthStrength = passLength >= 15
    let variance = choices >= 4

    if (!lengthStrength && !variance) {
        document.querySelector(".pass-indicator").style.backgroundColor = "red"
        document.querySelector(".pass-indicator span").innerHTML = "Very Weak"
        document.querySelector(".pass-indicator").style.width = "25%"
    } else if (lengthStrength && variance) {
        document.querySelector(".pass-indicator").style.backgroundColor = "green"
        document.querySelector(".pass-indicator span").innerHTML = "Strong"
        document.querySelector(".pass-indicator").style.width = "100%"
    } else if (lengthStrength && !variance) {
        document.querySelector(".pass-indicator").style.backgroundColor = "yellow"
        document.querySelector(".pass-indicator span").innerHTML = "Good"
        document.querySelector(".pass-indicator").style.width = "75%"
    } else {
        document.querySelector(".pass-indicator").style.backgroundColor = "orange"
        document.querySelector(".pass-indicator span").innerHTML = "Weak"
        document.querySelector(".pass-indicator").style.width = "50%"
    }


    const output = document.querySelector(".input-box input")
    output.value = randomPassword
}
const updateSlider = () => {
    const len = document.querySelector(".pass-length .details span")
    len.innerHTML = lengthSlider.value;
}
const copy2clip = () => {
    const output = document.querySelector(".input-box input")
    navigator.clipboard.writeText(output.value);
    alert("Password copied to clipboard")
}

updateSlider()

lengthSlider.addEventListener("input", updateSlider)
generateBtn.addEventListener("click", generatePassword)
