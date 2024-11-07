import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.utils import to_categorical

def generate_data(samples=1000):
    X, y = [], []
    for _ in range(samples):
        sequence = np.random.choice(3, size=3)
        next_move = (sequence[-1] + 1) % 3
        X.append(sequence)
        y.append(next_move)
    return np.array(X), to_categorical(y, num_classes=3)

def numpy_to_cpp_array(name, array):
    cpp_array = f"float {name}"
    if array.ndim == 1:
        cpp_array += f"[{array.shape[0]}] = {{"
        cpp_array += ", ".join(f"{x:.6f}" for x in array)
    elif array.ndim == 2:
        cpp_array += f"[{array.shape[0]}][{array.shape[1]}] = {{\n"
        for row in array:
            cpp_array += "    { " + ", ".join(f"{x:.6f}" for x in row) + " },\n"
    cpp_array += "};\n"
    return cpp_array

X_train, y_train = generate_data()

model = Sequential([
    Dense(8, input_shape=(3,), activation='relu'),
    Dense(3, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=50, verbose=1)

weights = model.get_weights()
for i, layer_weights in enumerate(weights):
    cpp_code = numpy_to_cpp_array(i, layer_weights)
    print(cpp_code)
    print() 