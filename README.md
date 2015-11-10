# eli5-scraper

A [Sails](http://sailsjs.org) application that scrapes posts from [/r/explainlikeimfive](https://www.reddit.com/r/explainlikeimfive/), stores them in DB and displays them on a frontent. It scrapes the best posts of all time at startup and the frontpage every 24 hours. 

# Installation

* Install [Node.js](https://nodejs.org)
* Install Git and clone projects: $ git clone https://github.com/danielschleindlsperger/eli5-scraper.git
* Navigate to directory $ cd eli5-scraper
* Install Sailsjs framework: $ npm install -g sails
* Install Node dependencies: $ npm install
* Set up a database of your choice
* Add it by editing the aptly named entry 'eli5-mysql' in config/connections.js. I preferred MySQL because of ease of setup.
* Lift the app: $ sails lift
* Navigate your browser to http://localhost:1337/ and check out the app
