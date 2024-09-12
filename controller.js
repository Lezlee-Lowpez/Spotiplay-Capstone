require('dotenv').config()
const {DATABASE_URL} = process.env

const Sequelize = require('sequelize')
const sequelize = new Sequelize(DATABASE_URL, {
    logging: console.log,
  })

//functions used by my server backend will be organized here
//import my spotify access token here
const axios = require('axios');
const { getAccessToken } = require('./spotify_access');
const base_url_for_requests = 'https://api.spotify.com/v1';
const list_Of_Ids = ['1zxfRSZcaonV1VXcY0PgY5?si=243c6b865073443b', '1hGy2eLcmC8eKx7qr1tOqx?si=d415676cc4c541dc', '3qhlB30KknSejmIvZZLjOD?si=a0a27b1cb62e405a','4iZ4pt7kvcaH6Yo8UoZ4s2?si=ab925ec2342f4274','1Lo0QY9cvc8sUB2vnIOxDT?si=3f47fde0b2a24848', '3dnP0JxCgygwQH9Gm7q7nb?si=03799bfac2dc4bbd', '6gZVQvQZOFpzIy3HblJ20F?si=d97991c966b84609', '0HJRAM7Gt9jXskuXjZeFX3?si=982f9fcdc0a54635', '7KrlNS2VqiNNJ82RMQdxBn?si=aded2c5d2ca84b18']
let seen_index = []

module.exports = {
    getTrackInfo: async (req, res) => {
        try {
            // Since getAccessToken is asynchronous, I have to wait for its result
            const accessToken = await getAccessToken();
            
            let random_index;
            do {
                random_index = Math.floor(Math.random() * 9);

            } while (seen_index.includes(random_index));

            seen_index.push(random_index);

            if (seen_index.length === list_Of_Ids.length) {
                seen_index = []
            }

            const id = list_Of_Ids[random_index]
            
            console.log('this is the random index chosen:', id)

            
            // Await the axios call to complete since it's also asynchronous
            const response = await axios.get(`${base_url_for_requests}/tracks/${id}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            
            // Send back the data
            res.status(200).send({
                preview_url: response.data.preview_url,
                name: response.data.name
            });
            console.log(response.data.preview_url, ':', response.data.name)
            
        } catch (error) {
            console.log("Error in getting track info:", error);
            res.status(500).send("Error:Check your getTrackInfo function.");
        }
    },
// interacting with my DB here!!
getLogin: (req, res) => {
    console.log("Login request received:", req.body)
    const { username, password } = req.body;
    
    sequelize.query(`
        SELECT * FROM users WHERE username = :username AND password = :password;
    `, { 
        replacements: { username: username, password: password},
        type: Sequelize.QueryTypes.SELECT 
    })
    .then(users => {
        if (users.length > 0) {
            // User found
            const user = users[0]
            return res.status(200).json({ success: true, message: "Login successful", userId: user.id });
        } else {
            // User not found
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    })
    .catch(err => {
        console.error("Login query failed:", err);
        return res.status(500).send("Error during login");
    });
},

    signUp: (req, res) => {
        // when i get a response from the front end i want to parse that response and input it in my db
        const {username, password} = req.body;

        // console.log("Lesley this is what the back end is receiving during sign ups:", req.body)
      
// might have an issue not getting set in as strings les
        sequelize.query(`
        INSERT INTO users (username, password)
        VALUES (:username, :password);
        `, { 
            replacements: { username, password }, 
        })
        .then(() => {
             return res.status(200).send("User created successfully.");
    })
        .catch(err => {
        console.log("There was an error creating the user:", err);
        return res.status(500).send("Error during sign up.");
        });

    },

    updateScore: (req, res) => {
        const { userId, points } = req.body;
        console.log("This is the user id and points:", userId, points)
        console.log("I am printing the body too jus to look at it: ", req.body)
    
        // Update the score and return the updated score in the same query
        sequelize.query(`
            SELECT * FROM scores WHERE user_id = :userId;
        `, {
            replacements: { userId },
            type: sequelize.QueryTypes.SELECT
        })
        .then(result => {
            if (result.length === 0) {
                // No entry exists, insert a new row with the initial score
                return sequelize.query(`
                    INSERT INTO scores (user_id, score) VALUES (:userId, :points)
                    RETURNING score;
                `, {
                    replacements: { userId, points },
                    type: sequelize.QueryTypes.INSERT
                });
            } else {
                // Entry exists, update the score
                return sequelize.query(`
                    UPDATE scores SET score = score + :points WHERE user_id = :userId RETURNING score;
                `, {
                    replacements: { userId, points },
                    type: sequelize.QueryTypes.UPDATE
                });
            }
        })
        .then((result) => {
            console.log("Result of query:", result);
            const updatedScore = result[0][0].score;
            return res.status(200).json({ message: "Score updated successfully.", updatedScore });
        })
        .catch(err => {
            console.error("Error updating score:", err);
            return res.status(500).send("Error updating score");
        });
    }   
};    