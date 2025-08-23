# Loldle Classic — Solver


So basically this is a little tool I hacked together to make solving **Loldle Classic** easier (that browser game where you guess LoL champs). It’s just plain JavaScript, no frameworks, nothing fancy. The idea is: you type in your guesses, put in the hints the game gives you, and it spits out who it could be + some “best next guesses”.


## What it does
- Filters champs: based on stuff like gender, role, species, resource, range, region, year, etc. Every guess + hint cuts down the list.
- Suggests guesses: it actually tries to figure out which champs are the smartest guesses to make next. Bit of math behind it (basically tries to keep the remaining options as small as possible).
- Keeps history: your guesses aren’t lost, you can scroll back and see what you already tried.
- Remembers session: uses localStorage so if you refresh/come back later, you don’t lose progress.


## How it’s set up
- `index.html`: the UI skeleton.
- `styles.css`: just some basic styling.
- `champions.json`: all the champ data (gender, role, resource, etc.).
- `src/`: all the code.
- `data/`: loads & parses the champ data.
- `logic/`: the actual brain (filtering, scoring, etc.).
- `state/`: saving and loading stuff from localStorage.
- `ui/`: renders the guesses and handles clicks.
- `util/`: random helpers.


That’s it. Nothing too crazy, just a helper for people who like solving Loldle a bit quicker without racking their brains too much.
