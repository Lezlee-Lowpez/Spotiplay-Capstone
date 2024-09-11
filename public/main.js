// My front end where requests are made to the backend and then executed
const myButton = document.getElementById("PressPlay");
const loginForm = document.getElementById("loginForm");
const signUpForm = document.getElementById("signUpForm");

//This is gonna be the logic for hiding sections of my css
function hideAllSections() {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
}
// This is for my HOW TO PLAY
document.getElementById('howToPlayBtn').addEventListener('click', function() {
    hideAllSections(); // Hide all the sections
    document.getElementById('howToPlaySection').classList.remove('hidden'); // Show the how to play instructions
});
document.getElementById('backBtn').addEventListener('click', function() {
    hideAllSections(); // Hide all the sections
    document.getElementById('home').classList.remove('hidden'); // Show the home section
});

// THIS IS FOR MY SIGN UP PAGE
document.getElementById('signupBtn').addEventListener('click', function() {
    hideAllSections(); // Hide all the sections
    document.getElementById('signupSection').classList.remove('hidden'); // Show the how to play instructions
    document.body.style.backgroundColor = 'rgb(144, 238, 221)'
});
document.getElementById('backBtn1').addEventListener('click', function() {
    hideAllSections(); // Hide all the sections
    document.getElementById('home').classList.remove('hidden');
    document.body.style.backgroundColor = "rgb(57, 0, 243)" // Show the home section
});
//THIS IS FOR MY LOGIN PAGE
document.getElementById('loginBtn').addEventListener('click', function() {
    hideAllSections(); // Hide all the sections
    document.getElementById('loginSection').classList.remove('hidden'); // Show the how to play instructions
    document.body.style.backgroundColor = "rgb(213, 243, 121)"
});
document.getElementById('backBtn2').addEventListener('click', function() {
    hideAllSections(); // Hide all the sections
    document.getElementById('home').classList.remove('hidden');
    document.body.style.backgroundColor = "rgb(57, 0, 243)" // Show the home section
});
//This is for AFTER LOGIN
const getTrack = () => {
    return axios.get(`https://spotiplay-capstone.onrender.com/api/getTrackUrl`).then((res)=> {
        //this just returns the url and the name so 
        const myUrl = res.data.preview_url
        const nameOfSong = res.data.name.toUpperCase()
        console.log("This is printing my URL but its everything to see:", myUrl)
        //in js you have to do multi returns in an object
        return {myUrl, nameOfSong};
    })
};
let guessTimeout;
let countDown;
let currentSongName;

const playAudio = async () => {
    clearTimer(); // Make sure to clear any existing timer before starting a new one
    try {
        const track = await getTrack();
        const playUrl = track.myUrl;
        currentSongName = track.nameOfSong;
        console.log('Current song url:', playUrl);
        console.log('Current song Name:', currentSongName);

        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = playUrl;
        audioPlayer.play();

        let timeLeft = 30; // Reset time left for the round
        document.getElementById('timerDisplay').textContent = timeLeft;

        countDown = setInterval(() => {
            timeLeft--;
            document.getElementById('timerDisplay').textContent = timeLeft;

            if (timeLeft <= 0) {
                clearTimer(); // Stop the timer
                if (document.getElementById('gameInterface').classList.contains('hidden') === false) {
                    processGuess(); // Only call processGuess if the game interface is still visible
                }
            }
        }, 1000);
    } catch (err) {
        console.error("Error playing audio:", err);
    }
};

// this is a click instead of submit and i dont like it
document.getElementById('submitGuess').addEventListener('click', userSubmittedGuess);

function clearTimer() {
    if (countDown) {
        clearInterval(countDown);
        countDown = null; // Reset the countDown variable
    }
}

function userSubmittedGuess() {
    clearTimer()
    clearTimeout(guessTimeout);
    processGuess();

    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
}

function checkLogin(event) {
    event.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    axios.post(`https://spotiplay-capstone.onrender.com/api/login`, { username, password })
    .then(res => {
        if (res.data.success) {
            console.log("Login successful");
            alert("Login in successful!")

            localStorage.setItem('userId', res.data.userId);

            hideAllSections();

            document.getElementById('gameInterface').classList.remove('hidden');
            document.body.style.backgroundColor = "rgb(255, 60, 208)" 
   
        } else {
            console.log("Login failed: ", res.data.message);
            alert("Login Failed. Please try again or Sign Up.")
           
        }
    })
    .catch(err => {
        // If there was a problem with the request itself (e.g., server error)
        console.error("Login request failed", err);
        alert("Login Failed. Please try again or Sign Up.");
    });
};
    function signUp(event) {
        // input user credentials in my database 
        event.preventDefault();

        // save input to vars 
        const username = signUpForm.querySelector('input[name="username"]').value
        const password = signUpForm.querySelector('input[name="password"]').value


        //send to back end
        axios.post(`https://spotiplay-capstone.onrender.com/api/signUp`, {username, password})
        .then(response => {
            console.log(response.data)
            alert("Sign up successful!")
            // redirect user here or something 
        })
        .catch(err => {
            console.log("Sign up failed", err)
            alert("Sign up failed, Please try again.")
        })

    };

    function displayScore(newScore) {
        document.getElementById('newScoreGood').textContent = `${newScore}`;
        document.getElementById('newScoreBad').textContent = `${newScore}`;
    }
    
    async function processGuess() {
        clearTimer();
        const userGuess = document.querySelector('#gameInterface input').value.toUpperCase();
        console.log("User guess:", userGuess);
    
        const userId = localStorage.getItem('userId');
        let pointsToAdd = userGuess === currentSongName ? 5 : 0; // Only add points for correct guesses
    
        document.getElementById('gameInterface').classList.add('hidden');
    
        alert("Time is up!");
    
        if (userGuess === currentSongName) {
            console.log("Correct!");
            document.getElementById('resultGoodFeedback').classList.remove('hidden');
            document.body.style.backgroundColor = "rgb(198, 243, 89)";
        } else {
            console.log("Not quite!");
            document.getElementById('resultBadFeedback').classList.remove('hidden');
            document.body.style.backgroundColor = "rgb(255, 61, 44)";
        }
    
        if (userId) {
            try {
                // Always call updateScore to fetch and display the current score.
                // If pointsToAdd is 0, the score won't change, but we still fetch the current score.
                const response = await axios.post(`https://spotiplay-capstone.onrender.com/api/updateScore`, { userId, points: pointsToAdd });
                console.log("Score fetched successfully");
                // Use the score from the response to update the HTML, even if pointsToAdd was 0.
                displayScore(response.data.updatedScore);
            } catch (error) {
                console.error("Error updating/fetching score:", error);
            }
        }
    
        document.querySelector('#gameInterface input').value = "";
        document.getElementById('timerDisplay').textContent = "30";
        currentSongName = "";
    };
    
    document.getElementById('rightBtn').addEventListener('click', startNewGame);
    document.getElementById('wrongBtn').addEventListener('click', startNewGame);

    function startNewGame() {
        document.getElementById('resultGoodFeedback').classList.add('hidden');
        document.getElementById('resultBadFeedback').classList.add('hidden');

        if (countDown) {
            clearInterval(countDown);
            countDown = null;
        }

        document.getElementById('timerDisplay').textContent = 30;

        document.getElementById('gameInterface').classList.remove('hidden');
        document.body.style.backgroundColor = "rgb(255, 60, 208)";
    }

myButton.addEventListener("click", playAudio);

loginForm.addEventListener('submit', checkLogin);

signUpForm.addEventListener('submit', signUp);