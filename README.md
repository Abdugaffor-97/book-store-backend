# strive-books-api

[Frontend](https://github.com/Abdugaffor-97/book-store-frontend)

Upgrade Strive Books API!

You are in charge of including new features in the Strive Books API.
You can start from the version we built this morning.
A comment could be posted by a user to whatever book he likes.
A comment is defined by:
    
    - CommentID //Server Generated
    - UserName
    - Text
    - Date //Server Generated
    //BACKEND
    Add the following features:
    POST /books/id/comments => adds a comment for book {id}
    GET /books/id/comments => gets all the comments for book {id}
    DELETE /books/comments/id => delete comment {id}
    

//FRONTEND
You need now to connect your previously created React App for Strive books.
Modify the previous application in order to use your own API.
//CLOUD
Deploy everything on 2 instances on HEROKU (one for client, one for server)
If you have troubles with running on heroku remind to configure start scripts for both of them
Configure CORS to make them work together.


.env vvariables :

- FE_URL= ~prod/dev
- DATABASE_URL= ~prod/dev
- PORT= ~ development
