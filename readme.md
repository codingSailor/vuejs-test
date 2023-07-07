# For Backend :

1. cd server/

2. npm install 

3. node app.js


# For Frontend :

1. cd client/

2. npm install 

3. npm run dev

### Assignment Problem Scope:

## Backend

1. Create an Express App which listens on port 8080
2. Create a get API /countries which will provide list of countries [Only name and Id]
available in the data file
3. Create a get API /country/{country-id} which will return information of that country
based on country id.
4. Create a post API /country which will accept Country Object and save the details to the
data file and the image to the /images directory.

## Frontend

5. Create a UI
a. Which shows a dropdown of the current list of countries on load
b. Changing the value in the drop down should display the details of the current
selected country. (Name, Image, Rank)
c. User should be able to add a new country Name [Validation - Min 3 chars and
Max 20]
d. County Image - Only accept Jpg and Png and Max 4 MB
e. Continent should be selected from dropdown having unique values from the data
file
f.
Rank should accept only numeric values.
g. Once successful post, user should be able to see all the updated list of countries
from data file without page refresh
h. For server side validation. Country Name and Rank must be unique. Highlight
Error fields with Red Border after POST response if any.

