from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from arbol import Nodo
from bfs import buscar_solucion_BFS
from dfs import buscar_solucion_DFS
from heuristica import buscar_solucion_heuristica

app = FastAPI(title="Puzzle Lineal API", description="API para algoritmos de busqueda BFS, DFS y Heuristica")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    estado_inicial: List[int]
    solucion: List[int]

class SearchResponse(BaseModel):
    algoritmo: str
    resultado: List[List[int]]
    nodos_visitados: List[List[int]]
    encontrado: bool

def obtener_camino(nodo, estado_inicial):
    """Obtiene el camino desde el nodo solucion hasta el estado inicial"""
    resultado = []
    while nodo.get_padre() is not None:
        resultado.append(nodo.get_datos())
        nodo = nodo.get_padre()
    resultado.append(estado_inicial)
    resultado.reverse()
    return resultado

def buscar_BFS_con_visitados(estado_inicial, solucion):
    """BFS que retorna tambien los nodos visitados"""
    solucionado = False 
    nodos_visitados = []
    nodos_frontera = []
    historial_visitados = []
    nodo_inicial = Nodo(estado_inicial)
    nodos_frontera.append(nodo_inicial)
    
    while(not solucionado) and len(nodos_frontera) != 0:
        nodo = nodos_frontera.pop(0)
        nodos_visitados.append(nodo)
        historial_visitados.append(nodo.get_datos())
        
        if nodo.get_datos() == solucion:
            solucionado = True
            return nodo, historial_visitados
        else:
            dato_nodo = nodo.get_datos()

            hijo = [dato_nodo[1], dato_nodo[0], dato_nodo[2], dato_nodo[3]]
            hijo_izquierdo = Nodo(hijo) 
            if not hijo_izquierdo.en_lista(nodos_visitados) and not hijo_izquierdo.en_lista(nodos_frontera):
                nodos_frontera.append(hijo_izquierdo)

            hijo = [dato_nodo[0], dato_nodo[2], dato_nodo[1], dato_nodo[3]]
            hijo_central = Nodo(hijo) 
            if not hijo_central.en_lista(nodos_visitados) and not hijo_central.en_lista(nodos_frontera):
                nodos_frontera.append(hijo_central)

            hijo = [dato_nodo[0], dato_nodo[1], dato_nodo[3], dato_nodo[2]]
            hijo_derecho = Nodo(hijo) 
            if not hijo_derecho.en_lista(nodos_visitados) and not hijo_derecho.en_lista(nodos_frontera):
                nodos_frontera.append(hijo_derecho)
            
            nodo.set_hijos([hijo_izquierdo, hijo_central, hijo_derecho])
    
    return None, historial_visitados

def buscar_DFS_con_visitados(estado_inicial, solucion):
    """DFS que retorna tambien los nodos visitados"""
    solucionado = False 
    nodos_visitados = []
    nodos_frontera = []
    historial_visitados = []
    nodoInicial = Nodo(estado_inicial)
    nodos_frontera.append(nodoInicial)
    
    while(not solucionado) and len(nodos_frontera) != 0:
        nodo = nodos_frontera.pop()
        nodos_visitados.append(nodo)
        historial_visitados.append(nodo.get_datos())
        
        if nodo.get_datos() == solucion:
            solucionado = True
            return nodo, historial_visitados
        else:
            dato_nodo = nodo.get_datos()

            hijo = [dato_nodo[1], dato_nodo[0], dato_nodo[2], dato_nodo[3]]
            hijo_izquierdo = Nodo(hijo)
            if not hijo_izquierdo.en_lista(nodos_visitados) and not hijo_izquierdo.en_lista(nodos_frontera):
                nodos_frontera.append(hijo_izquierdo)
            
            hijo = [dato_nodo[0], dato_nodo[2], dato_nodo[1], dato_nodo[3]]
            hijo_central = Nodo(hijo) 
            if not hijo_central.en_lista(nodos_visitados) and not hijo_central.en_lista(nodos_frontera):
                nodos_frontera.append(hijo_central)

            hijo = [dato_nodo[0], dato_nodo[1], dato_nodo[3], dato_nodo[2]]
            hijo_derecho = Nodo(hijo) 
            if not hijo_derecho.en_lista(nodos_visitados) and not hijo_derecho.en_lista(nodos_frontera):
                nodos_frontera.append(hijo_derecho)
            
            nodo.set_hijos([hijo_izquierdo, hijo_central, hijo_derecho])
    
    return None, historial_visitados

def mejora(nodo_padre, nodo_hijo):
    calidad_padre = 0
    calidad_hijo = 0
    dato_padre = nodo_padre.get_datos()
    dato_hijo = nodo_hijo.get_datos()
    for n in range(1, len(dato_padre)):
        if dato_padre[n] > dato_padre[n-1]:
            calidad_padre += 1
        if dato_hijo[n] > dato_hijo[n-1]:
            calidad_hijo += 1
    return calidad_hijo >= calidad_padre

def buscar_heuristica_con_visitados(nodo_inicial, solucion, visitados, historial):
    """Heuristica que retorna tambien los nodos visitados"""
    visitados.append(nodo_inicial.get_datos())
    historial.append(nodo_inicial.get_datos())
    
    if nodo_inicial.get_datos() == solucion:
        return nodo_inicial
    else:
        dato_nodo = nodo_inicial.get_datos()

        hijo = [dato_nodo[1], dato_nodo[0], dato_nodo[2], dato_nodo[3]]
        hijo_izquierdo = Nodo(hijo)

        hijo = [dato_nodo[0], dato_nodo[2], dato_nodo[1], dato_nodo[3]]
        hijo_central = Nodo(hijo)

        hijo = [dato_nodo[0], dato_nodo[1], dato_nodo[3], dato_nodo[2]]
        hijo_derecho = Nodo(hijo)

        nodo_inicial.set_hijos([hijo_izquierdo, hijo_central, hijo_derecho])

        for nodo_hijo in nodo_inicial.get_hijos():
            if nodo_hijo.get_datos() not in visitados and mejora(nodo_inicial, nodo_hijo):
                sol = buscar_heuristica_con_visitados(nodo_hijo, solucion, visitados, historial)
                if sol is not None:
                    return sol

        return None

@app.get("/")
def read_root():
    return {"message": "Puzzle Lineal API - Algoritmos BFS, DFS y Heuristica"}

@app.post("/api/bfs", response_model=SearchResponse)
def search_bfs(request: SearchRequest):
    nodo_solucion, visitados = buscar_BFS_con_visitados(request.estado_inicial, request.solucion)
    
    if nodo_solucion:
        resultado = obtener_camino(nodo_solucion, request.estado_inicial)
        return SearchResponse(
            algoritmo="BFS",
            resultado=resultado,
            nodos_visitados=visitados,
            encontrado=True
        )
    return SearchResponse(
        algoritmo="BFS",
        resultado=[],
        nodos_visitados=visitados,
        encontrado=False
    )

@app.post("/api/dfs", response_model=SearchResponse)
def search_dfs(request: SearchRequest):
    nodo_solucion, visitados = buscar_DFS_con_visitados(request.estado_inicial, request.solucion)
    
    if nodo_solucion:
        resultado = obtener_camino(nodo_solucion, request.estado_inicial)
        return SearchResponse(
            algoritmo="DFS",
            resultado=resultado,
            nodos_visitados=visitados,
            encontrado=True
        )
    return SearchResponse(
        algoritmo="DFS",
        resultado=[],
        nodos_visitados=visitados,
        encontrado=False
    )

@app.post("/api/heuristica", response_model=SearchResponse)
def search_heuristica(request: SearchRequest):
    visitados = []
    historial = []
    nodo_inicial = Nodo(request.estado_inicial)
    nodo_solucion = buscar_heuristica_con_visitados(nodo_inicial, request.solucion, visitados, historial)
    
    if nodo_solucion:
        resultado = obtener_camino(nodo_solucion, request.estado_inicial)
        return SearchResponse(
            algoritmo="Heuristica",
            resultado=resultado,
            nodos_visitados=historial,
            encontrado=True
        )
    return SearchResponse(
        algoritmo="Heuristica",
        resultado=[],
        nodos_visitados=historial,
        encontrado=False
    )

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
