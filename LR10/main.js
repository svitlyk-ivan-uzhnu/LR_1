const displayedImg = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');
const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

/* Looping through images */
for (let i = 1; i <= 5; i++) {
    const newImage = document.createElement('img');
    newImage.setAttribute('src', `images/pic${i}.jpg`);
    thumbBar.appendChild(newImage);
    
    // Додавання обробника події onclick для кожного зображення
    newImage.onclick = function(event) {
        const imgSrc = event.target.getAttribute('src');
        changeDisplayedImage(imgSrc);
    };
}

// Функція для зміни зображення, що відображається
function changeDisplayedImage(src) {
    displayedImg.setAttribute('src', src);
}

/* Wiring up the Darken/Lighten button */
btn.onclick = function() {
    const currentClass = btn.getAttribute('class');
    if (currentClass === 'dark') {
        btn.setAttribute('class', 'light');
        btn.textContent = 'Світліше';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    } else {
        btn.setAttribute('class', 'dark');
        btn.textContent = 'Темніше';
        overlay.style.backgroundColor = 'rgba(0,0,0,0)';
    }
};

