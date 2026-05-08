ge # Puzzle Lineal - Algoritmos de Busqueda

Aplicacion full-stack para visualizar algoritmos de busqueda (BFS, DFS, Heuristica) para el Puzzle Lineal.

## Estructura del Proyecto

```
/
├── backend/          # API Python con FastAPI
│   ├── arbol.py      # Clase Nodo
│   ├── bfs.py        # Algoritmo BFS
│   ├── dfs.py        # Algoritmo DFS
│   ├── heuristica.py # Algoritmo Heuristico
│   ├── main.py       # API FastAPI
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── fly.toml      # Config Fly.io
│   └── render.yaml   # Config Render
│
├── app/              # Frontend Next.js
├── components/       # Componentes UI
└── ...
```

## Despliegue

### Frontend (Vercel)

1. Conecta tu repositorio a Vercel
2. El frontend se despliega automaticamente
3. Configura la variable de entorno si usas backend externo

### Backend (Render)

1. Crea un nuevo Web Service en Render
2. Conecta el repositorio
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Backend (Fly.io)

```bash
cd backend
fly launch
fly deploy
```

### Backend (Local)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## API Endpoints

- `GET /` - Info de la API
- `POST /api/bfs` - Ejecutar BFS
- `POST /api/dfs` - Ejecutar DFS
- `POST /api/heuristica` - Ejecutar Heuristica
- `GET /api/health` - Health check

### Ejemplo de Request

```json
POST /api/dfs
{
  "estado_inicial": [4, 2, 3, 1],
  "solucion": [1, 2, 3, 4]
}
```

### Ejemplo de Response

```json
{
  "algoritmo": "DFS",
  "resultado": [[4,2,3,1], [2,4,3,1], [2,3,4,1], [2,3,1,4], [2,1,3,4], [1,2,3,4]],
  "nodos_visitados": [...],
  "encontrado": true
}
```

## Uso del Frontend

1. Selecciona el algoritmo (DFS, BFS o Heuristica)
2. Ingresa el estado inicial (ej: 4,2,3,1)
3. Ingresa la solucion (ej: 1,2,3,4)
4. Opcionalmente activa el backend Python e ingresa la URL
5. Ejecuta la busqueda

El frontend puede funcionar de dos formas:
- **Modo local**: Los algoritmos se ejecutan en el navegador (TypeScript)
- **Modo backend**: Los algoritmos se ejecutan en el servidor Python
