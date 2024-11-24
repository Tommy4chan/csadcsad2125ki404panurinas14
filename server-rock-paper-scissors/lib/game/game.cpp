#include "game.h"
#include <ArduinoJson.h>

int lastMoves[3];
float inputWeights[3][8] = {
    {0.153426, 0.547693, 0.122109, 0.439899, 0.546894, 0.439505, 0.145383, 0.257606},
    {0.171111, -0.401668, 0.069744, -0.851256, 0.667974, 0.300057, 0.103562, 0.678151},
    {1.111694, -0.009917, 1.976872, 0.006001, 0.115645, 0.364659, 0.940397, -0.902065},
};
float hiddenWeights[8][3] = {
    {0.804684, -1.282053, 0.335981},
    {-0.450472, -0.130367, -0.340924},
    {0.617688, -1.746359, 0.093773},
    {-1.098668, 0.399702, 0.018028},
    {-0.327865, 0.498658, 0.591891},
    {0.278758, -0.548902, -0.742056},
    {1.374351, -1.441604, -0.971736},
    {-1.804082, 1.326259, -0.090229},
};
float hiddenBias[8] = {-0.211966, 0.226446, -0.129866, 0.805082, 0.822114, -0.379106, -0.669373, 1.362221};
float outputBias[3] = {-0.727954, 0.467537, 0.264352};
JsonDocument winConditions;

String moveToString(int choice) {
    if (choice == 0) return "Rock";
    if (choice == 1) return "Paper";
    return "Scissors";
}

float relu(float x) {
    return x > 0 ? x : 0;
}

void softmax(float x[], int size) {
    float max_val = x[0];
    for (int i = 1; i < size; i++) if (x[i] > max_val) max_val = x[i];
    float sum = 0;
    for (int i = 0; i < size; i++) sum += exp(x[i] - max_val);
    for (int i = 0; i < size; i++) x[i] = exp(x[i] - max_val) / sum;
}

String predict() {
    float output[3];
    float hiddenLayer[8];
    for (int i = 0; i < 8; i++) {
        hiddenLayer[i] = hiddenBias[i];
        for (int j = 0; j < 3; j++) hiddenLayer[i] += lastMoves[j] * inputWeights[j][i];
        hiddenLayer[i] = relu(hiddenLayer[i]);
    }
    for (int i = 0; i < 3; i++) {
        output[i] = outputBias[i];
        for (int j = 0; j < 8; j++) output[i] += hiddenLayer[j] * hiddenWeights[j][i];
    }
    softmax(output, 3);
    int best_move = 0;
    if (output[1] > output[best_move]) best_move = 1;
    if (output[2] > output[best_move]) best_move = 2;
    return moveToString(best_move);
}

String randomChoice() {
    return moveToString(random(3));
}

int playerChoiceToInt(String choice) {
    if (choice == "Rock") return 0;
    if (choice == "Paper") return 1;
    return 2;
}

void addPlayerMove(int newMove) {
    for (int i = 3 - 1; i > 0; --i) lastMoves[i] = lastMoves[i - 1];
    lastMoves[0] = newMove;
}
