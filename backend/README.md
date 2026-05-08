# Puzzle Lineal API - Backend

API para ejecutar algoritmos de busqueda BFS, DFS y Heuristica para el Puzzle Lineal.

## Instalacion

```bash
cd backend
pip install -r requirements.txt
```

## Ejecutar localmente

```bash
uvicorn main:app --reload --port 8000
```

## Endpoints

- `GET /` - Informacion de la API
- `POST /api/bfs` - Ejecutar busqueda BFS
- `POST /api/dfs` - Ejecutar busqueda DFS
- `POST /api/heuristica` - Ejecutar busqueda Heuristica
- `GET /api/health` - Health check

## Ejemplo de request

```json
{
  "estado_inicial": [4, 2, 3, 1],
  "solucion": [1, 2, 3, 4]
}
```

## Despliegue en Render

1. Crear nuevo Web Service
2. Conectar repositorio
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Despliegue en Fly.io

```bash
fly launch
fly deploy
```
