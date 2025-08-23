# Loldle Classic — Solver

## Project Description
This is a "solver" tool to help you solve the game Loldle Classic, based on guessing champions from the game League of Legends. Built with pure JavaScript, the application analyzes your guessing history and the feedback you receive, then dynamically filters the list of potential candidates and suggests the next optimal moves.

## Features
* **Candidate Filtering:** Based on your guesses and the feedback provided (gender, positions, species, resource, range type, regions, release year), the tool narrows down the list of possible champions.
* **Optimal Guess Suggestions:** The algorithm evaluates which of the available champions (or just candidates) are the best next guesses. The evaluation is based on the sum of squares of the remaining candidates after each possible response, thereby minimizing the expected number of remaining candidates.
* **Guessing History:** The application stores your session's guessing history, allowing you to easily track your progress.
* **Session State Memory:** The game state is saved in the browser's local storage, so you can return to your session at any time.

## File Structure
* `index.html`: The main HTML file that defines the user interface structure.
* `styles.css`: CSS style definitions for the entire application.
* `champions.json`: A JSON file containing data for all champions, including their attributes like gender, positions, species, etc.
* `src/`: The directory for the JavaScript source code.
    * `data/`: Modules for loading and processing data.
    * `logic/`: Modules containing the core logic of the application (filtering, scoring).
    * `state/`: Modules for managing the application's state (localStorage).
    * `ui/`: Modules responsible for user interface logic (rendering, event handling).
    * `util/`: Utility modules, e.g., for data normalization or debugging.