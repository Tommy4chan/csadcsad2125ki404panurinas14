# Details about repository
This repository contains a project for a hardware-based Rock Paper Scissors game using Arduino Nano and C++. The game logic and decision-making will run primarily on the Arduino Nano, while the C++ QT application will serve as a graphical interface for users to interact with the game.
 

# Task details
## Task 1
Main goals to this task is to create repository with main branch **develop**. Then create branch with name **feature/develop/task1** and create `README.md` file with all descriptions. Also create **TAG** and make pull request.

 ## Student details
| Student number | Game | config format |
| :-----------: | :-------------: | :-----------: |
| 14 | rock paper scissors | JSON |

## Technology Stack and Hardware Used

### Hardware
- **Arduino Nano**: The Arduino will handle most of the game logic, including managing inputs, processing the current game state, and sending data to the C++ QT application.

### Software
- **QT Creator**: Used for creating the graphical user interface (GUI) that displays the game board and allows users to view the game progress in real time.
- **Platformio**: To write and upload the logic code to the Arduino Nano, primarily using C/C++ for low-level control.

### Programming Languages
- **C/C++**: Used in the Arduino environment to develop the Rock Paper Scissors game logic and in graphical interface.
### Communication
- **Serial Communication**: The Arduino will communicate with the app through a UART serial port to send and receive game status and input data.
