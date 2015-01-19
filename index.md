---
layout: default
title: Home
---

<head>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js"></script>
<script src="add_counties.js"></script>
</head>

# Yo! This is a decision tool!

## Enter the counties you're interested in: 

Type a new county and hit enter, then enter the next county. Press `RUN` when
you've finished selecting.

<h3>Enter New County: 
<input type="text" name="county" id="county" placeholder="Latah"
autocapitalize="words">
</input>
</h3>

<button id="Add">Add County</button>

## You've selected

<p id="counties">No counties yet!</p>

## Run Decision Tool on Selected Counties

<button id="Run"> <h3> RUN </h3> </button>
