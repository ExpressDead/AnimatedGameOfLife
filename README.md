# AnimatedGameOfLife

## Overview

An animated variation of Conway's Game of life. 

Conway's game of life is an interesting study and can be used to generate some intriging patterns within the grid. I'm not going to go into that here. For now, I'm interested in using the basic rules as the basis of a simple game development excercise that is primarily focused on animation. Game of Life just seemed like a fun an interesting approach for gaining some practical experience in game development.

This is 100% a project of interest rather than need, but if you have stumbled upon it after being complete (with a version published) I hope that you enjoy it! If you have stumbled on this game too early it isn't published yet. Come back later to find out where you can [play](#playing-the-game).

## Rules

The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

- Any live cell with fewer than two live neighbours dies, as if by underpopulation.
- Any live cell with two or three live neighbours lives on to the next generation.
- Any live cell with more than three live neighbours dies, as if by overpopulation.
- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

These rules, which compare the behaviour of the automaton to real life, can be condensed into the following:

- Any live cell with two or three live neighbours survives.
- Any dead cell with three live neighbours becomes a live cell.
- All other live cells die in the next generation. Similarly, all other dead cells stay dead.

The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed, live or dead; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations.

*Notes:* 

- The rules outlined where [taken from this wikipedia article](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).
- I take security series and that comes with the realization that there is always the possibility of missing something, or the tech changing. If you find a security vulnerability with the code or published game please see the [security policy](/SECURITY.md) for communicating it with me. 

## Playing the Game

Sorry! You have arrived to early. Please come back or quick travel to a time after the game is complete and published...
