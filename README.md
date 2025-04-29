# Juego del Truco

## Introducción al Juego del Truco

El Truco es un juego de cartas tradicional que se juega con una baraja española. En esta versión simplificada, dos jugadores compiten en rondas para ganar puntos. Cada jugador recibe 3 cartas y juega una por turno. La carta con mayor jerarquía gana la ronda. El primer jugador en ganar 2 rondas es el ganador de la partida.

### Jerarquía de las Cartas

En el Truco, las cartas tienen una jerarquía específica que determina cuál es mejor. A continuación, se muestra un ejemplo de jerarquía (de mejor a peor):

1. **1 de Espadas**
2. **1 de Bastos**
3. **7 de Espadas**
4. **7 de Oros**
5. **3 de cualquier palo**
6. **2 de cualquier palo**
7. **1 de Copas o 1 de Oros**
8. **12, 11, 10 de cualquier palo**
9. **7 de Copas o 7 de Bastos**
10. **6, 5, 4 de cualquier palo**

El objetivo es jugar cartas estratégicamente para ganar rondas y, eventualmente, la partida.

---

## Tareas de los Alumnos

### Métodos a Implementar

1. **`obtenerMazoPorFetch`**
    - Realizar una solicitud `GET` a la API para obtener el mazo de cartas.
    - Mezclar las cartas usando la función `mezclar`.
    - Asignar el mazo mezclado a la variable global `mazo`.

2. **`guardarPartidaFetch`**
    - Crear un objeto con los datos de la partida (ganador, jugadas y fecha).
    - Enviar los datos a la API mediante una solicitud `POST`.

3. **`getHistorialPartidasFetch`**
    - Obtener el historial de partidas desde la API mediante una solicitud `GET`.
    - Actualizar la variable global `historialPartidas` y llamar a `mostrarEstado`.

4. **`repartirManos`**
    - Repartir 3 cartas a cada jugador desde el mazo.
    - Asegurarse de que las cartas repartidas se eliminen del mazo.

5. **`jerarquiaCarta`**
    - Determinar la jerarquía de una carta comparándola con el array `JERARQUIA`.
    - Devolver el índice correspondiente o el peor índice si no coincide.

6. **`jugarCarta`**
    - Remover una carta de la mano del jugador y almacenarla en la ronda actual.
    - Determinar el ganador de la ronda si ambos jugadores ya jugaron.
    - Cambiar el turno al otro jugador y actualizar el estado.

7. **`ganadorRonda`**
    - Comparar las cartas jugadas por ambos jugadores usando `jerarquiaCarta`.
    - Determinar el ganador de la ronda o si hubo empate.

8. **`ganadorPartida`**
    - Verificar si algún jugador ha ganado 2 rondas.
    - Devolver el índice del ganador o `null` si la partida no ha terminado.

9. **`mezclar`**
    - Implementar el algoritmo de Fisher-Yates para mezclar un array.

---

## Cómo Funciona el Juego

1. **Inicio de la Partida**
    - Al iniciar una nueva partida, se obtiene un mazo de cartas desde la API, se mezcla y se reparten 3 cartas a cada jugador.

2. **Turnos de los Jugadores**
    - Los jugadores alternan turnos para jugar una carta de su mano.
    - La carta jugada se almacena en la ronda actual.

3. **Determinación del Ganador de la Ronda**
    - Cuando ambos jugadores han jugado, se determina el ganador de la ronda según la jerarquía de las cartas.

4. **Fin de la Partida**
    - La partida termina cuando un jugador gana 2 rondas.
    - Los datos de la partida se guardan en la API y se actualiza el historial.

---

## Tabla de Puntajes por Test

Cada test tiene un puntaje asignado. Los alumnos deben completar todos los tests para alcanzar un total de **100 puntos**.

| **Test**                                      | **Puntaje** |
|-----------------------------------------------|-------------|
| `obtenerMazoPorFetch llama a /cartas con GET` | 10          |
| `guardarPartidaFetch llama a /partidas por POST` | 10       |
| `getHistorialPartidasFetch llama a /partidas con GET` | 10    |
| `mezclar desordena el array pero no quita/duplica cartas` | 10 |
| `repartirManos reparte 3 cartas a cada uno y quita del mazo` | 10 |
| `jerarquiaCarta coloca 1 de espadas < 1 de bastos < 7 de espadas` | 10 |
| `ganadorRonda detecta el ganador correctamente o empate` | 10   |
| `quita carta de la mano y la almacena en la ronda`         | 5    |
| `crea nueva ronda si no hay`                              | 5    |
| `no crea nueva ronda si ronda incompleta`                 | 5    |
| `cuando ambos juegan, se determina el ganador y suma puntos` | 5  |
| `pasa el turno al siguiente`                              | 5    |
| `ganadorPartida detecta el que gana dos rondas`           | 5    |

**Total: 100 puntos**

---

## 💡 Explicación del Algoritmo Fisher-Yates

El algoritmo de **Fisher-Yates** es un método eficiente para mezclar un array de forma aleatoria. Funciona intercambiando elementos del array de manera iterativa, asegurando que cada permutación posible sea igualmente probable.

### Pasos del Algoritmo:
1. Recorre el array desde el último elemento hasta el primero.
2. Para cada posición `i`, selecciona un índice aleatorio `j` entre `0` y `i` (inclusive).
3. Intercambia los elementos en las posiciones `i` y `j`.
4. Continúa hasta que todos los elementos hayan sido procesados.

### Características:
- **Complejidad:** O(n), lo que lo hace muy eficiente.
- **Aleatoriedad:** Cada permutación del array tiene la misma probabilidad de ocurrir.