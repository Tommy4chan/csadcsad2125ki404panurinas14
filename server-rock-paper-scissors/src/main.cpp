#include <ArduinoJson.h>

JsonDocument doc;
String jsonString;
JsonDocument winConditions;

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

/**
 * @brief Converts a numeric choice to its corresponding move in the game "Rock, Paper, Scissors".
 * 
 * @param choice An integer representing the player's choice:
 *               0 for Rock,
 *               1 for Paper,
 *               2 for Scissors.
 * @return String The corresponding move as a string ("Rock", "Paper", or "Scissors").
 */
String moveToString(int choice)
{
    if (choice == 0)
        return "Rock";
    if (choice == 1)
        return "Paper";
    return "Scissors";
}

/**
 * @brief Applies the Rectified Linear Unit (ReLU) activation function.
 *
 * The ReLU function returns the input value if it is greater than zero,
 * otherwise it returns zero. It is commonly used in neural networks to
 * introduce non-linearity.
 *
 * @param x The input value.
 * @return The output of the ReLU function.
 */
float relu(float x)
{
    return x > 0 ? x : 0;
}

/**
 * @brief Computes the softmax of an array of floats.
 *
 * The softmax function is a type of squashing function that maps an input array of real numbers
 * to an array of values between 0 and 1 that sum to 1. This is often used in machine learning
 * for converting raw scores (logits) into probabilities.
 *
 * @param x The input array of floats. The array is modified in place to contain the softmax values.
 * @param size The size of the input array.
 */
void softmax(float x[], int size)
{
    float max_val = x[0];
    for (int i = 1; i < size; i++)
        if (x[i] > max_val)
            max_val = x[i];
    float sum = 0;
    for (int i = 0; i < size; i++)
        sum += exp(x[i] - max_val);
    for (int i = 0; i < size; i++)
        x[i] = exp(x[i] - max_val) / sum;
}

/**
 * @brief Predicts the next move in a rock-paper-scissors game based on the last moves.
 *
 * This function uses a simple neural network with one hidden layer to predict the next move.
 * The network consists of an input layer with 3 neurons, a hidden layer with 8 neurons, and an output layer with 3 neurons.
 * The activation function used in the hidden layer is ReLU, and the output layer uses softmax to produce probabilities.
 *
 * @return A string representing the predicted move ("rock", "paper", or "scissors").
 */
String predict()
{
    float output[3];

    float hiddenLayer[8];
    for (int i = 0; i < 8; i++)
    {
        hiddenLayer[i] = hiddenBias[i];
        for (int j = 0; j < 3; j++)
        {
            hiddenLayer[i] += lastMoves[j] * inputWeights[j][i];
        }
        hiddenLayer[i] = relu(hiddenLayer[i]);
    }

    for (int i = 0; i < 3; i++)
    {
        output[i] = outputBias[i];
        for (int j = 0; j < 8; j++)
        {
            output[i] += hiddenLayer[j] * hiddenWeights[j][i];
        }
    }

    softmax(output, 3);

    int best_move = 0;
    if (output[1] > output[best_move])
        best_move = 1;
    if (output[2] > output[best_move])
        best_move = 2;

    return moveToString(best_move);
}

/**
 * @brief Generates a random choice for a rock-paper-scissors game.
 * 
 * This function generates a random integer between 0 and 2 (inclusive),
 * converts it to the corresponding string representation of "rock", "paper",
 * or "scissors", and returns it.
 * 
 * @return String The string representation of the random choice.
 */
String randomChoice()
{
    return moveToString(random(3));
}

/**
 * @brief Converts the player's choice from a string to an integer.
 * 
 * This function takes a string representing the player's choice in a 
 * rock-paper-scissors game and converts it to an integer. The mapping is as follows:
 * - "Rock" -> 0
 * - "Paper" -> 1
 * - "Scissors" -> 2
 * 
 * @param choice The player's choice as a string. It should be one of "Rock", "Paper", or "Scissors".
 * @return int The integer representation of the player's choice.
 */
int playerChoiceToInt(String choice)
{
    if (choice == "Rock")
        return 0;
    if (choice == "Paper")
        return 1;
    return 2;
}

/**
 * @brief Adds a new player move to the list of last moves.
 * 
 * This function shifts the existing moves in the `lastMoves` array to the right
 * and inserts the new move at the beginning of the array. The oldest move is 
 * discarded if the array is full.
 * 
 * @param newMove The new move to be added to the list of last moves.
 */
void addPlayerMove(int newMove) {
    for (int i = 3 - 1; i > 0; --i) {
        lastMoves[i] = lastMoves[i - 1];
    }

    lastMoves[0] = newMove;
}

void setup()
{
    Serial.begin(9600);
    winConditions["Rock"] = "Scissors";
    winConditions["Scissors"] = "Paper";
    winConditions["Paper"] = "Rock";

    for (int i = 0; i < 3; i++)
    {
        lastMoves[i] = random(3);
    }
}

/**
 * @brief Main loop function that reads from the serial input, processes JSON data, 
 *        and determines the winner of a rock-paper-scissors game.
 * 
 * This function continuously checks for available data on the serial input. When data is available,
 * it reads characters and appends them to a JSON string. Once a complete JSON object is detected 
 * (indicated by the '}' character), it attempts to deserialize the JSON string into a JsonDocument.
 * 
 * If deserialization fails, it sends an error message back via the serial output. If successful, 
 * it extracts player choices from the JSON document. If a player choice is missing, it generates 
 * a random choice or predicts the next move based on previous moves.
 * 
 * The function then determines the winner based on predefined win conditions and sends the result 
 * back via the serial output in JSON format.
 * 
 * @note The function assumes the existence of several helper functions and variables:
 *       - randomChoice(): Generates a random choice for the player.
 *       - predict(): Predicts the next move based on previous moves.
 *       - addPlayerMove(int): Records the player's move.
 *       - playerChoiceToInt(String): Converts a player's choice to an integer.
 *       - winConditions: A map or dictionary that defines the win conditions.
 */
void loop()
{
    while (Serial.available())
    {
        char c = Serial.read();
        jsonString += c;

        if (c == '}')
        {
            DeserializationError error = deserializeJson(doc, jsonString);
            JsonDocument response;
            String resp = "";

            if (error)
            {
                response["error"] = "Failed to parse JSON";
                serializeJson(response, resp);
                Serial.println(resp);
                return;
            }

            jsonString = "";
            String player1Choice = doc["player1Choice"];
            String player2Choice = doc["player2Choice"];

            if (!doc["player1Choice"])
            {
                player1Choice = randomChoice();
            }

            if (!doc["player2Choice"])
            {
                if (!doc["player1Choice"])
                {
                    player2Choice = randomChoice();
                }
                else
                {
                    player2Choice = predict();
                    addPlayerMove(playerChoiceToInt(player1Choice));
                }
            }

            int winner = 2;
            if (player1Choice == player2Choice)
            {
                winner = 3;
            }
            else if (winConditions[player1Choice] == player2Choice)
            {
                winner = 1;
            }

            response["winner"] = winner;
            response["player1Choice"] = player1Choice;
            response["player2Choice"] = player2Choice;
            serializeJson(response, resp);
            Serial.println(resp);
        }
    }
}