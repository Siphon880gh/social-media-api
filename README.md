Social Media API
====
![Last Commit](https://img.shields.io/github/last-commit/Siphon880gh/social-media-api/master)
<a target="_blank" href="https://github.com/Siphon880gh" rel="nofollow"><img src="https://img.shields.io/badge/GitHub--blue?style=social&logo=GitHub" alt="Github" data-canonical-src="https://img.shields.io/badge/GitHub--blue?style=social&logo=GitHub" style="max-width:100%;"></a>
<a target="_blank" href="https://www.youtube.com/user/Siphon880yt/" rel="nofollow"><img src="https://camo.githubusercontent.com/0bf5ba8ac9f286f95b2a2e86aee46371e0ac03d38b64ee2b78b9b1490df38458/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f596f75747562652d7265643f7374796c653d666c6174266c6f676f3d796f7574756265266c6162656c436f6c6f723d726564" alt="Youtube" data-canonical-src="https://img.shields.io/badge/Youtube-red?style=flat&amp;logo=youtube&amp;labelColor=red" style="max-width:100%;"></a>  <a target="_blank" href="https://www.linkedin.com/in/weng-fung/" rel="nofollow"><img src="https://camo.githubusercontent.com/0f56393c2fe76a2cd803ead7e5508f916eb5f1e62358226112e98f7e933301d7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c696e6b6564496e2d626c75653f7374796c653d666c6174266c6f676f3d6c696e6b6564696e266c6162656c436f6c6f723d626c7565" alt="Linked-In" data-canonical-src="https://img.shields.io/badge/LinkedIn-blue?style=flat&amp;logo=linkedin&amp;labelColor=blue" style="max-width:100%;"></a>  <a target="_blank" href="https://www.paypal.com/donate?business=T42BK25TYPZSA&item_name=Buy+me+coffee+%28I+develop+free+apps%29&currency_code=USD" title="Donate to this project using Buy Me A Coffee" alt="Paypal"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>


Description
---
Social media backend with users, thoughts, and reactions. This is a MongoDB-Mongoose-Node database and restful API routes. Can be incorporated into your React app in a MERN stack.

Video Walkthrough
---
Coming soon

Screenshot
---
![API Test](README/api-test.png)

Table of Contents
---
- [Description](#description)
- [Video Walkthrough](#video-walkthrough)
- [Screenshot](#screenshot)
- [Installation](#installation)
- [Schema](#schema)
- [API Routes](#api-routes)
- [Tests](#tests)
- [Questions](#questions)

Installation
---
1. Run `npm install`. 

2. Open mongod server by running the command `mongod`.

3. You may want to seed some data so you can test out the database by running `npm run seed`. 

4. Now you can run the API on localhost with `npm start`. Open an API test tool to "localhost:3001/api/<API_ENDPOINT>" and change the request method to the appropriate one. This can be Insomnia Core or Postman.

5. Look into the [Tests](#tests) section for further instructions. Once you are satisfied, you can adapt this code to your node project.

Schema
---
![Database Schema](README/schema.png)

API Routes
---

### `/api/users`

- GET all users
- POST a new user
    - Test case:

        ```
        body: 
        {
            "username": "NEW_USER_FOR_DEMO",
            "email": "fake-email-20210223@fake-domain.com"
        }
        ```


### `/api/users/:userId`

- GET a single user by its \_id and populate its thought and friend data
- PUT to update a user by its \_id
    - Test case:

        ```
        body: 
        {
            "email": "testUser@updated-domain.com"
        }
        ```

- [x] DELETE to remove user by its \_id

### `/api/users/:userId/friends/:friendId`

- POST to add a new friend to a user's friend list
- DELETE to remove a friend from a user's friend list

### `/api/thoughts`

- GET to get all thoughts
- POST to create a new thought (and push the created thought's \_id to the associated user's thoughts array field)
    - Test case:

        ```
        body: 
        {
            "username": "testUser",
            "thoughtText": "I am a thought"
        }
        ```

### `/api/thoughts/:thoughtId`
- GET to get a single thought by its \_id
- PUT to update a thought by its \_id
    - Test case:

        ```
        body: 
        {
            "thoughtText": "I am thinking of another..."
        }
- DELETE to remove a thought by its \_id

### `/api/thoughts/:thoughtId/reactions`

- POST to create a reaction stored in a single thought's reactions array field
    - Test case:

        ```
        body: 
        {
            "reactionBody": "I am reacting to your thought",
        }

### `/api/thoughts/:thoughtId/reactions/:reactionId`
- DELETE to pull and remove a reaction by the reaction's reactionId value


Tests
---
The database tests can be ran with `npm run test`

You can test each routes at [API route checklist](./Tests.md).


Questions
---
- Where can I see more of your repositories?
	- Visit [Siphon880gh's Repositories](https://github.com/Siphon880gh)

- Where can I reach you?
	- You can reach me with additional questions at <a href='mailto:weffung@ucdavis.edu'>weffung@ucdavis.edu</a>.
	- Want to [hire me](https://www.linkedin.com/in/weng-fung/)?