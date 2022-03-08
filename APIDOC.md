# Anagrams API Documentation
Unique ID created for each game, return if the word a user sumbitted is a real word and
updates the game and score. Also keeps track of every word the user finds

## start a gmae
**Request Format:** "start"

**Request Type:** get

**Returned Data Format**: json

**Description:** when a game is started server generates and sends a unique player_ID


**Example Request:** fetch("start")

**Example Response:**
player_2343

```

```

**Error Handling:**
console logs potential error

## submit a word
**Request Format:** "/word"

**Request Type:** post

**Returned Data Format**: JSON

**Description:** updates the game score and word count and checks if the word is real

**Example Request:** /word

**Example Response:**
*Fill in example response in the {}*

```json
{
isWord: true
response: "Nice Find"
score: 300
words: 1
[[Prototype]]: Object
}
```

**Error Handling:**
checks if params are correctly passed

## ends a gmae
**Request Format:** "end"

**Request Type:** get

**Returned Data Format**: json

**Description:** when a game is ended server returns all words found


**Example Request:** fetch("end")

**Example Response:**
{
  hello
}