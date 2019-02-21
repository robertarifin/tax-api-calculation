## Notes: ##
* Need to install mocha(npm install -g mocha) globally to run the test
* Can use custom SECRET for jwt token by modifying the .env file

## Database Design ##
For Database Design, I just created 2 tables: User and Tax table as shown in DatabaseDesign.png. These two tables has relation of one to many  where the foreign key is userId since one user can has many items in his / her bill.

