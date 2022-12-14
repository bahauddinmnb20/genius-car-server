/**
 * ONE TIME for your computer
 * 1. create heroku account
 * 2.verify email
 * 3. install heroku cli
 * 4. login heroku
 * -------------------
 * for each project one time
 * 1. heroku create
 * 2. make sure you: git add . git commit. git push
 *3. git push heroku main
 4. Go to heroku Dashboard> current project> setting> reveal config vers
 * 5. copy paste config vars from your .env file
 * 6.make sure you have whitelisted all ip address to access mongodb
 * -----------------------------------------
 * UPDATE SERVER with your changes
 * ----------------------------------
 * 1.make changes
 * 2. make sure you: git add . git commit. git push
 *3. git push heroku main
 * 
 * ----------------------------------------
 * connect server with client
 * 1.replace localhost by heroku link
 * 2.npm run build
 * 3.firebase deploy
 */