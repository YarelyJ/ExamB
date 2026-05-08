"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Puzzle, ListOrdered, CheckCircle2, XCircle, Search, GitBranch, Brain, ArrowRight } from "lucide-react"

// ==================== ARBOL.PY - CLASE NODO ====================
class Nodo {
  datos: number[]
  hijos: Nodo[] | null
  padre: Nodo | null
  costo: number | null

  constructor(datos: number[], hijos: Nodo[] | null = null) {
    this.datos = datos
    this.hijos = null
    this.padre = null
    this.costo = null
    this.set_hijos(hijos)
  }

  set_hijos(hijos: Nodo[] | null): void {
    this.hijos = hijos
    if (this.hijos != null) {
      for (const h of this.hijos) {
        h.padre = this
      }
    }
  }

  get_hijos(): Nodo[] | null {
    return this.hijos
  }

  set_padre(padre: Nodo): void {
    this.padre = padre
  }

  get_padre(): Nodo | null {
    return this.padre
  }

  set_datos(datos: number[]): void {
    this.datos = datos
  }

  get_datos(): number[] {
    return this.datos
  }

  set_costo(costo: number): void {
    this.costo = costo
  }

  get_costo(): number | null {
    return this.costo
  }

  igual(nodo: Nodo): boolean {
    const datos1 = this.get_datos()
    const datos2 = nodo.get_datos()
    if (datos1.length !== datos2.length) return false
    for (let i = 0; i < datos1.length; i++) {
      if (datos1[i] !== datos2[i]) return false
    }
    return true
  }

  en_lista(lista_nodos: Nodo[]): boolean {
    let en_la_lista = false
    for (const n of lista_nodos) {
      if (this.igual(n)) {
        en_la_lista = true
      }
    }
    return en_la_lista
  }
}

// ==================== DFS.PY - BUSQUEDA EN PROFUNDIDAD ====================
interface SearchResult {
  nodo_solucion: Nodo | null
  nodos_visitados: number[][]
}

function buscar_solucion_DFS(estado_inicial: number[], solucion: number[]): SearchResult {
  let solucionado = false
  const nodos_visitados: Nodo[] = []
  const nodos_frontera: Nodo[] = []
  const nodoInicial = new Nodo(estado_inicial)
  nodos_frontera.push(nodoInicial)
  const historial_visitados: number[][] = []

  while (!solucionado && nodos_frontera.length !== 0) {
    const nodo = nodos_frontera.pop()!
    nodos_visitados.push(nodo)
    historial_visitados.push([...nodo.get_datos()])

    const datos_nodo = nodo.get_datos()
    let es_solucion = true
    for (let i = 0; i < datos_nodo.length; i++) {
      if (datos_nodo[i] !== solucion[i]) {
        es_solucion = false
        break
      }
    }

    if (es_solucion) {
      solucionado = true
      return { nodo_solucion: nodo, nodos_visitados: historial_visitados }
    } else {
      const dato_nodo = nodo.get_datos()

      const hijo_izq = [dato_nodo[1], dato_nodo[0], dato_nodo[2], dato_nodo[3]]
      const hijo_izquierdo = new Nodo(hijo_izq)
      if (!hijo_izquierdo.en_lista(nodos_visitados) && !hijo_izquierdo.en_lista(nodos_frontera)) {
        nodos_frontera.push(hijo_izquierdo)
      }

      const hijo_cen = [dato_nodo[0], dato_nodo[2], dato_nodo[1], dato_nodo[3]]
      const hijo_central = new Nodo(hijo_cen)
      if (!hijo_central.en_lista(nodos_visitados) && !hijo_central.en_lista(nodos_frontera)) {
        nodos_frontera.push(hijo_central)
      }

      const hijo_der = [dato_nodo[0], dato_nodo[1], dato_nodo[3], dato_nodo[2]]
      const hijo_derecho = new Nodo(hijo_der)
      if (!hijo_derecho.en_lista(nodos_visitados) && !hijo_derecho.en_lista(nodos_frontera)) {
        nodos_frontera.push(hijo_derecho)
      }

      nodo.set_hijos([hijo_izquierdo, hijo_central, hijo_derecho])
    }
  }

  return { nodo_solucion: null, nodos_visitados: historial_visitados }
}

// ==================== BFS.PY - BUSQUEDA EN AMPLITUD ====================
function buscar_solucion_BFS(estado_inicial: number[], solucion: number[]): SearchResult {
  let solucionado = false
  const nodos_visitados: Nodo[] = []
  const nodos_frontera: Nodo[] = []
  const nodo_inicial = new Nodo(estado_inicial)
  nodos_frontera.push(nodo_inicial)
  const historial_visitados: number[][] = []

  while (!solucionado && nodos_frontera.length !== 0) {
    const nodo = nodos_frontera.shift()!
    nodos_visitados.push(nodo)
    historial_visitados.push([...nodo.get_datos()])

    const datos_nodo = nodo.get_datos()
    let es_solucion = true
    for (let i = 0; i < datos_nodo.length; i++) {
      if (datos_nodo[i] !== solucion[i]) {
        es_solucion = false
        break
      }
    }

    if (es_solucion) {
      solucionado = true
      return { nodo_solucion: nodo, nodos_visitados: historial_visitados }
    } else {
      const dato_nodo = nodo.get_datos()

      const hijo = [dato_nodo[1], dato_nodo[0], dato_nodo[2], dato_nodo[3]]
      const hijo_izquierdo = new Nodo(hijo)
      if (!hijo_izquierdo.en_lista(nodos_visitados) && !hijo_izquierdo.en_lista(nodos_frontera)) {
        nodos_frontera.push(hijo_izquierdo)
      }

      const hijo2 = [dato_nodo[0], dato_nodo[2], dato_nodo[1], dato_nodo[3]]
      const hijo_central = new Nodo(hijo2)
      if (!hijo_central.en_lista(nodos_visitados) && !hijo_central.en_lista(nodos_frontera)) {
        nodos_frontera.push(hijo_central)
      }

      const hijo3 = [dato_nodo[0], dato_nodo[1], dato_nodo[3], dato_nodo[2]]
      const hijo_derecho = new Nodo(hijo3)
      if (!hijo_derecho.en_lista(nodos_visitados) && !hijo_derecho.en_lista(nodos_frontera)) {
        nodos_frontera.push(hijo_derecho)
      }

      nodo.set_hijos([hijo_izquierdo, hijo_central, hijo_derecho])
    }
  }

  return { nodo_solucion: null, nodos_visitados: historial_visitados }
}

// ==================== HEURISTICA.PY - BUSQUEDA HEURISTICA ====================
function mejora(nodo_padre: Nodo, nodo_hijo: Nodo): boolean {
  let calidad_padre = 0
  let calidad_hijo = 0
  const dato_padre = nodo_padre.get_datos()
  const dato_hijo = nodo_hijo.get_datos()
  for (let n = 1; n < dato_padre.length; n++) {
    if (dato_padre[n] > dato_padre[n - 1]) {
      calidad_padre += 1
    }
    if (dato_hijo[n] > dato_hijo[n - 1]) {
      calidad_hijo += 1
    }
  }
  return calidad_hijo >= calidad_padre
}

function buscar_solucion_heuristica_recursivo(
  nodo_inicial: Nodo,
  solucion: number[],
  visitados: number[][],
  historial: number[][]
): Nodo | null {
  visitados.push([...nodo_inicial.get_datos()])
  historial.push([...nodo_inicial.get_datos()])

  const datos_nodo = nodo_inicial.get_datos()
  let es_solucion = true
  for (let i = 0; i < datos_nodo.length; i++) {
    if (datos_nodo[i] !== solucion[i]) {
      es_solucion = false
      break
    }
  }

  if (es_solucion) {
    return nodo_inicial
  } else {
    const dato_nodo = nodo_inicial.get_datos()

    const hijo = [dato_nodo[1], dato_nodo[0], dato_nodo[2], dato_nodo[3]]
    const hijo_izquierdo = new Nodo(hijo)

    const hijo2 = [dato_nodo[0], dato_nodo[2], dato_nodo[1], dato_nodo[3]]
    const hijo_central = new Nodo(hijo2)

    const hijo3 = [dato_nodo[0], dato_nodo[1], dato_nodo[3], dato_nodo[2]]
    const hijo_derecho = new Nodo(hijo3)

    nodo_inicial.set_hijos([hijo_izquierdo, hijo_central, hijo_derecho])

    for (const nodo_hijo of nodo_inicial.get_hijos()!) {
      const datos_hijo = nodo_hijo.get_datos()
      let esta_visitado = false
      for (const v of visitados) {
        if (v.length === datos_hijo.length && v.every((val, idx) => val === datos_hijo[idx])) {
          esta_visitado = true
          break
        }
      }

      if (!esta_visitado && mejora(nodo_inicial, nodo_hijo)) {
        const sol = buscar_solucion_heuristica_recursivo(nodo_hijo, solucion, visitados, historial)
        if (sol !== null) {
          return sol
        }
      }
    }

    return null
  }
}

function buscar_solucion_Heuristica(estado_inicial: number[], solucion: number[]): SearchResult {
  const visitados: number[][] = []
  const historial: number[][] = []
  const nodo_inicial = new Nodo(estado_inicial)
  const nodo_solucion = buscar_solucion_heuristica_recursivo(nodo_inicial, solucion, visitados, historial)
  return { nodo_solucion, nodos_visitados: historial }
}

// ==================== INTERFAZ PARA RESULTADOS ====================
interface AlgorithmResult {
  nombre: string
  descripcion: string
  icon: React.ElementType
  resultado: number[][] | null
  nodosVisitados: number[][]
  encontrado: boolean | null
  color: string
}

// ==================== COMPONENTE DE RESULTADO INDIVIDUAL ====================
function ResultadoAlgoritmo({ 
  result, 
  solucion 
}: { 
  result: AlgorithmResult
  solucion: string 
}) {
  const Icon = result.icon
  const parseInput = (input: string): number[] | null => {
    try {
      const nums = input.split(",").map((s) => parseInt(s.trim()))
      if (nums.length !== 4 || nums.some(isNaN)) return null
      return nums
    } catch {
      return null
    }
  }

  if (result.encontrado === null) {
    return (
      <Card className="border-border bg-card h-full">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="flex items-center gap-2 text-base text-foreground">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${result.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            {result.nombre}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{result.descripcion}</p>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Ejecuta la busqueda para ver resultados
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border h-full ${result.encontrado ? "border-green-500/30" : "border-destructive/30"}`}>
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="flex items-center gap-2 text-base text-foreground">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${result.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          {result.nombre}
          {result.encontrado ? (
            <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive ml-auto" />
          )}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{result.descripcion}</p>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex flex-col gap-3">
        {/* Estado */}
        <div className={`rounded-lg p-2 text-center text-sm ${
          result.encontrado ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
        }`}>
          {result.encontrado 
            ? `Encontrado en ${result.resultado?.length || 0} pasos` 
            : "No encontrado"}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-secondary rounded p-2 text-center">
            <div className="font-semibold text-foreground">{result.nodosVisitados.length}</div>
            <div className="text-muted-foreground">Nodos visitados</div>
          </div>
          <div className="bg-secondary rounded p-2 text-center">
            <div className="font-semibold text-foreground">{result.resultado?.length || 0}</div>
            <div className="text-muted-foreground">Pasos solucion</div>
          </div>
        </div>

        {/* Camino solucion */}
        {result.resultado && result.resultado.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
              <ArrowRight className="h-3 w-3 text-green-500" />
              Camino Solucion
            </h4>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {result.resultado.map((nodo, i) => (
                <Badge
                  key={i}
                  className={`px-1.5 py-0.5 font-mono text-[10px] ${
                    i === 0
                      ? "border border-primary bg-primary/10 text-foreground"
                      : i === result.resultado!.length - 1
                      ? "border border-green-500 bg-green-500/10 text-foreground"
                      : "border-muted-foreground/30 bg-secondary text-foreground border"
                  }`}
                >
                  [{nodo.join(",")}]
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Nodos visitados */}
        <div>
          <h4 className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
            <ListOrdered className="h-3 w-3 text-muted-foreground" />
            Nodos Visitados ({result.nodosVisitados.length})
          </h4>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {result.nodosVisitados.map((nodo, i) => {
              const isInicio = i === 0
              const solArray = parseInput(solucion)
              const isSolucion = solArray && nodo.every((val, idx) => val === solArray[idx])
              return (
                <Badge
                  key={i}
                  className={`px-1.5 py-0.5 font-mono text-[10px] ${
                    isInicio
                      ? "border border-primary bg-primary/10 text-foreground"
                      : isSolucion
                      ? "border border-green-500 bg-green-500/10 text-foreground"
                      : "border-muted-foreground/30 bg-secondary text-foreground border"
                  }`}
                >
                  [{nodo.join(",")}]
                </Badge>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== COMPONENTE PRINCIPAL ====================
export default function PuzzleLinealPage() {
  const [estadoInicial, setEstadoInicial] = useState<string>("4,2,3,1")
  const [solucion, setSolucion] = useState<string>("1,2,3,4")
  const [error, setError] = useState<string>("")
  
  const [results, setResults] = useState<{
    dfs: AlgorithmResult
    bfs: AlgorithmResult
    heuristica: AlgorithmResult
  }>({
    dfs: {
      nombre: "DFS",
      descripcion: "Busqueda en Profundidad",
      icon: GitBranch,
      resultado: null,
      nodosVisitados: [],
      encontrado: null,
      color: "bg-blue-500/20 text-blue-500"
    },
    bfs: {
      nombre: "BFS", 
      descripcion: "Busqueda en Amplitud",
      icon: Search,
      resultado: null,
      nodosVisitados: [],
      encontrado: null,
      color: "bg-emerald-500/20 text-emerald-500"
    },
    heuristica: {
      nombre: "Heuristica",
      descripcion: "Busqueda con funcion de mejora",
      icon: Brain,
      resultado: null,
      nodosVisitados: [],
      encontrado: null,
      color: "bg-amber-500/20 text-amber-500"
    }
  })

  const parseInput = (input: string): number[] | null => {
    try {
      const nums = input.split(",").map((s) => parseInt(s.trim()))
      if (nums.length !== 4 || nums.some(isNaN)) return null
      return nums
    } catch {
      return null
    }
  }

  const obtenerCamino = (nodo: Nodo | null, estadoInicial: number[]): number[][] => {
    if (!nodo) return []
    const camino: number[][] = []
    let actual: Nodo | null = nodo
    while (actual?.get_padre() != null) {
      camino.push([...actual.get_datos()])
      actual = actual.get_padre()
    }
    camino.push(estadoInicial)
    camino.reverse()
    return camino
  }

  const handleSearch = () => {
    setError("")
    const inicial = parseInput(estadoInicial)
    const sol = parseInput(solucion)

    if (!inicial) {
      setError("Estado inicial invalido. Usa formato: 4,2,3,1")
      return
    }
    if (!sol) {
      setError("Solucion invalida. Usa formato: 1,2,3,4")
      return
    }

    // Ejecutar DFS
    const dfsResult = buscar_solucion_DFS(inicial, sol)
    const dfsCamino = dfsResult.nodo_solucion ? obtenerCamino(dfsResult.nodo_solucion, inicial) : null

    // Ejecutar BFS
    const bfsResult = buscar_solucion_BFS(inicial, sol)
    const bfsCamino = bfsResult.nodo_solucion ? obtenerCamino(bfsResult.nodo_solucion, inicial) : null

    // Ejecutar Heuristica
    const heuristicaResult = buscar_solucion_Heuristica(inicial, sol)
    const heuristicaCamino = heuristicaResult.nodo_solucion ? obtenerCamino(heuristicaResult.nodo_solucion, inicial) : null

    setResults({
      dfs: {
        ...results.dfs,
        resultado: dfsCamino,
        nodosVisitados: dfsResult.nodos_visitados,
        encontrado: dfsResult.nodo_solucion !== null
      },
      bfs: {
        ...results.bfs,
        resultado: bfsCamino,
        nodosVisitados: bfsResult.nodos_visitados,
        encontrado: bfsResult.nodo_solucion !== null
      },
      heuristica: {
        ...results.heuristica,
        resultado: heuristicaCamino,
        nodosVisitados: heuristicaResult.nodos_visitados,
        encontrado: heuristicaResult.nodo_solucion !== null
      }
    })
  }

  const handleReset = () => {
    setEstadoInicial("4,2,3,1")
    setSolucion("1,2,3,4")
    setError("")
    setResults({
      dfs: { ...results.dfs, resultado: null, nodosVisitados: [], encontrado: null },
      bfs: { ...results.bfs, resultado: null, nodosVisitados: [], encontrado: null },
      heuristica: { ...results.heuristica, resultado: null, nodosVisitados: [], encontrado: null }
    })
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Puzzle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground md:text-2xl">
                Puzzle Lineal - Comparacion de Algoritmos
              </h1>
              <p className="text-xs text-muted-foreground">
                BFS, DFS y Busqueda Heuristica ejecutados simultaneamente
              </p>
            </div>
          </div>
        </header>

        {/* Panel de configuracion */}
        <Card className="mb-6 border-border bg-card">
          <CardHeader className="border-b border-border pb-3 pt-4 px-4">
            <CardTitle className="flex items-center gap-2 text-base text-foreground">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
                <ListOrdered className="h-3.5 w-3.5 text-primary" />
              </div>
              Configuracion del Puzzle
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estado Inicial */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Play className="h-3.5 w-3.5 text-primary" />
                  Nodo Inicial
                </label>
                <Input
                  value={estadoInicial}
                  onChange={(e) => setEstadoInicial(e.target.value)}
                  placeholder="4,2,3,1"
                  className="border-border bg-secondary text-foreground h-10"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Ejemplo: 4,2,3,1 (4 numeros separados por coma)
                </p>
              </div>

              {/* Solucion */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  Solucion
                </label>
                <Input
                  value={solucion}
                  onChange={(e) => setSolucion(e.target.value)}
                  placeholder="1,2,3,4"
                  className="border-border bg-secondary text-foreground h-10"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Ejemplo: 1,2,3,4 (estado objetivo)
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3">
              <Button
                onClick={handleSearch}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10"
              >
                <Play className="mr-2 h-4 w-4" />
                Ejecutar los 3 Algoritmos
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-border bg-secondary text-foreground hover:bg-muted h-10 px-4"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados - 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultadoAlgoritmo result={results.dfs} solucion={solucion} />
          <ResultadoAlgoritmo result={results.bfs} solucion={solucion} />
          <ResultadoAlgoritmo result={results.heuristica} solucion={solucion} />
        </div>

        {/* Tabla comparativa */}
        {results.dfs.encontrado !== null && (
          <Card className="mt-6 border-border bg-card">
            <CardHeader className="border-b border-border pb-3 pt-4 px-4">
              <CardTitle className="text-base text-foreground">
                Comparacion de Resultados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-medium text-foreground">Algoritmo</th>
                      <th className="text-center py-2 px-3 font-medium text-foreground">Estado</th>
                      <th className="text-center py-2 px-3 font-medium text-foreground">Nodos Visitados</th>
                      <th className="text-center py-2 px-3 font-medium text-foreground">Pasos Solucion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[results.dfs, results.bfs, results.heuristica].map((r, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${r.color}`}>
                              <r.icon className="h-3 w-3" />
                            </div>
                            <span className="font-medium text-foreground">{r.nombre}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {r.encontrado ? (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                              Encontrado
                            </Badge>
                          ) : (
                            <Badge className="bg-destructive/10 text-destructive border-destructive/30">
                              No encontrado
                            </Badge>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-foreground">
                          {r.nodosVisitados.length}
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-foreground">
                          {r.resultado?.length || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
