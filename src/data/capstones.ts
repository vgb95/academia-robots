import type { Capstone } from '../types';

export const capstones: Capstone[] = [
  {
    id: 'cap-robotica',
    track: 'robotica',
    title: 'Robot diferencial autónomo: exploración, esquiva y regreso al origen',
    brief:
      'Diseña y construye un robot móvil diferencial que explore de forma autónoma una habitación de 3×3 m, detecte y esquive obstáculos estáticos y dinámicos, y regrese al punto de partida con error de posición inferior a 10 cm. Todo el procesamiento debe ejecutarse a bordo, sin conexión WiFi ni computadora externa: el robot decide, localiza y actúa en tiempo real con sensores locales (encoder, IMU, LiDAR o ultrasonido).',
    deliverables: [
      'Esquemático y PCB en KiCad (con/netlist y reglas de diseño verificadas) del controlador y la placa de sensores.',
      'Modelo CAD paramétrico del chasis, soportes y montaje de sensores (piezas imprimibles y lista de tolerancias).',
      'Repositorio Git con historial de commits atómicos, mensajes descriptivos, ramas de features y un README reproducible.',
      'CSV de telemetría de al menos 10 ejecuciones con marca de tiempo, pose estimada, velocidades de rueda, obstáculos detectados y error final.',
      'BOM con coste total inferior a 150 €, desglosado por proveedor, referencia y precio unitario.',
      'Vídeo de 3 minutos con una toma continua de la ejecución final, diagrama del sistema y explicación de decisiones y fallos.',
      'Tests automatizados de las funciones críticas (cinemática inversa, filtro de pose, lógica de esquiva) ejecutables en CI.',
    ],
    metrics: [
      'Error de regreso al origen < 10 cm medido sobre ≥ 10 ejecuciones (media y percentil 95).',
      '100 % de obstáculos evadidos sin colisión en el recorrido, con ≥ 20 obstáculos de prueba.',
      '0 resets: ningún reinicio manual, watchdog o pérdida de comunicación durante cada ejecución.',
      'Autonomía: completa la misión con la batería sin intervención ni recarga.',
      'Determinismo: el 90 % de las ejecuciones convergen con desviación < 5 cm respecto a la mediana.',
    ],
    rubric: [
      {
        criterion: 'Precisión de navegación y regreso',
        weight: 0.3,
        passes: 'Error final < 10 cm en p95 sobre ≥ 10 ejecuciones, con telemetría que lo demuestre.',
      },
      {
        criterion: 'Robustez de percepción y esquiva',
        weight: 0.25,
        passes: '100 % de obstáculos evadidos en ≥ 20 pruebas, incluyendo al menos 3 en movimiento, sin colisiones registradas.',
      },
      {
        criterion: 'Calidad del diseño electrónico y mecánico',
        weight: 0.15,
        passes: 'KiCad DRC sin errores, PCB fabricable y CAD con montaje verificable; BOM < 150 €.',
      },
      {
        criterion: 'Ingeniería de software y reproducibilidad',
        weight: 0.2,
        passes: 'Historial Git con ≥ 20 commits atómicos, tests en CI en verde y README que permita reconstruir el robot.',
      },
      {
        criterion: 'Comunicación y evidencia',
        weight: 0.1,
        passes: 'Vídeo de 3 min con toma continua, CSV completo y fallos documentados con causa y corrección.',
      },
    ],
    eliminates: [
      'Tutorial sin métricas: reproducir un montaje guiado sin medir error, colisiones ni autonomía.',
      'Código sin tests: entregar firmware que solo funciona "en mi mesa", sin pruebas automatizadas ni CI.',
      'Demo sin fallos documentados: vídeo editado que oculta colisiones, resets o deriva del odómetro.',
    ],
  },
  {
    id: 'cap-ia',
    track: 'ai',
    title: 'Asistente de soporte sobre 10.000 contratos con presupuesto controlado',
    brief:
      'Construye un asistente de soporte que responda preguntas sobre un corpus de 10.000 contratos en español e inglés, sosteniendo 50 peticiones por segundo con un presupuesto máximo de 300 $/mes. La arquitectura debe combinar FastAPI + LangGraph con un router Haiku/Sonnet, recuperación pgvector con índice HNSW y reranker bge, caché semántico en Redis, salida estructurada con guardrails y trazas completas en Langfuse. Cada respuesta debe ser verificable, trazable y económicamente sostenible.',
    deliverables: [
      'Repositorio con el servicio FastAPI y el grafo LangGraph, incluyendo el router de modelos y la lógica de escalado a Sonnet.',
      'Esquema pgvector con índice HNSW y pipeline de ingesta de los 10.000 contratos con chunking y metadatos.',
      'Configuración del caché semántico Redis con política de invalidación y umbral de similitud documentado.',
      'Definiciones de structured output (JSON Schema) y guardrails de entrada/salida, con tests de seguridad.',
      'Panel de trazas Langfuse con ejemplos de cada ruta (caché, Haiku, escalado a Sonnet, fallback).',
      'Informe de carga con resultados a 50 RPS (latencia p95, TTFT, coste por resolución) y curva de coste mensual.',
      'Conjunto de evaluación etiquetado con métricas de faithfulness, task success y tasa de fallback.',
    ],
    metrics: [
      'Latencia p95 < 2 s y time-to-first-token p95 < 300 ms medidos a 50 RPS sostenidos.',
      'Coste < 0,015 $ por resolución y < 300 $/mes a 50 RPS, con desglose por componente.',
      'Faithfulness ≥ 0,90 sobre el conjunto de evaluación, sin citas inventadas.',
      'Task success ≥ 85 % en tareas de soporte completadas de extremo a extremo.',
      'Tasa de fallback < 2 % de las peticiones escaladas a Sonnet o a revisión humana.',
      'Cobertura bilingüe: ≥ 95 % de aciertos tanto en español como en inglés.',
    ],
    rubric: [
      {
        criterion: 'Rendimiento y escalabilidad',
        weight: 0.25,
        passes: 'p95 < 2 s y TTFT p95 < 300 ms sostenidos 30 min a 50 RPS con informe de carga reproducible.',
      },
      {
        criterion: 'Calidad y fidelidad de las respuestas',
        weight: 0.25,
        passes: 'Faithfulness ≥ 0,90 y task success ≥ 85 % en el set de evaluación bilingüe etiquetado.',
      },
      {
        criterion: 'Arquitectura y eficiencia de coste',
        weight: 0.2,
        passes: 'Router, HNSW + reranker y caché semántico implementados; coste < 0,015 $/resolución y < 300 $/mes.',
      },
      {
        criterion: 'Observabilidad y seguridad',
        weight: 0.15,
        passes: 'Trazas Langfuse completas, structured output validado y guardrails con tests de inyección y fuga de datos.',
      },
      {
        criterion: 'Robustez y evidencia',
        weight: 0.15,
        passes: 'Fallback < 2 % medido, fallos documentados con causa y mitigación, y agregaciones de coste auditables.',
      },
    ],
    eliminates: [
      'Tutorial sin métricas: seguir un ejemplo de RAG sin medir latencia, faithfulness ni coste real.',
      'Código sin tests: desplegar el pipeline sin evaluación ni pruebas de guardrails o regresiones.',
      'Demo sin fallos documentados: mostrar solo el caso feliz sin trazas de fallbacks ni errores de recuperación.',
    ],
  },
];
