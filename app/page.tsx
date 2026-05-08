"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, RotateCcw, Puzzle, ListOrdered, CheckCircle2, XCircle, Search, GitBranch, Brain, ArrowRight, Settings } from "lucide-react"

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

// ==================== DFS.PY - BÚSQUEDA EN PROFUNDIDAD ====================
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

// ==================== BFS.PY - BÚSQUEDA EN AMPLITUD ====================
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

// ==================== HEURISTICA.PY - BÚSQUEDA HEURÍSTICA ====================
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

// ==================== COMPONENTE PRINCIPAL ====================
export default function PuzzleLinealPage() {
  const [estadoInicial, setEstadoInicial] = useState<string>("4,2,3,1")
  const [solucion, setSolucion] = useState<string>("1,2,3,4")
  const [resultado, setResultado] = useState<number[][] | null>(null)
  const [nodosVisitados, setNodosVisitados] = useState<number[][]>([])
  const [encontrado, setEncontrado] = useState<boolean | null>(null)
  const [error, setError] = useState<string>("")
  const [algoritmoActual, setAlgoritmoActual] = useState<string>("dfs")
  const [backendUrl, setBackendUrl] = useState<string>("")
  const [useBackend, setUseBackend] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

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

  const handleSearchLocal = (algoritmo: string, inicial: number[], sol: number[]) => {
    let result: SearchResult

    switch (algoritmo) {
      case "bfs":
        result = buscar_solucion_BFS(inicial, sol)
        break
      case "dfs":
        result = buscar_solucion_DFS(inicial, sol)
        break
      case "heuristica":
        result = buscar_solucion_Heuristica(inicial, sol)
        break
      default:
        result = buscar_solucion_DFS(inicial, sol)
    }

    setNodosVisitados(result.nodos_visitados)

    if (result.nodo_solucion) {
      const camino = obtenerCamino(result.nodo_solucion, inicial)
      setResultado(camino)
      setEncontrado(true)
    } else {
      setResultado(null)
      setEncontrado(false)
    }
  }

  const handleSearchBackend = async (algoritmo: string, inicial: number[], sol: number[]) => {
    setLoading(true)
    try {
      const endpoint = `${backendUrl}/api/${algoritmo}`
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado_inicial: inicial, solucion: sol }),
      })

      if (!response.ok) throw new Error("Error en la respuesta del servidor")

      const data = await response.json()
      setResultado(data.resultado)
      setNodosVisitados(data.nodos_visitados)
      setEncontrado(data.encontrado)
    } catch (err) {
      setError(`Error conectando al backend: ${err instanceof Error ? err.message : "Error desconocido"}`)
      setEncontrado(false)
    } finally {
      setLoading(false)
    }
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

    if (useBackend && backendUrl) {
      handleSearchBackend(algoritmoActual, inicial, sol)
    } else {
      handleSearchLocal(algoritmoActual, inicial, sol)
    }
  }

  const handleReset = () => {
    setEstadoInicial("4,2,3,1")
    setSolucion("1,2,3,4")
    setResultado(null)
    setNodosVisitados([])
    setEncontrado(null)
    setError("")
  }

  const getAlgoritmoInfo = () => {
    switch (algoritmoActual) {
      case "bfs":
        return { nombre: "BFS", descripcion: "Busqueda en Amplitud (Breadth-First Search)", icon: Search }
      case "dfs":
        return { nombre: "DFS", descripcion: "Busqueda en Profundidad (Depth-First Search)", icon: GitBranch }
      case "heuristica":
        return { nombre: "Heuristica", descripcion: "Busqueda Heuristica con funcion de mejora", icon: Brain }
      default:
        return { nombre: "DFS", descripcion: "Busqueda en Profundidad", icon: GitBranch }
    }
  }

  const info = getAlgoritmoInfo()
  const IconComponent = info.icon

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        {/* Encabezado */}
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
              <Puzzle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Puzzle Lineal - Algoritmos de Busqueda
              </h1>
              <p className="text-sm text-muted-foreground">
                BFS, DFS y Busqueda Heuristica
              </p>
            </div>
          </div>
        </header>

        {/* Tabs de algoritmos */}
        <Tabs value={algoritmoActual} onValueChange={setAlgoritmoActual} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="dfs" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              DFS
            </TabsTrigger>
            <TabsTrigger value="bfs" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              BFS
            </TabsTrigger>
            <TabsTrigger value="heuristica" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Heuristica
            </TabsTrigger>
          </TabsList>

          <TabsContent value={algoritmoActual} className="mt-6">
            {/* Informacion del algoritmo */}
            <Card className="mb-6 border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{info.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{info.descripcion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Panel de configuracion */}
            <Card className="mb-6 border-border bg-card">
              <CardHeader className="border-b border-border pb-4 pt-5 px-6">
                <CardTitle className="flex items-center gap-3 text-lg text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                    <ListOrdered className="h-4 w-4 text-primary" />
                  </div>
                  Configuracion del Puzzle
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-5 p-6">
                {/* Backend config */}
                <div className="flex flex-col gap-3 p-4 rounded-lg border border-border bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Usar Backend Python</span>
                    </div>
                    <Button
                      variant={useBackend ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUseBackend(!useBackend)}
                      className="h-8"
                    >
                      {useBackend ? "Activado" : "Desactivado"}
                    </Button>
                  </div>
                  {useBackend && (
                    <Input
                      value={backendUrl}
                      onChange={(e) => setBackendUrl(e.target.value)}
                      placeholder="http://localhost:8000"
                      className="border-border bg-background text-foreground h-10"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Estado Inicial */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Play className="h-4 w-4 text-primary" />
                      Nodo Inicial
                    </label>
                    <Input
                      value={estadoInicial}
                      onChange={(e) => setEstadoInicial(e.target.value)}
                      placeholder="4,2,3,1"
                      className="border-border bg-secondary text-foreground h-11"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ejemplo: 4,2,3,1 (4 numeros separados por coma)
                    </p>
                  </div>

                  {/* Solucion */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Solucion
                    </label>
                    <Input
                      value={solucion}
                      onChange={(e) => setSolucion(e.target.value)}
                      placeholder="1,2,3,4"
                      className="border-border bg-secondary text-foreground h-11"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ejemplo: 1,2,3,4 (estado objetivo)
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                  >
                    {loading ? (
                      <span className="animate-pulse">Buscando...</span>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Ejecutar {info.nombre}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-border bg-secondary text-foreground hover:bg-muted h-11 px-4"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Resultados */}
        {encontrado !== null && (
          <div className="flex flex-col gap-6">
            {/* Estado de resultado */}
            <Card className={`border ${encontrado ? "border-green-500/30 bg-green-500/5" : "border-destructive/30 bg-destructive/5"}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  {encontrado ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-destructive" />
                  )}
                  <div>
                    <h3 className={`font-semibold ${encontrado ? "text-green-500" : "text-destructive"}`}>
                      {encontrado ? "Solucion encontrada" : "No se encontro solucion"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {encontrado
                        ? `Se encontro la ruta en ${resultado?.length || 0} pasos con ${nodosVisitados.length} nodos visitados`
                        : `El algoritmo ${info.nombre} no pudo encontrar una ruta`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Camino solucion */}
            {resultado && resultado.length > 0 && (
              <Card className="border-border bg-card">
                <CardHeader className="border-b border-border pb-4 pt-5 px-6">
                  <CardTitle className="flex items-center gap-3 text-lg text-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                      <ArrowRight className="h-4 w-4 text-green-500" />
                    </div>
                    Camino Solucion ({resultado.length} pasos)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {resultado.map((nodo, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Badge
                          className={`px-3 py-1.5 font-mono text-sm ${
                            i === 0
                              ? "border-2 border-primary bg-primary/10 text-foreground"
                              : i === resultado.length - 1
                              ? "border-2 border-green-500 bg-green-500/10 text-foreground"
                              : "border-muted-foreground/30 bg-secondary text-foreground border"
                          }`}
                        >
                          [{nodo.join(", ")}]
                        </Badge>
                        {i < resultado.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nodos visitados */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border pb-4 pt-5 px-6">
                <CardTitle className="flex items-center gap-3 text-lg text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <ListOrdered className="h-4 w-4 text-muted-foreground" />
                  </div>
                  Nodos Visitados ({nodosVisitados.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {nodosVisitados.map((nodo, i) => {
                    const isInicio = i === 0
                    const solArray = parseInput(solucion)
                    const isSolucion = solArray && nodo.every((val, idx) => val === solArray[idx])
                    return (
                      <Badge
                        key={i}
                        className={`px-3 py-1.5 font-mono text-sm ${
                          isInicio
                            ? "border-2 border-primary bg-primary/10 text-foreground"
                            : isSolucion
                            ? "border-2 border-green-500 bg-green-500/10 text-foreground"
                            : "border-muted-foreground/30 bg-secondary text-foreground border"
                        }`}
                      >
                        [{nodo.join(", ")}]
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
