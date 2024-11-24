#include <Arduino.h>
#include <ArduinoJson.h>
#include "game.h"

JsonDocument doc;
String jsonString;

void setup() {
    Serial.begin(9600);
    winConditions["Rock"] = "Scissors";
    winConditions["Scissors"] = "Paper";
    winConditions["Paper"] = "Rock";
    for (int i = 0; i < 3; i++) lastMoves[i] = random(3);
}

void loop() {
    while (Serial.available()) {
        char c = Serial.read();
        jsonString += c;
        if (c == '}') {
            DeserializationError error = deserializeJson(doc, jsonString);
            JsonDocument response;
            String resp = "";
            if (error) {
                response["error"] = "Failed to parse JSON";
                serializeJson(response, resp);
                Serial.println(resp);
                return;
            }
            jsonString = "";
            String player1Choice = doc["player1Choice"];
            String player2Choice = doc["player2Choice"];
            if (!doc["player1Choice"]) player1Choice = randomChoice();
            if (!doc["player2Choice"]) {
                player2Choice = !doc["player1Choice"] ? randomChoice() : predict();
                addPlayerMove(playerChoiceToInt(player1Choice));
            }
            int winner = (player1Choice == player2Choice) ? 3 : (winConditions[player1Choice] == player2Choice) ? 1 : 2;
            response["winner"] = winner;
            response["player1Choice"] = player1Choice;
            response["player2Choice"] = player2Choice;
            serializeJson(response, resp);
            Serial.println(resp);
        }
    }
}
