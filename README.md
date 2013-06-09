Mock Equestrian Wars
====================

The Mock Equestrian Wars Browser Game

This repo Contains the code for the 3 servers that run the game.

The Rails JSON API that provides user data
The Node.js Push server that provides updates
and the Resource server that provideds game code and image/audio/XML resources to load the client side of the game

 Cloud 9
-----------

For those of you who are working in our Cloud9 workspaces please note that there are 3

|Workspace URL|Description|
|-------------|:-----------:|
|https://c9.io/ryex/mew | is the workspace for the Ruby Rails back API |
|https://c9.io/ryex/mew_resource | is the workspace for the CakePHP back resource server|
|https://c9.io/ryex/mew_node | is the workspace for the Node.JS backed websocket push server|

each one uses a partial checkout of this repo and has different deploy setting for development


Cloud 9 is a cloud IDE that meas all the changes are hosted in the cloud sand box and if there are multiple people working at once their changes will all be made to the same working copy.
This also mean noone hass to bother with setting up their own local envierment.

to learn more visit their features page
https://c9.io/site/features/

or watch some of their training videos (recamended)
http://www.youtube.com/user/c9ide/videos?view=pl

***

### Rails

#### Running the Server

your going to need to use the c9 terminal not the c9 debug run button to run the rails server 
run the following and you should get it up with no problem

```
 @mew:~/523353 (master) $ cd rails/
 @mew:~/523353/rails (master) $ ./serverstart.sh

```
you should be able to use the `tab` button to autocompleate both commands once you typed part of it

#### Resource

#### Running the Server
the resource server can't be hosted directly on C9
as such there is a remote FTP space on our server to push the changes if you need to test

ctrl+alt+d 

in the IDE should bring up the FTP deploy screen with the details already there, just make sure the local path is set to

/resources

and the remote path is blank

### Node

#### Running the Server

TODO

***

### Commiting your changes

The workspace is hosted remotly by Cloud9 and has it's own 'local' version of the git repo to push your changes to the project to the github repo you'll need to use the terminal
```
 # add all the new files/changes, run it in dry mode first to see what all it will add to the repo
 # if you see a file you dont want add it the the .gitignore file at the bottom then commit only the changes to the ignore file before trying to add 'all' with the .
 @mew:~/523353 (master) $ git add . -n
 #you'll get a list of files that will be added
 #this next line will actualy add the files
 @mew:~/523353 (master) $ git add .
 #now we commit to the local repo
 @mew:~/523353 (master) $ git commit -m your commit message goes here
 
 #alternitivly if you want to put more than one line in your message
  @mew:~/523353 (master) $ git commit -m "This is the first line
  > this is the second line
  > this is the 3d line
  > this is the final line"
  
  #and now that we have commited to the repo local we need to push thouse changes to the github repo
  @mew:~/523353 (master) $ git push origin
```
 
### Getting the recent changes 
 
if the the files in the workspace have been changed on the github repo we need to pull them in
 
```
 #this command will pull in all remote changes adn merge them
 @mew:~/523353 (master) $ git pull origin master
```
 
you may need to commit any local changes first for the commadn to work
if there were local changed AND remote changed git will atempt to merge the files and if it cant it will notify you of conflicts. 
see the git documentation for more information
http://git-scm.com/book/en/Git-Branching-Basic-Branching-and-Merging
 
if you need help with the merge get someone else more knoledgeable to do it.

