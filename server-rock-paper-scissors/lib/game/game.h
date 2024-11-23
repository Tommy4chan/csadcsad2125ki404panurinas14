#ifndef GAME_LOGIC_H
#define GAME_LOGIC_H

#include <ArduinoJson.h>
#include <String.h>

extern int lastMoves[3];
extern float inputWeights[3][8];
extern float hiddenWeights[8][3];
extern float hiddenBias[8];
extern float outputBias[3];
extern JsonDocument winConditions;

String moveToString(int choice);
float relu(float x);
void softmax(float x[], int size);
String predict();
String randomChoice();
int playerChoiceToInt(String choice);
void addPlayerMove(int newMove);

#endif
