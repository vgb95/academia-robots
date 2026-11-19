import { leccion as L, modulo as M, err, q, p, h, apunte, nota, aviso, codigo, diagrama, tabla, lista, pasos, formula, widget, enlace } from '../helpers';
import type { Module } from '../../types';

export const roboticsPart3: Module[] = [

  // -------------------- BLOQUE 8: CONTROL Y CINEMÁTICA --------------------
  M('b8', 'Control y cinemática', 'Del PID intuitivo al control óptimo, pasando por cinética, dinámica y planificación', [
    L({
      id: 'r8-1', title: 'PID por intuición', min: 14, level: 'intermedio',
      objectives: ['Entender la realimentación como bucle error→acción', 'Intuir qué aporta cada una de las tres acciones'],
      blocks: [
        p('Un controlador no "sabe" dónde debe estar el robot: solo mide dónde está y compara con dónde quiere estar. A esa diferencia se le llama **error**. El trabajo del controlador es convertir ese error en una orden para el motor que lo reduce.'),
        diagrama('pid', 'El lazo cerrado: setpoint, error, controlador, planta y realimentación.'),
        formula('e(t) = y_deseado(t) − y_medido(t)        u(t) = Kp·e + Ki·∫e dt + Kd·de/dt', 'u es la señal de control (por ejemplo, un PWM o un par).'),
        p('Analogía del termostato: si hace frío, enciendes la calefacción (P). Si lleva mucho rato frío, subes más la potencia (I). Si la temperatura está subiendo muy rápido, bajas antes de pasarte (D). Eso es un PID.'),
        tabla(['Acción', 'Pregunta que responde', 'Si falta'], [
          ['P (proporcional)', '¿Cuánto error hay ahora?', 'Respuesta lenta y error residual'],
          ['I (integral)', '¿Cuánto tiempo llevo con error?', 'No elimina el error permanente'],
          ['D (derivativo)', '¿A qué velocidad cambia el error?', 'Overshoot y oscilaciones']
        ]),
        widget('pid'),
        apunte('Planta', 'En control se llama planta al sistema que queremos dominar: un motor, un brazo, un horno. El controlador no modela la planta al detalle; reacciona a lo que mide. Esa robustez es la razón de que el PID esté en todas partes.'),
        nota('El PID clásico surge en los años 40 para reguladores industriales. Hoy sigue en el 90% de los lazos de velocidad y posición de motores y servos.'),
        enlace('https://controlguru.com/control-loop-fundamentals/', 'Control Guru: fundamentos de lazo de control', 'Lectura amable con analogías físicas.')
      ],
      errors: [err('El motor llega pero se queda un poco corto siempre', 'Falta término integral o ganancia Kp insuficiente', 'Añade Ki pequeño o aumenta Kp hasta eliminar el error estacionario.')],
      practice: { task: 'Explica en voz alta, sin mirar, cómo reaccionaría un PID ante un escalón de posición. Describe la contribución de P, I y D en cada fase.', success: ['Mencionas error y realimentación', 'Distinguen las tres acciones', 'Usas tus propias palabras'] },
      quiz: [q('¿Qué señal introduce el lazo de realimentación al controlador?', ['La referencia deseada', 'El error entre deseo y medición', 'La corriente del motor', 'La ganancia Kp'], 1, 'El lazo lee la salida, la resta de la referencia y entrega el error al controlador.')]
    }),
    L({
      id: 'r8-2', title: 'Términos P, I, D y el windup', min: 18, level: 'intermedio',
      objectives: ['Predecir el efecto de cada ganancia', 'Implementar anti-windup en un controlador real'],
      blocks: [
        h('Qué hace cada término, con números'),
        p('Supón un motor con error de 10 grados. Con Kp = 0.5 la orden es 5; con Kp = 2 la orden es 20 y el motor se mueve cuatro veces más rápido, pero con más riesgo de pasarse. Kp reduce el error, demasiado Kp genera overshoot y ruido amplificado.'),
        formula('u_P = Kp·e        u_I = Ki·Σ e·Δt        u_D = Kd·(e_k − e_{k−1})/Δt', 'La integral acumula; la derivada anticipa.'),
        diagrama('pid_respuesta', 'Tres respuestas al escalón: bien sintonizado, Kp excesivo e integral excesiva.'),
        apunte('Integral windup', 'Si el actuador está saturado (PWM al 100%) y el error sigue presente, la integral sigue creciendo aunque no sirva de nada. Cuando el error cambia de signo, la integral acumulada tarda en descargarse y el robot se pasa de golpe. A eso se le llama windup.'),
        codigo('python', `class PID:
    def __init__(self, kp, ki, kd, dt, umin=-1.0, umax=1.0):
        self.kp, self.ki, self.kd = kp, ki, kd
        self.dt, self.umin, self.umax = dt, umin, umax
        self.integral = 0.0
        self.prev = 0.0

    def step(self, error):
        self.integral += error * self.dt
        derivative = (error - self.prev) / self.dt
        self.prev = error
        u = self.kp*error + self.ki*self.integral + self.kd*derivative
        u = max(self.umin, min(self.umax, u))
        # anti-windup por saturación: no acumules si ya estás en el límite
        if u != self.kp*error + self.ki*self.integral + self.kd*derivative:
            self.integral -= error * self.dt
        return u`, 'PID discreto con anti-windup por saturación.'),
        tabla(['Síntoma', 'Causa probable', 'Ajuste'], [
          ['Respuesta lenta', 'Kp bajo', 'Subir Kp'],
          ['Overshoot grande', 'Kp alto o Kd bajo', 'Bajar Kp o subir Kd'],
          ['Error permanente', 'Ki = 0', 'Añadir Ki pequeño'],
          ['Oscilación ruidosa', 'Kd amplifica ruido del sensor', 'Filtrar la derivada']
        ]),
        aviso('La derivada amplifica el ruido: si tu encoder tiene cuantización, un Kd alto produce una señal de control que "tiene comezón". Filtra la medición o aplica un filtro paso bajo a la derivada.')
      ],
      errors: [
        err('El robot se pasa mucho y luego vuelve despacio', 'Windup de la integral durante la saturación', 'Usa clamping, back-calculation o congela la integral cuando el actuador está saturado.'),
        err('La salida del controlador vibra con ruido', 'Derivada sobre una señal ruidosa', 'Filtra la medición (media móvil o filtro de primer orden) antes de derivar.')
      ],
      practice: { task: 'Simula un PID sobre una masa con inercia. Prueba Kp=1, luego Kp=8 y luego añade Kd=2. Anota overshoot y tiempo de estabilización.', success: ['Ves el efecto de Kp y Kd', 'Reproduces el windup saturando u', 'Tu anti-windup funciona'] },
      quiz: [q('¿Qué problema resuelve el anti-windup?', ['El ruido del sensor', 'La acumulación excesiva de la integral mientras el actuador está saturado', 'La falta de Kp', 'El retardo de comunicación'], 1, 'Evita que la integral siga creciendo cuando la orden ya no puede aumentar.')]
    }),
    L({
      id: 'r8-3', title: 'Sintonización y respuesta al escalón', min: 18, level: 'intermedio',
      objectives: ['Medir calidad de respuesta con métricas concretas', 'Aplicar un método de sintonización empírico'],
      blocks: [
        p('Sintonizar es elegir Kp, Ki y Kd. Hacerlo a ojo funciona, pero conviene medir. La prueba estándar es el **escalón**: pides un cambio brusco de posición y miras la curva resultante.'),
        diagrama('pid_respuesta', 'Comparativa de respuestas: la verde es la que buscamos.'),
        tabla(['Métrica', 'Qué mide', 'Valor típico deseado'], [
          ['Rise time', 'Tiempo de 10% a 90%', 'Lo más corto posible'],
          ['Overshoot', 'Cuánto te pasas del objetivo', '< 10–20%'],
          ['Settling time', 'Tiempo a entrar en banda ±2%', 'Pequeño'],
          ['Error estacionario', 'Diferencia final', '≈ 0']
        ]),
        pasos([
          { title: '1. Empieza solo con P', text: 'Sube Kp hasta que aparezca oscilación sostenida; anota ese Kp crítico.' },
          { title: '2. Añade D', text: 'Kd amortigua: aumenta hasta reducir el overshoot sin arruinar el rise time.' },
          { title: '3. Añade I', text: 'Ki pequeño para matar el error permanente; vigila el windup.' },
          { title: '4. Verifica con otra referencia', text: 'Un buen ajuste funciona también con escalones más pequeños y con carga.' }
        ]),
        codigo('python', `import numpy as np
from scipy import signal

# Planta: motor de primer orden con retardo
s = signal.TransferFunction([1], [0.4, 1])
t = np.linspace(0, 3, 600)
t, y = signal.step(s, T=t)

overshoot = (y.max() - y[-1]) / y[-1] * 100
settling = t[np.where(np.abs(y - y[-1]) > 0.02 * y[-1])[0][-1] + 1]
print(f"overshoot={overshoot:.1f}%  settling={settling:.2f}s")`, 'Medir overshoot y tiempo de estabilización de una respuesta.'),
        apunte('Ziegler–Nichols', 'El método clásico: lleva el lazo a oscilación sostenida con solo P (Ku, periodo Tu) y aplica reglas empíricas, por ejemplo Kp=0.6·Ku, Ki=1.2·Ku/Tu, Kd=0.075·Ku·Tu. Es agresivo: úsalo como punto de partida, no como resultado final.'),
        formula('Kp = 0.6·Ku        Ki = 1.2·Ku/Tu        Kd = 0.075·Ku·Tu', 'Regla de Ziegler–Nichols para control PID.')
      ],
      errors: [err('El robot oscila sin parar al subir Kp', 'Kp por encima del margen de estabilidad', 'Baja Kp y añade Kd; repite la prueba de escalón.')],
      practice: { task: 'Graba la respuesta al escalón de tu motor a 1 kHz, calcula overshoot y settling time en Python y guarda la gráfica.', success: ['Mides con datos reales', 'Identificas overshoot', 'Justificas el reajuste'] },
      quiz: [q('En un escalón, ¿qué métrica mide cuánto te pasas del objetivo?', ['Rise time', 'Overshoot', 'Settling time', 'Banda muerta'], 1, 'El overshoot es el exceso máximo sobre el valor final.')]
    }),
    L({
      id: 'r8-4', title: 'Función de transferencia', min: 16, level: 'avanzado',
      objectives: ['Modelar un sistema lineal en el dominio de Laplace', 'Predecir la respuesta cerrada del lazo'],
      blocks: [
        p('La función de transferencia G(s) es la relación entre la salida y la entrada de un sistema lineal e invariante en el tiempo, asumiendo condiciones iniciales cero. Comprime toda la dinámica en una expresión algebraica.'),
        formula('G(s) = Y(s)/U(s)        Lazo cerrado: T(s) = G(s)·C(s) / (1 + G(s)·C(s))', 'C(s) es el controlador; el denominador 1+GC determina la estabilidad.'),
        diagrama('paso', 'Entrada u(t), modelo G(s), salida y(t) y realimentación.'),
        p('Ejemplo clásico: un motor DC con inercia J, rozamiento b, constante de par kt y resistencia R se aproxima por G(s) = kt / (R·(J·s + b) + kt·ke), que es un primer orden con ganancia estática y constante de tiempo.'),
        codigo('python', `import numpy as np
from scipy import signal

kt, ke, R, J, b = 0.01, 0.01, 1.0, 0.0002, 0.0001
num = [kt]
den = [R*J, R*b + kt*ke]
G = signal.TransferFunction(num, den)

# realimentación proporcional Kp
Kp = 2.0
T = signal.feedback(G*Kp, 1)
print("polos lazo cerrado:", T.poles)
print("ganancia DC:", signal.dcgain(T))`, 'Modelado de motor DC y cálculo de polos del lazo cerrado.'),
        tabla(['Representación', 'Mejor para', 'Limitación'], [
          ['Función de transferencia', 'SISO lineal, análisis de frecuencia', 'No captura estados internos ni MIMO'],
          ['Espacio de estados', 'MIMO, control moderno', 'Menos intuitiva al principio'],
          ['Modelo no lineal', 'Robot real completo', 'Difícil de analizar']
        ]),
        apunte('Polos y estabilidad', 'Si todos los polos de T(s) tienen parte real negativa, el lazo es estable. La distancia de los polos al eje imaginario marca qué tan rápido se extingue el transitorio.'),
        nota('En la práctica se identifica G(s) experimentalmente: inyectas un escalón o una señal PRBS, mides la salida y ajustas ganancia, constante de tiempo y retardo.')
      ],
      errors: [err('El modelo predice bien en simulación pero mal en el robot', 'Falta de retardo, fricción no lineal o inercia mal identificada', 'Añade un retardo de transporte y verifica el modelo con datos medidos.')],
      practice: { task: 'Identifica la función de transferencia de un motor midiendo su respuesta al escalón: estima ganancia y constante de tiempo.', success: ['Obtienes K y tau', 'Compara simulación con medida', 'Sabes qué supuestos fallan'] },
      quiz: [q('¿Cuándo un lazo cerrado es estable según sus polos?', ['Cuando todos tienen parte real negativa', 'Cuando todos son reales', 'Cuando la ganancia es alta', 'Cuando el denominador es cero'], 0, 'La estabilidad asintótica exige polos en el semiplano izquierdo.')]
    }),
    L({
      id: 'r8-5', title: 'Espacio de estados', min: 18, level: 'avanzado',
      objectives: ['Representar un sistema con estados y matrices', 'Entender observabilidad y controlabilidad'],
      blocks: [
        p('El espacio de estados describe un sistema con un vector x que contiene toda la información necesaria para predecir el futuro: posición, velocidad, corriente, lo que haga falta. En vez de una sola ecuación, usamos un sistema de ecuaciones de primer orden.'),
        formula('ẋ = A·x + B·u        y = C·x + D·u', 'A: dinámica interna; B: cómo entra el control; C: qué medimos; D: paso directo.'),
        diagrama('estado', 'Estado, evolución, medición y observador.'),
        p('Ejemplo: un carro con posición p y velocidad v. Con u como fuerza, ẋ = [v, u/m] y si medimos solo la posición, C = [1, 0]. Dos estados, una salida.'),
        codigo('python', `import numpy as np
from scipy import signal

m, b = 1.0, 0.2
A = np.array([[0.0, 1.0], [0.0, -b/m]])
B = np.array([[0.0], [1.0/m]])
C = np.array([[1.0, 0.0]])
D = np.array([[0.0]])

# controlabilidad y observabilidad
Mc = signal.cont2discrete((A,B,C,D), 1.0)[0]  # solo para ver shapes
Wc = np.hstack([B, A@B])
Wo = np.vstack([C, C@A])
print("rango controlabilidad:", np.linalg.matrix_rank(Wc))
print("rango observabilidad:", np.linalg.matrix_rank(Wo))`, 'Matrices A,B,C,D y pruebas de rango.'),
        tabla(['Concepto', 'Pregunta', 'Si falla'], [
          ['Controlabilidad', '¿Puedo llevar el estado donde quiero?', 'Ningún u sirve: hay un modo incontrolable'],
          ['Observabilidad', '¿Puedo inferir x de las salidas?', 'Necesito un observador o más sensores']
        ]),
        apunte('Observador', 'Si no mides todos los estados (típico: mides posición pero no velocidad), construyes un estimador: ẋ̂ = Ax̂ + Bu + L(y − Cx̂). La ganancia L coloca los polos del error de estimación más rápidos que los del control.'),
        nota('Un mismo sistema tiene infinitas realizaciones de espacio de estados; los autovalores de A (los polos) son invariantes y son los que importan para estabilidad.')
      ],
      errors: [err('El observador diverge en cuanto lo conecto', 'Polos del observador demasiado lentos o sistema no observable', 'Coloca L para que los polos del error sean 2–5 veces más rápidos que los del control.')],
      practice: { task: 'Escribe A,B,C,D para un péndulo invertido linealizado y comprueba controlabilidad y observabilidad con NumPy.', success: ['Construyes las matrices', 'Calculas rangos', 'Interpretas el resultado'] },
      quiz: [q('Si un sistema no es observable, ¿qué ocurre?', ['No se puede controlar', 'No se puede reconstruir todo el estado a partir de las salidas', 'Es inestable siempre', 'No tiene entradas'], 1, 'La observabilidad mide si las salidas contienen información suficiente sobre el estado.')]
    }),
    L({
      id: 'r8-6', title: 'LQR: control óptimo lineal', min: 18, level: 'avanzado',
      objectives: ['Formular el coste cuadrático de un controlador', 'Sintonizar Q y R con criterio físico'],
      blocks: [
        p('Hasta ahora elegíamos ganancias a ojo. LQR (Linear Quadratic Regulator) las calcula resolviendo un problema de optimización: minimizar una función de coste que penaliza tanto alejarse del estado deseado como gastar esfuerzo de control.'),
        formula('J = ∫ (xᵀ Q x + uᵀ R u) dt        u = −K·x        K = R⁻¹·Bᵀ·P', 'P se obtiene de la ecuación algebraica de Riccati: AᵀP + PA − PBR⁻¹BᵀP + Q = 0.'),
        diagrama('lqr', 'Dinámica, pesos Q y R, Riccati y ganancia K.'),
        p('Q es una matriz semidefinida positiva: castiga el error de estado. R es definida positiva: castiga el esfuerzo. Si haces R muy pequeño, el controlador es agresivo y gasta mucha energía; si lo haces grande, es conservador y lento.'),
        codigo('python', `import numpy as np
from scipy.linalg import solve_continuous_are

m, b = 1.0, 0.2
A = np.array([[0.0, 1.0], [0.0, -b/m]])
B = np.array([[0.0], [1.0/m]])
Q = np.diag([10.0, 1.0])   # priorizamos posición
R = np.array([[0.1]])      # esfuerzo barato

P = solve_continuous_are(A, B, Q, R)
K = np.linalg.inv(R) @ B.T @ P
print("K =", K)             # u = -K @ x
print("polos:", np.linalg.eigvals(A - B@K))`, 'Diseño LQR para el carro con SciPy.'),
        tabla(['Ajuste', 'Efecto'], [
          ['Q posición alta', 'Llega rápido al objetivo, más esfuerzo'],
          ['Q velocidad alta', 'Movimiento más suave y amortiguado'],
          ['R alta', 'Menos energía, respuesta más lenta'],
          ['R baja', 'Más agresivo, sensible a ruido y saturación']
        ]),
        apunte('Por qué funciona tan bien', 'LQR garantiza estabilidad si (A,B) es controlable y (A,Q) es detectable, y ofrece márgenes de estabilidad razonables (al menos 60° de fase y ganancia infinita hacia arriba). Por eso es el punto de partida natural antes de ir a MPC.'),
        aviso('LQR asume linealidad y sin restricciones. Si tu robot topa con límites de par o de velocidad, la ley u=−Kx puede saturarse: considera un LQR con integrador (integral action) o pasa a MPC.')
      ],
      errors: [err('La ganancia K es enorme y el motor satura', 'R demasiado pequeño', 'Aumenta R hasta que la orden esté dentro del rango del actuador.')],
      practice: { task: 'Diseña un LQR para el carro, simula la respuesta y compárala con un PID sintonizado. Anota Overshoot y esfuerzo.', success: ['Resuelves Riccati', 'Explicas Q y R', 'Comparas con PID'] },
      quiz: [q('En LQR, ¿qué matriz penaliza el esfuerzo de control?', ['Q', 'R', 'A', 'P'], 1, 'R aparece en uᵀRu y castiga cuánto empujamos el actuador.')]
    }),
    L({
      id: 'r8-7', title: 'MPC: control predictivo por horizonte móvil', min: 20, level: 'avanzado',
      objectives: ['Entender la optimización recurrente con restricciones', 'Saber cuándo MPC supera a LQR'],
      blocks: [
        p('MPC resuelve, en cada ciclo, un pequeño problema de optimización: "dado mi estado actual, ¿cuál es la mejor secuencia de controles para los próximos N pasos?". Aplica solo el primero y vuelve a calcularlo todo en el ciclo siguiente. A eso se le llama horizonte móvil.'),
        diagrama('mpc', 'Predecir, optimizar, aplicar el primer control y repetir.'),
        formula('min Σ (xᵀQx + uᵀRu)  sujeto a  x_{k+1}=Ax_k+Bu_k,  u_min≤u≤u_max,  x∈X', 'Las restricciones son la gran ventaja de MPC sobre LQR.'),
        pasos([
          { title: '1. Predecir', text: 'Propaga el modelo N pasos hacia delante desde el estado medido.' },
          { title: '2. Optimizar', text: 'Minimiza el coste respetando límites de par y velocidad.' },
          { title: '3. Aplicar', text: 'Envía únicamente u₀ al robot.' },
          { title: '4. Repetir', text: 'Mide de nuevo y reconstruye el problema: robustness ante perturbaciones.' }
        ]),
        codigo('python', `import numpy as np
import cvxpy as cp

A = np.array([[1.0, 0.1], [0.0, 1.0]])
B = np.array([[0.0], [0.1]])
N, x0 = 15, np.array([1.0, 0.0])

x = cp.Variable((2, N+1)); u = cp.Variable((1, N))
cost = 0
for k in range(N):
    cost += cp.quad_form(x[:,k], np.eye(2)) + 0.1*cp.quad_form(u[:,k], np.eye(1))
    cost += 0.0  # (en producción, añadir penalización de terminal)
prob = cp.Problem(cp.Minimize(cost), [
    x[:,0] == x0,
    x[:,k+1] == A@x[:,k] + B@u[:,k],
    cp.abs(u[:,k]) <= 1.0
])
prob.solve()
print("primera acción:", u[:,0].value)`, 'MPC mínimo con CVXPY para un integrador doble.'),
        tabla(['', 'LQR', 'MPC'], [
          ['Restricciones', 'No', 'Sí, Explícitas'],
          ['Cálculo', 'Gain constante, cheap', 'Optimización online, costoso'],
          ['Horizonte', 'Infinito', 'Finito N'],
          ['Caso típico', 'Motores, balanceo', 'Manipulación con contacto, conducción']
        ]),
        apunte('Coste computacional', 'Un MPC puede resolver decenas o cientos de variables por milisegundo. En robots rápidos se usa código generado (ACADO, CasADi, OSQP) o se reduce el horizonte. Empieza con N pequeño y mide el tiempo de resolución.'),
        nota('MPC es la técnica detrás de gran parte del control de locomoción y conducción autónoma moderno: permite decir "no pises más allá de este par" dentro del propio optimizador.')
      ],
      errors: [err('El MPC no converge a tiempo en el ciclo de control', 'Horizonte demasiado largo o solver mal configurado', 'Reduce N, usa un solver de propósito específico (OSQP) y verifica el tiempo de solve.')],
      practice: { task: 'Implementa el MPC del ejemplo, añade un límite de velocidad y comprueba que la restricción se respeta en la simulación.', success: ['La optimización converge', 'Las restricciones se cumplen', 'Mides el tiempo de cómputo'] },
      quiz: [q('¿Qué distingue a MPC de LQR?', ['MPC no usa modelo', 'MPC optimiza un horizonte finito respetando restricciones en cada ciclo', 'LQR es no lineal', 'MPC no realimenta'], 1, 'La optimización recurrente con restricciones explícitas es la seña de identidad de MPC.')]
    }),
    L({
      id: 'r8-8', title: 'Cinemática directa', min: 16, level: 'intermedio',
      objectives: ['Calcular la pose del efector desde los ángulos', 'Usar matrices homogéneas y convenciones DH'],
      blocks: [
        p('La cinemática directa responde a: "si muevo cada articulación a este ángulo, ¿dónde acaba mi pinza?". Es una función determinista q → pose. No depende de fuerzas ni del tiempo, solo de la geometría del robot.'),
        diagrama('cinematica', 'Brazo planar de dos eslabones: L1, θ1, L2, θ2 y posición final (x,y).'),
        formula('x = L1·cos(q1) + L2·cos(q1+q2)        y = L1·sin(q1) + L2·sin(q1+q2)', 'Brazo planar de 2 grados de libertad.'),
        codigo('python', `import numpy as np

def fk_2link(q1, q2, L1=1.0, L2=0.8):
    x = L1*np.cos(q1) + L2*np.cos(q1+q2)
    y = L1*np.sin(q1) + L2*np.sin(q1+q2)
    return np.array([x, y])

print(fk_2link(np.deg2rad(30), np.deg2rad(45)))

def transform(DH):
    a, alpha, d, theta = DH
    ca, sa = np.cos(alpha), np.sin(alpha)
    ct, st = np.cos(theta), np.sin(theta)
    return np.array([[ct, -st*ca,  st*sa, a*ct],
                     [st,  ct*ca, -ct*sa, a*st],
                     [0,      sa,      ca,    d],
                     [0,       0,       0,    1]])`, 'Cinemática directa analítica y matriz homogénea DH.'),
        tabla(['Convención', 'Uso', 'Nota'], [
          ['Denavit–Hartenberg', 'Brazos seriales clásicos', '4 parámetros por eslabón'],
          ['Matrices homogéneas 4x4', 'Composición de transformadas', 'Rotación + traslación en una matriz'],
          ['Producto de exponenciales', 'Robótica moderna (modern robotics)', 'Más limpio para brazos complejos']
        ]),
        apunte('Composición', 'Si tienes T₀¹, T₁², ... Tₙ⁻¹ⁿ, la pose del efector es el producto T = T₀¹·T₁²·...·Tₙ⁻¹ⁿ. El orden importa: las matrices no conmutan.'),
        lista(['Fija primero los marcos de referencia (base, eslabones, tool).', 'Documenta la convención: sin ella, tu IK y tu FK no coincidirán.', 'Valida con una pose conocida: q = 0 debe dar la posición home esperada.'])
      ],
      errors: [err('La posición calculada no coincide con la del robot real', 'Convención de marcos o signos de ángulos distintos', 'Dibuja los marcos a mano y comprueba la matriz de cada eslabón por separado.')],
      practice: { task: 'Implementa la FK de tu brazo con matrices homogéneas y compruébala con 3 configuraciones medidas físicamente.', success: ['Coincide con la realidad', 'Documentas la convención', 'Usas 4x4 correctamente'] },
      quiz: [q('¿Qué devuelve la cinemática directa?', ['Los ángulos desde una pose', 'La pose del efector desde los ángulos', 'Los pares necesarios', 'La trayectoria suavizada'], 1, 'FK mapea configuración de articulaciones → pose del efector.')]
    }),
    L({
      id: 'r8-9', title: 'Cinemática inversa', min: 18, level: 'intermedio',
      objectives: ['Resolver articulaciones desde una pose deseada', 'Elegir entre solución analítica e iterativa'],
      blocks: [
        p('La cinemática inversa (IK) es el problema inverso: quieres que la pinza esté en (x, y, z) con una orientación dada y necesitas saber a qué ángulos poner cada servo. Es más difícil que la directa: puede tener muchas soluciones, una sola o ninguna.'),
        diagrama('ik', 'Pose deseada → solver → ángulos q → comprobación de colisiones y límites.'),
        formula('Brazo planar:  cos(q2) = (x² + y² − L1² − L2²) / (2·L1·L2)', 'De ahí salen dos ramas: codo arriba y codo abajo.'),
        codigo('python', `import numpy as np

def ik_2link(x, y, L1=1.0, L2=0.8, elbow_up=True):
    c2 = (x*x + y*y - L1*L1 - L2*L2) / (2*L1*L2)
    if abs(c2) > 1.0:
        raise ValueError("objetivo fuera del espacio de trabajo")
    q2 = np.arccos(c2)
    if not elbow_up:
        q2 = -q2
    q1 = np.arctan2(y, x) - np.arctan2(L2*np.sin(q2), L1 + L2*np.cos(q2))
    return q1, q2

print(np.rad2deg(ik_2link(1.2, 0.5)))`, 'IK analítica de dos eslabones con selección de rama.'),
        apunte('Solución numérica', 'Para brazos de 6+ grados de libertad se usa optimización: iterar q ← q + J⁺·(x_deseado − x_actual), donde J⁺ es la seudoinversa del Jacobiano. MoveIt 2 usa solvers como KDL o TRAC-IK.'),
        tabla(['Método', 'Ventaja', 'Inconveniente'], [
          ['Analítico', 'Rápido, exacto', 'Solo para geometrías simples'],
          ['Numérico (Jacobiano)', 'Genérico', 'Puede quedarse en mínimos locales'],
          ['IK con restricciones', 'Evita colisiones y límites', 'Más lento']
        ]),
        aviso('Una IK que ignora los límites de las articulaciones puede devolver ángulos imposibles. Siempre valida q dentro de los límites y comprueba colisiones antes de ejecutar.')
      ],
      errors: [err('El solver devuelve una configuración retorcida', 'Rama de codo elegida al azar o semilla inicial pobre', 'Fija una rama (elbow up/down) o parte de una semilla cercana a la postura actual.')],
      practice: { task: 'Resuelve la IK de tu brazo para 5 puntos y comprueba con la FK que la pose obtenida es la pedida.', success: ['FK y IK cierran el círculo', 'Respetas límites', 'Manejas puntos inalcanzables'] },
      quiz: [q('¿Por qué puede fallar la IK de un brazo?', ['Porque la FK es no lineal', 'Porque el objetivo puede estar fuera del espacio de trabajo o tener múltiples soluciones', 'Porque no hay sensores', 'Porque falta un PID'], 1, 'Alcance, singularidades y multiplicidad de soluciones son las causas clásicas.')]
    }),
    L({
      id: 'r8-10', title: 'Jacobiano y singularidades', min: 18, level: 'avanzado',
      objectives: ['Relacionar velocidades articulares y del efector', 'Detectar y evitar configuraciones singulares'],
      blocks: [
        p('El Jacobiano J(q) es la matriz de derivadas parciales de la pose del efector respecto a las articulaciones. Es el puente entre el espacio de articulaciones y el espacio de trabajo: convierte velocidades de motor en velocidades de la pinza.'),
        formula('ẋ = J(q)·q̇        q̇ = J(q)⁺·ẋ', 'J⁺ es la seudoinversa: Jᵀ(JJᵀ)⁻¹ para brazos redundantes.'),
        diagrama('jacobiano', 'Velocidades articulares → J(q) → velocidad del efector → singularidad.'),
        codigo('python', `import numpy as np

def jacobian_2link(q1, q2, L1=1.0, L2=0.8):
    s1, s2 = np.sin(q1), np.sin(q1+q2)
    c1, c2 = np.cos(q1), np.cos(q1+q2)
    return np.array([[-L1*s1 - L2*s2, -L2*s2],
                     [ L1*c1 + L2*c2,  L2*c2]])

J = jacobian_2link(np.deg2rad(30), np.deg2rad(45))
print("determinante:", np.linalg.det(J))
print("manejabilidad:", np.sqrt(np.linalg.det(J @ J.T)))`, 'Jacobiano planar y medida de manejabilidad.'),
        apunte('Singularidad', 'Cuando el determinante de J se acerca a cero, el brazo pierde un grado de libertad efectivo: hay direcciones en las que no puede moverse por mucho que giren los motores, y las velocidades articulares necesarias se disparan. En el brazo planar ocurre con q2 = 0 o π (totalmente estirado o plegado).'),
        aviso('Cerca de una singularidad, la seudoinversa amplifica ruido y comandos. Usa amortiguación (damped least squares): J⁺ = Jᵀ(JJᵀ + λ²I)⁻¹, con λ pequeño.'),
        tabla(['Uso del Jacobiano', 'Ejemplo'], [
          ['Velocidad', 'Convertir ẋ deseado en q̇'],
          ['IK diferencial', 'Corregir pose iterativamente'],
          ['Fuerza', 'τ = Jᵀ·F (mapa de fuerzas)'],
          ['Manejabilidad', 'Detectar cercanía a singularidad']
        ])
      ],
      errors: [err('Los motores se disparan a máxima velocidad cerca de un punto', 'Singularidad: J casi singular', 'Añade amortiguación λ a la seudoinversa y evita la configuración.')],
      practice: { task: 'Calcula el determinante del Jacobiano de tu brazo en 10 configuraciones y haz un mapa de manejabilidad.', success: ['Identificas las zonas singulares', 'Usas damped least squares', 'Interpretas el mapa'] },
      quiz: [q('¿Qué indica un determinante de J cercano a cero?', ['Que el brazo está en su mejor postura', 'Que hay una singularidad: se pierde un grado de libertad', 'Que falta calibración', 'Que el motor está saturado'], 1, 'La pérdida de rango del Jacobiano define la singularidad cinemática.')]
    }),
    L({
      id: 'r8-11', title: 'Dinámica del robot', min: 20, level: 'avanzado',
      objectives: ['Escribir la ecuación de movimiento de un manipulador', 'Entender inercia, Corriolis y gravedad'],
      blocks: [
        p('La cinemática ignora las fuerzas; la dinámica no. Para que un brazo siga una trayectoria rápida necesitas saber cuánto par hay que aplicar en cada articulación. La ecuación estándar del manipulador es compacta pero esconde mucha física.'),
        formula('M(q)·q̈ + C(q, q̇)·q̇ + g(q) + F(q̇) = τ', 'M: matriz de inercia; C: Coriolis y centrípetas; g: gravedad; F: fricción; τ: pares.'),
        tabla(['Término', 'Qué representa', 'Cuándo domina'], [
          ['M(q)q̈', 'Inercia: resistencia a acelerar', 'Movimientos rápidos'],
          ['C(q,q̇)q̇', 'Fuerzas de Coriolis y centrípetas', 'Ejes que giran a la vez'],
          ['g(q)', 'Gravedad', 'Brazos grandes, posiciones estiradas'],
          ['F(q̇)', 'Fricción y cogging', 'Bajas velocidades']
        ]),
        apunte('Por qué importa el modelo', 'Un controlador que conoce M, C y g puede compensarlos por feedforward: τ = M(q)q̈_d + C q̇_d + g(q) + PID. El PID corrige solo los errores residuales, así que el seguimiento mejora muchísimo.'),
        codigo('cpp', `#include <pinocchio/multibody/model.hpp>
#include <pinocchio/algorithm/rnea.hpp>

// Modelo desde URDF;Pinocchio implementa dynamics inversa (RNEA)
pinocchio::Model model;
pinocchio::urdf::buildModel("robot.urdf", model);
pinocchio::Data data(model);

Eigen::VectorXd q(model.nq), v(model.nv), a(model.nv);
q.setZero(); v.setZero(); a.setZero();
Eigen::VectorXd tau = pinocchio::rnea(model, data, q, v, a);
// tau contiene el par necesario para mantener esa configuración`, 'Dinámica inversa con Pinocchio (C++).'),
        lista(['Identifica masas, centros de masa e inertias del URDF; un error del 20% en la inercia se nota en aceleraciones altas.', 'La inercia depende de q: no es constante como en un motor simple.', 'En brazos ligeros, la gravedad es el término que más importa.']),
        nota('Métodos numéricos: la dinámica inversa recursiva (RNEA) calcula τ en O(n), y la dinámica directa (ABA) calcula q̈ en O(n). Ambas están en Pinocchio, KDL y Drake.')
      ],
      errors: [err('El brazo cae cuando desactivo el control', 'No se compensa la gravedad g(q)', 'Añade un término feedforward con g(q) estimada del modelo.')],
      practice: { task: 'Con Pinocchio o Drake, calcula los pares de gravedad de tu brazo en dos posturas y compruébalos con una báscula casera.', success: ['Obtienes τ de gravedad', 'Coinciden con la medida', 'Entiendes M, C y g'] },
      quiz: [q('¿Qué término de la dinámica representa la gravedad?', ['M(q)', 'C(q,q̇)', 'g(q)', 'τ'], 2, 'g(q) es el vector de pares gravitatorios en cada articulación.')]
    }),
    L({
      id: 'r8-12', title: 'Planificación de trayectorias', min: 18, level: 'intermedio',
      objectives: ['Generar movimientos suaves y libres de colisiones', 'Elegir un planificador según el espacio'],
      blocks: [
        p('Planificar no es solo encontrar un camino: es producir una curva que el robot pueda seguir sin golpes, respetando límites de velocidad, aceleración y jerk (la tasa de cambio de aceleración).'),
        diagrama('trayectoria', 'Inicio y meta → búsqueda (A*, RRT, PRM) → suavizado → ejecución.'),
        pasos([
          { title: '1. Modelar el espacio', text: 'Configuración libre = q sin colisiones; construye el planning scene.' },
          { title: '2. Buscar un camino', text: 'En 2D, A* sobre una rejilla. En brazos, RRT o PRM en el espacio de configuraciones.' },
          { title: '3. Suavizar', text: 'Ajusta una curva (spline o polinomio quinto) que pase por los puntos.' },
          { title: '4. Remuestrear en tiempo', text: 'Aplica perfiles trapezoides o S-curve para limitar aceleración y jerk.' }
        ]),
        formula('q(t) = a0 + a1·t + a2·t² + a3·t³ + a4·t⁴ + a5·t⁵', 'Polinomio de quinto grado: cumple posición, velocidad y aceleración en ambos extremos.'),
        codigo('python', `import numpy as np

def quintic(q0, qf, T, t):
    # condiciones: q(0)=q0, q(T)=qf, q'(0)=q'(T)=q''(0)=q''(T)=0
    a0, a1, a2 = q0, 0.0, 0.0
    a3 = 10*(qf-q0)/T**3
    a4 = -15*(qf-q0)/T**4
    a5 = 6*(qf-q0)/T**5
    q  = a0 + a1*t + a2*t**2 + a3*t**3 + a4*t**4 + a5*t**5
    qd = 3*a3*t**2 + 4*a4*t**3 + 5*a5*t**4
    return q, qd

for t in np.linspace(0, 1, 5):
    print(t, quintic(0.0, 1.0, 1.0, t))`, 'Trayectoria suave de quinto grado con aceleración nula en los extremos.'),
        tabla(['Planificador', 'Espacio', 'Ideal para'], [
          ['A* / Dijkstra', 'Rejilla 2D', 'Robots móviles'],
          ['RRT / RRT*', 'Alta dimensión', 'Brazos con obstáculos'],
          ['PRM', 'Alta dimensión, muchas consultas', 'Celdas de trabajo fijas'],
          ['CHOMP / STOMP', 'Optimización', 'Suavizar con restricciones']
        ]),
        apunte('Tiempo vs espacio', 'Un camino en el espacio de configuraciones no dice a qué velocidad recorrerlo. El time-parameterization es un paso separado y es donde se enforcan aceleraciones y jerk. MoveIt 2 hace ambas cosas.')
      ],
      errors: [err('El brazo tiembla al frenar', 'Perfil de velocidad con aceleración discontinua', 'Usa un perfil S-curve o un polinomio quinto en lugar de trapezoidal.')],
      practice: { task: 'Genera una trayectoria quinta para un eje, grafica q, q̇ y q̈ y verifica que aceleración y jerk empiezan y acaban en cero.', success: ['Aceleración continua', 'Jerk limitado', 'Respetas límites'] },
      quiz: [q('¿Qué ventaja tiene un polinomio de quinto grado sobre uno cúbico?', ['Es más rápido de calcular', 'Permite imponer posición, velocidad y aceleración en los extremos', 'No necesita modelo', 'Siempre evita colisiones'], 1, 'El quinto grado da seis condiciones de contorno: q, q̇ y q̈ al inicio y al final.')]
    }),
    L({
      id: 'r8-13', title: 'Control de fuerza e impedancia', min: 18, level: 'avanzado',
      objectives: ['Regular la interacción con el entorno', 'Diferenciar impedancia y admittance'],
      blocks: [
        p('El control de posición es rígido: si el robot encuentra un obstáculo, sigue empujando hasta que algo cede. Para tareas de contacto —ensamblar, limpiar, sostener un huevo— necesitas controlar la relación entre fuerza y movimiento, no solo la posición.'),
        diagrama('fuerza', 'Posición (rígido y preciso) vs fuerza (adaptable y seguro).'),
        formula('F = M·(ẍ_d − ẍ) + B·(ẋ_d − ẋ) + K·(x_d − x)', 'Impedancia: el robot se comporta como masa–resorte–amortiguador.'),
        tabla(['Enfoque', 'Entrada', 'Salida', 'Uso típico'], [
          ['Impedancia', 'Posición', 'Fuerza', 'Brazos con sensor de par en la muñeca'],
          ['Admittance', 'Fuerza medida', 'Posición', 'Brazos sin sensor de fuerza, control por corriente'],
          ['Control de fuerza directo', 'Fuerza deseada', 'Par', 'Pulido, contacto sostenido']
        ]),
        apunte('Intuición', 'Un controlador de impedancia alto (K grande) se siente como un robot rígido: se opone mucho a que lo muevas. Uno de impedancia bajo es blando: se deja empujar. Elegir K y B es diseñar cómo se siente el robot.'),
        codigo('python', `import numpy as np

# Ley de impedancia en 1D con sensor de fuerza en la muñeca
M, B, K = 1.0, 10.0, 100.0
def impedance_step(x, xd, xd_dot, xddot, xdd_des, dt):
    # a partir del error dinámico, obtenemos la fuerza de referencia
    F_ref = M*(xdd_des - xddot) + B*(xd_dot - xd) + K*(x - x)
    return F_ref  # se pasa al controlador de par / admittance

# En admittance: M*xdd + B*xd + K*(x - xd) = F_medida
# se integra para obtener la posición deseada del robot`, 'Esquema de impedancia/admittance en una dimensión.'),
        aviso('Sin sensor de fuerza o estimación de corriente, el control de impedancia es ciego. Empieza con una impedancia alta y bájala gradualmente mientras observas el contacto.')
      ],
      errors: [err('El robot rebota al tocar la mesa', 'Impedancia demasiado alta o amortiguamiento B bajo', 'Baja K y aumenta B hasta que el contacto sea críticamente amortiguado.')],
      practice: { task: 'Programa una ley de impedancia en un eje y haz que la pinza "sienta" blanda al presionar una esponja. Registra la fuerza.', success: ['El contacto es estable', 'Mides la fuerza', 'Ajustas K y B con criterio'] },
      quiz: [q('¿Qué describe un controlador de impedancia?', ['Solo la posición exacta', 'La relación dinámica fuerza–movimiento', 'La temperatura del motor', 'El consumo eléctrico'], 1, 'La impedancia define cómo responde el robot en fuerza ante un desplazamiento.')]
    }),
    L({
      id: 'r8-14', title: 'Sistemas subactuados', min: 18, level: 'avanzado',
      objectives: ['Reconocer sistemas con menos actuadores que grados de libertad', 'Entender por qué el balanceo exige moverse'],
      blocks: [
        p('Un sistema subactuado tiene más grados de libertad que actuadores. No puedes ordenar cada variable por separado: hay que explotar la dinámica y el acoplamiento. El ejemplo canónico es el péndulo invertido sobre un carro (cart-pole).'),
        diagrama('subactuado', 'Cart-pole, balanceo, marcha y herramientas de análisis.'),
        formula('(m+M)·ẍ + m·l·θ̈·cosθ − m·l·θ̇²·sinθ = F        l·θ̈ + ẍ·cosθ − g·sinθ = 0', 'Ecuaciones del carro con péndulo: un solo actuador F para dos grados de libertad.'),
        apunte('Por qué es difícil', 'Para mantener el péndulo en pie, el carro debe moverse hacia donde se cae. El control no estabiliza el ángulo directamente: estabiliza una combinación de ángulo y posición. Un LQR sobre el modelo linealizado lo logra porque encuentra ese acoplamiento.'),
        codigo('python', `import numpy as np
from scipy.linalg import solve_continuous_are

M, m, l, g = 1.0, 0.1, 0.5, 9.81
# linealización cerca de theta=0: estados [x, xd, theta, thetad]
A = np.array([[0,1,0,0],
              [0,0,-m*g/M,0],
              [0,0,0,1],
              [0,0,(M+m)*g/(M*l),0]])
B = np.array([[0],[1/M],[0],[-1/(M*l)]])
Q = np.diag([1,1,10,1]); R = np.array([[0.01]])
P = solve_continuous_are(A,B,Q,R)
K = np.linalg.inv(R) @ B.T @ P
print("K =", K)`, 'LQR para estabilizar un péndulo invertido.'),
        tabla(['Sistema', 'Actuadores / GDL', 'Idea clave'], [
          ['Cart-pole', '1 / 2', 'Mover la base para estabilizar el ángulo'],
          ['Bípedo', 'pocos / muchos', 'Captura, transferencia de peso y empuje'],
          ['Cuadricóptero', '4 / 6', 'Inclinarse para trasladarse'],
          ['Coche con remolque', '1 / 2', 'Girar para alinear el remolque']
        ]),
        nota('Herramientas: LQR linealizado, control por Lyapunov, control de forma centrada (feedback linearization) y optimización de trayectorias (trajectory optimization). El MPC es hoy la opción más usada en locomoción.')
      ],
      errors: [err('El péndulo se cae en cuanto lo suelto', 'La ley de control solo mira el ángulo y no la posición del carro', 'Usa LQR sobre los cuatro estados para explotar el acoplamiento.')],
      practice: { task: 'Simula el cart-pole con LQR y comprueba que aguanta una perturbación pequeña. Muestra x y θ en la misma gráfica.', success: ['El péndulo no cae', 'El carro vuelve al centro', 'Explicas el acoplamiento'] },
      quiz: [q('¿Qué define a un sistema subactuado?', ['Tiene menos sensores que actuadores', 'Tiene menos actuadores que grados de libertad', 'No tiene realimentación', 'Es siempre inestable'], 1, 'La definición es precisamente esa: menos controles independientes que GDL.')]
    }),
    L({
      id: 'r8-15', title: 'Análisis en frecuencia', min: 18, level: 'avanzado',
      objectives: ['Leer diagramas de Bode y márgenes de estabilidad', 'Entender el compromiso entre ancho de banda y ruido'],
      blocks: [
        p('En vez de mirar cómo responde el robot a un escalón en el tiempo, puedes mirar cómo responde a senos de distintas frecuencias. Esa perspectiva —el dominio de la frecuencia— revela márgenes de estabilidad y sensibilidad al ruido que el escalón no muestra.'),
        diagrama('frencuencia', 'Magnitud y fase frente a la frecuencia: típico diagrama de Bode.'),
        formula('Margen de fase = 180° + ∠G(jω_c)        Margen de ganancia = 1 / |G(jω_π)|', 'ω_c es la frecuencia de cruce de ganancia; ω_π la de cruce de fase.'),
        tabla(['Magnitud', 'Valor deseable', 'Si es bajo'], [
          ['Margen de fase', '30°–60°', 'Overshoot y oscilaciones'],
          ['Margen de ganancia', '> 6 dB', 'Cerca de la inestabilidad'],
          ['Ancho de banda', 'Alto pero limitado', 'Respuesta lenta o ruido amplificado']
        ]),
        codigo('python', `import numpy as np
from scipy import signal

s1 = signal.TransferFunction([1], [0.4, 1])
Kp = 3.0
lazo = signal.feedback(s1*Kp, 1)
w, mag, fase = signal.bode(lazo, np.logspace(-2, 3, 400))
wc = w[np.argmin(np.abs(mag))]        # frecuencia de cruce (mag en dB)
gm, pm, wg, wp = signal.margin(lazo)
print(f"margen de fase = {pm:.1f}°, margen de ganancia = {20*np.log10(gm):.1f} dB")`, 'Márgenes de estabilidad con SciPy.'),
        apunte('El compromiso fundamental', 'Subir la ganancia aumenta el ancho de banda (respuesta más rápida) pero reduce el margen de fase y amplifica el ruido del sensor en altas frecuencias. Por eso los controladores reales incluyen un filtro paso bajo o un notch para resonancias mecánicas.'),
        aviso('Un brazo con flexibilidad tiene un modo Resonante: un pico en magnitud y una caída brusca de fase. Si el ancho de banda del lazo lo cruza, aparece un temblor que ningún aumento de Kp arreglará. Usa un filtro notch en esa frecuencia.')
      ],
      errors: [err('El robot tiembla a una frecuencia fija al moverse rápido', 'El lazo excita una resonancia mecánica', 'Mide el pico con un Bode y añade un filtro notch o baja el ancho de banda.')],
      practice: { task: 'Mide la respuesta en frecuencia de tu motor barriendo frecuencias, dibuja el Bode y calcula márgenes.', success: ['Obtienes Bode experimental', 'Calculas márgenes', 'Relacionas con overshoot'] },
      quiz: [q('¿Qué indica un margen de fase pequeño (por ejemplo 10°)?', ['Que el sistema es muy rápido', 'Que está cerca de oscilar: poco margen antes de perder estabilidad', 'Que el sensor está roto', 'Que la ganancia es baja'], 1, 'Poco margen de fase implica poco amortiguamiento y mucho overshoot.')]
    })
  ]),

  // -------------------- BLOQUE 9: VISIÓN Y PERCEPCIÓN 3D --------------------
  M('b9', 'Visión por computador y percepción 3D', 'De la imagen en píxeles a la nube de puntos y al mapa del entorno', [
    L({
      id: 'r9-1', title: 'Fundamentos de imagen', min: 14, level: 'inicial',
      objectives: ['Entender qué es una imagen digital y sus canales', 'Cargar y visualizar imágenes con OpenCV'],
      blocks: [
        p('Una imagen digital es una rejilla de píxeles. Cada píxel guarda un número (o tres, si es a color) que representa intensidad luminosa. En color, lo habitual es RGB —rojo, verde, azul— aunque OpenCV lee por defecto en BGR.'),
        tabla(['Concepto', 'Significado', 'Valor típico'], [
          ['Resolución', 'Ancho × alto en píxeles', '640×480, 1280×720'],
          ['Canales', 'Componentes de color', '1 (gris), 3 (BGR), 4 (BGRA)'],
          ['Profundidad', 'Bits por canal', '8 bits → 0…255'],
          ['FOV', 'Campo de visión de la cámara', '60°–90° horizontal']
        ]),
        codigo('python', `import cv2
import numpy as np

img = cv2.imread("escena.png")            # BGR
print(img.shape)                          # (alto, ancho, canales)
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
print("pixel (10,20) en gris:", gray[10, 20])`, 'Cargar, convertir y muestrear una imagen.'),
        formula('frecuencia de muestreo espacial ≈ resolución / FOV', 'Más píxeles por grado → mejor precisión al localizar un objeto.'),
        apunte('Coordenadas', 'En OpenCV el origen (0,0) está arriba a la izquierda: x crece a la derecha, y crece hacia abajo. Es al revés que en muchos sistemas de coordenadas robotizados; tenlo en cuenta al pasar de píxel a metro.'),
        nota('El tipo de datos importa: uint8 va de 0 a 255 y se desborda al restar. Convierte a float32 antes de operar si vas a restar imágenes.')
      ],
      errors: [err('Los colores se ven raros (rojo y azul intercambiados)', 'OpenCV usa BGR y tu librería espera RGB', 'Convierte con cv2.COLOR_BGR2RGB antes de mostrar con matplotlib.')],
      practice: { task: 'Carga una imagen, imprime su forma y extrae el valor de un píxel en BGR y en gris.', success: ['Sabes leer shape', 'Conviertes correctamente', 'Entiendes el orden de canales'] },
      quiz: [q('¿En qué orden guarda OpenCV los canales de color por defecto?', ['RGB', 'BGR', 'HSV', 'YUV'], 1, 'cv2.imread devuelve BGR; hay que convertir a RGB para matplotlib.')]
    }),
    L({
      id: 'r9-2', title: 'Filtrado y umbrales', min: 16, level: 'inicial',
      objectives: ['Aplicar umbrales y filtros simples', 'Elegir entre umbral fijo y adaptativo'],
      blocks: [
        p('El umbrado (thresholding) convierte una imagen en blanco y negro: todo lo que supera un valor se pone a 255 y el resto a 0. Es la forma más barata de separar un objeto del fondo cuando hay contraste.'),
        codigo('python', `import cv2

gray = cv2.imread("escena.png", cv2.IMREAD_GRAYSCALE)
_, bw = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)
adapt = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                              cv2.THRESH_BINARY, 11, 2)
blur = cv2.GaussianBlur(gray, (5, 5), 0)
otsu, th = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
print("umbral elegido por Otsu:", otsu)`, 'Umbral fijo, adaptativo y método de Otsu.'),
        tabla(['Método', 'Cuándo usarlo', 'Problema'], [
          ['Fijo', 'Iluminación controlada', 'Falla si cambia la luz'],
          ['Otsu', 'Dos clases bien separadas', 'Histograma bimodal'],
          ['Adaptativo', 'Iluminación desigual', 'Más costoso, ruido local']
        ]),
        formula('media móvil / Gaussiano: suaviza el ruido antes de umbralar', 'Un pequeño blur previo evita que el ruido se convierta en miles de puntos blancos.'),
        apunte('Operaciones morfológicas', 'Después de umbralar, erosión y dilatación limpian la máscara: la apertura quita puntos sueltos y el cierre rellena agujeros. cv2.morphologyEx con MORPH_OPEN y MORPH_CLOSE es el combo habitual.'),
        aviso('Un umbral fijo calibrado en el laboratorio suele fallar en cuanto cambias de sala o se enciende una luz. Prefiere Otsu o adaptativo si no controlas la iluminación.')
      ],
      errors: [err('La máscara sale llena de puntos blancos', 'Ruido amplificado por el umbral', 'Aplica GaussianBlur 5×5 antes de threshold y una apertura morfológica después.')],
      practice: { task: 'Umbrala una imagen con luz desigual usando Otsu y adaptativo; compara las dos máscaras.', success: ['Ambas máscaras se generan', 'Explicas la diferencia', 'Limpias con morfología'] },
      quiz: [q('¿Qué ventaja tiene el umbral adaptativo sobre el fijo?', ['Es más rápido', 'Se ajusta a cambios locales de iluminación', 'No necesita imagen', 'Siempre da menos ruido'], 1, 'Calcula el umbral por región, por eso tolera sombras y gradientes de luz.')]
    }),
    L({
      id: 'r9-3', title: 'Convolución', min: 16, level: 'intermedio',
      objectives: ['Entender el barrido de un kernel por la imagen', 'Implementar filtros convolucionales'],
      blocks: [
        p('La convolución desliza una pequeña matriz —el kernel— sobre la imagen. En cada posición multiplica elemento a elemento y suma. Según los números del kernel, el resultado resalta bordes, suaviza o detecta texturas.'),
        diagrama('convolucion', 'Imagen → kernel 3×3 → barrido → mapa de características.'),
        formula('I′(x,y) = Σ K(i,j) · I(x+i, y+j)', 'El kernel se aplica sobre una vecindad local; el resultado es un píxel nuevo.'),
        tabla(['Kernel', 'Efecto', 'Uso'], [
          ['Gaussiano / media', 'Suaviza', 'Reducir ruido'],
          ['Sobel', 'Gradiente direccional', 'Bordes horizontales/verticales'],
          ['Laplaciano', 'Segunda derivada', 'Bordes en todas direcciones'],
          ['Sharpen', 'Realce', 'Enfocar detalles']
        ]),
        codigo('python', `import numpy as np
import cv2

img = cv2.imread("escena.png", cv2.IMREAD_GRAYSCALE).astype(np.float32)
sobel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float32)
gx = cv2.filter2D(img, -1, sobel_x)
gy = cv2.filter2D(img, -1, sobel_x.T)
mag = np.sqrt(gx**2 + gy**2)
mag = (255 * mag / mag.max()).astype(np.uint8)`, 'Convolución con Sobel y magnitud de gradiente.'),
        apunte('Padding y stride', 'Al barrer, qué haces con los bordes de la imagen (padding: cero, réplica, reflejo) y de cuántos píxeles saltas (stride) cambia el tamaño de salida. En CNN se usa padding "same" para conservar resolución.'),
        nota('Una CNN no es más que muchas capas de convolución aprendidas: los kernels no los escribes a mano, los aprende el gradiente descendente.')
      ],
      errors: [err('La salida tiene bordes negros o artefactos', 'Padding incorrecto o kernel sin normalizar', 'Usa borderType=cv2.BORDER_REFLECT y normaliza kernels de suavizado.')],
      practice: { task: 'Aplica un kernel de sharpen y uno de Sobel a la misma imagen; muestra los tres resultados.', success: ['Entiendes cada kernel', 'La salida tiene el tamaño esperado', 'Explicas el padding'] },
      quiz: [q('¿Qué hace un kernel Gaussiano 3×3?', ['Detecta bordes', 'Suaviza la imagen reduciendo ruido', 'Cambia el color', 'Aumenta la resolución'], 1, 'Es un promedio ponderado: atenúa las variaciones de alta frecuencia.')]
    }),
    L({
      id: 'r9-4', title: 'Detección de bordes y features', min: 18, level: 'intermedio',
      objectives: ['Detectar bordes robustos con Canny', 'Encontrar y emparejar puntos característicos'],
      blocks: [
        p('Los bordes son cambios bruscos de intensidad; las features (esquinas, puntos de textura) son lugares que puedes reconocer de un frame a otro. Ambas cosas son la base de la visión geométrica: sin ellas, el robot no sabe qué punto de la imagen corresponde a qué punto del mundo.'),
        codigo('python', `import cv2

gray = cv2.imread("escena.png", cv2.IMREAD_GRAYSCALE)
blur = cv2.GaussianBlur(gray, (5,5), 1.2)
edges = cv2.Canny(blur, 50, 150)

orb = cv2.ORB_create(nfeatures=1000)
kp, des = orb.detectAndCompute(gray, None)
print("features:", len(kp))
vis = cv2.drawKeypoints(gray, kp, None, color=(0,255,0))`, 'Canny para bordes y ORB para features.'),
        tabla(['Detector', 'Tipo', 'Ventaja'], [
          ['Canny', 'Bordes', 'Bueno y rápido, con histéresis'],
          ['SIFT', 'Features', 'Invariante a escala y rotación (patentado)'],
          ['ORB', 'Features', 'Rápido, libre, ideal para SLAM en CPU'],
          ['FAST + BRIEF', 'Features', 'Muy rápido']
        ]),
        apunte('Canny en dos umbrales', 'Canny usa un umbral alto y otro bajo: los píxeles por encima del alto son bordes seguros, los del intervalo se conservan solo si conectan con uno seguro (histéresis). Por eso da líneas continuas y no puntos aislados.'),
        lista(['Para emparejar features entre imágenes usa BFMatcher con Hamming si son binarios (ORB).', 'Filtra los emparejamientos con el test de ratio de Lowe (0.7–0.75).', 'Descarta outliers con RANSAC estimando la homografía o la matriz fundamental.'], true),
        aviso('Una escena con paredes lisas y poca textura tiene pocas features: el SLAM visual se pierde. Añade luz rasante o usa un patrón artificial si controlas el entorno.')
      ],
      errors: [err('Los emparejamientos incluyen muchos puntos incorrectos', 'No filtras con test de ratio ni RANSAC', 'Aplica ratio test y estima homografía con cv2.findHomography(..., cv2.RANSAC).')],
      practice: { task: 'Detecta ORB en dos fotos de la misma escena con ángulos distintos y cuenta cuántos emparejamientos sobreviven al ratio test.', success: ['Detectas features', 'Emparejas correctamente', 'Filtras outliers'] },
      quiz: [q('¿Qué hace el test de ratio de Lowe?', ['Aumenta el número de features', 'Descarta emparejamientos ambiguos comparando los dos vecinos más cercanos', 'Suaviza la imagen', 'Calcula la profundidad'], 1, 'Un buen match debe ser mucho mejor que el segundo mejor candidato.')]
    }),
    L({
      id: 'r9-5', title: 'Calibración de cámara', min: 18, level: 'intermedio',
      objectives: ['Obtener parámetros intrínsecos y de distorsión', 'Corregir imágenes y saber si la calibración es buena'],
      blocks: [
        p('La calibración traduce píxeles a rayos en el mundo. Necesitas los parámetros intrínsecos (distancia focal y centro óptico) y los coeficientes de distorsión (el ojo de pez que curva las líneas rectas). Sin esto, cualquier medida métrica será incorrecta.'),
        diagrama('camara', 'Capturar el tablero → detectar esquinas → intrínsecos → reproyección.'),
        formula('u = fx·X/Z + cx        v = fy·Y/Z + cy', 'Modelo pinhole: un punto 3D (X,Y,Z) se proyecta en el píxel (u,v).'),
        pasos([
          { title: '1. Captura', text: '20–30 fotos de un tablero de ajedrez en distintas orientaciones y distancias.' },
          { title: '2. Detecta esquinas', text: 'cv2.findChessboardCorners y refine con cornerSubPix.' },
          { title: '3. Calibra', text: 'cv2.calibrateCamera devuelve K, dist, vectores de rotación y traslación.' },
          { title: '4. Valida', text: 'Reproyecta los puntos: un error RMS menor de 1 píxel es bueno.' }
        ]),
        codigo('python', `import cv2, numpy as np

criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)
objp = np.zeros((7*6, 3), np.float32)
objp[:,:2] = np.mgrid[0:7, 0:6].T.reshape(-1, 2)
objpoints, imgpoints = [], []

for fname in sorted(__import__("glob").glob("cal_*.png")):
    img = cv2.imread(fname)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ok, corners = cv2.findChessboardCorners(gray, (7,6), None)
    if ok:
        objpoints.append(objp)
        imgpoints.append(cv2.cornerSubPix(gray, corners, (11,11), (-1,-1), criteria))

ret, K, dist, rvecs, tvecs = cv2.calibrateCamera(
    objpoints, imgpoints, gray.shape[::-1], None, None)
print("RMS reproyección:", ret, " K:", K)`, 'Calibración con tablero de ajedrez.'),
        apunte('Distorsión', 'Los coeficientes k1,k2,k3 (radial) y p1,p2 (tangencial) corrigen el curveado. Usa cv2.undistort o inicializa el mapa una sola vez con initUndistortRectifyMap para no repetir cálculos en cada frame.'),
        nota('La calibración envejece: si golpeas la cámara o cambias el objetivo, repítela. Guarda K y dist en YAML junto al código.')
      ],
      errors: [err('El error de reproyección es de varios píxeles', 'Fotos borrosas o tablero mal detectado', 'Descarta fotos movidas, aumenta el número de vistas y usa cornerSubPix.')],
      practice: { task: 'Calibra tu cámara, guarda K y dist en YAML y corrige una imagen comprobando que las líneas rectas siguen rectas.', success: ['RMS < 1 px', 'Imagen corregida', 'Parámetros guardados'] },
      quiz: [q('¿Qué parámetros devuelve calibrateCamera?', ['Solo la resolución', 'K y coeficientes de distorsión entre otros', 'La exposición', 'El número de píxeles'], 1, 'Devuelve matriz intrínseca K, distorsión y las poses de cada captura.')]
    }),
    L({
      id: 'r9-6', title: 'Visión estereo', min: 18, level: 'intermedio',
      objectives: ['Calcular profundidad por disparidad', 'Entender el impacto de la línea base y la calibración'],
      blocks: [
        p('Con dos cámaras separadas una distancia conocida, el mismo punto del mundo aparece desplazado en ambas imágenes. Ese desplazamiento —la disparidad— es inversamente proporcional a la profundidad. Es el mismo principio que tus ojos.'),
        formula('Z = f · b / d        d = u_izq − u_der', 'f: distancia focal; b: línea base; d: disparidad en píxeles.'),
        pasos([
          { title: '1. Calibrar', text: 'Calibra cada cámara y luego calcula la matriz esencial (estereo calibrado).' },
          { title: '2. Rectificar', text: 'Alinea las imágenes para que las líneas epipolares sean horizontales.' },
          { title: '3. Emparejar', text: 'Busca, para cada píxel de la izquierda, su mejor coincidencia en la derecha.' },
          { title: '4. Convertir', text: 'Con Q o la fórmula Z=f·b/d obtienes un mapa de profundidad.' }
        ]),
        codigo('python', `import cv2, numpy as np

left  = cv2.imread("left.png", cv2.IMREAD_GRAYSCALE)
right = cv2.imread("right.png", cv2.IMREAD_GRAYSCALE)
stereo = cv2.StereoBM_create(numDisparities=64, blockSize=15)
disp = stereo.compute(left, right).astype(np.float32) / 16.0

f, b = 525.0, 0.12          # fx en píxeles, línea base en metros
with np.errstate(divide="ignore", invalid="ignore"):
    depth = f * b / disp
depth[depth <= 0] = np.nan
print("profundidad en el centro:", depth[240, 320])`, 'Disparidad y mapa de profundidad con OpenCV.'),
        tabla(['Parámetro', 'Más grande', 'Efecto'], [
          ['Línea base b', 'Mejor precisión lejana', 'Menos rango cercano (zona ciega)'],
          ['Distancia focal f', 'Más detalle', 'Menor campo de visión'],
          ['Block size', 'Menos ruido', 'Bordes más gruesos']
        ]),
        apunte('Error en profundidad', 'δZ ≈ (Z²/(f·b))·δd. El error crece con el cuadrado de la distancia: duplicar la distancia cuadruplica el error. Por eso el estereo es bueno para 0.5–5 m y malo para medir a 30 m.'),
        aviso('Las zonas sin textura (una pared blanca) producen disparidad ruidosa. Los sensores de profundidad activos (ToF, structured light) funcionan mejor ahí.')
      ],
      errors: [err('El mapa de profundidad sale todo negro', 'Imágenes no rectificadas o disparidad negativa', 'Rectifica primero con stereoRectify y descarta disparidades <= 0.')],
      practice: { task: 'Calcula la profundidad de un objeto a 2 m con f=525 y b=0.12: ¿cuál es su disparidad? Verifícala en tu par estereo.', success: ['d = 31.5 px', 'Entiendes el error cuadrático', 'Rectificas antes de emparejar'] },
      quiz: [q('Si duplicas la línea base, ¿qué ocurre con la profundidad calculada para una misma disparidad?', ['Se duplica', 'Se reduce a la mitad', 'No cambia', 'Se cuadricula'], 0, 'Z = f·b/d es proporcional a b.')]
    }),
    L({
      id: 'r9-7', title: 'Nubes de puntos', min: 16, level: 'intermedio',
      objectives: ['Representar y filtrar datos 3D', 'Entender formatos y estructuras habituales'],
      blocks: [
        p('Una nube de puntos es una colección de tripletos (x, y, z), a veces con color o intensidad añadidos. Es la salida natural de un lidar, de un sensor ToF o de la triangulación estereo.'),
        diagrama('nube', 'Voxel grid → normales → segmentación → ICP.'),
        tabla(['Formato', 'Característica', 'Uso'], [
          ['PCD', 'Nativo de PCL', 'Investigación y ROS'],
          ['PLY', 'Con colores y caras', 'Intercambio y visualización'],
          ['LAS/LAZ', 'Geoespacial', 'Mapas grandes, drones'],
          ['sensor_msgs/PointCloud2', 'ROS 2', 'Datos en tiempo real']
        ]),
        codigo('python', `import numpy as np
import open3d as o3d

pcd = o3d.io.read_point_cloud("escena.ply")
print("puntos:", len(pcd.points))

# reducir densidad con voxel grid
down = pcd.voxel_down_sample(voxel_size=0.02)
down.estimate_normals(search_param=o3d.geometry.KDTreeSearchParamKNN(knn=20))

# segmentar el suelo por altura
pts = np.asarray(down.points)
suelo = down.select_by_index(np.where(pts[:,2] < 0.05)[0])
objetos = down.select_by_index(np.where(pts[:,2] >= 0.05)[0])
o3d.visualization.draw_geometries([objetos])`, 'Filtrado, normales y segmentación por altura con Open3D.'),
        apunte('Voxel grid', 'Divide el espacio en celdas cúbicas y conserva un representante por celda. Con voxel_size=0.02 (2 cm) reduces millones de puntos a decenas de miles sin perder la forma general.'),
        nota('Los normales son necesarios para casi todo lo demás: estimación de planos, segmentación, ICP punto-plano y renderizado. Se calculan con PCA sobre los vecinos más cercanos.')
      ],
      errors: [err('La nube tiene millones de puntos y todo va lento', 'No hay reducción de densidad', 'Aplica voxel_down_sample antes de estimar normales o registrar.')],
      practice: { task: 'Carga una nube, aplica voxel de 2 cm, estima normales y separa suelo de objetos. Cuenta los puntos de cada grupo.', success: ['Reduces densidad', 'Tienes normales', 'Segmentas correctamente'] },
      quiz: [q('¿Qué hace un filtro voxel grid?', ['Aumenta el número de puntos', 'Reduce la densidad conservando un punto por celda', 'Cambia los colores', 'Rota la nube'], 1, 'Es una forma rápida y uniforme de diezmar una nube.')]
    }),
    L({
      id: 'r9-8', title: 'ICP y registro de nubes', min: 18, level: 'avanzado',
      objectives: ['Alinear dos nubes de puntos', 'Evitar mínimos locales en el registro'],
      blocks: [
        p('El registro alinea dos nubes que representan la misma escena desde posiciones distintas. ICP (Iterative Closest Point) itera: empareja cada punto con su vecino más cercano, calcula la transformación rígida que minimiza el error y repite hasta converger.'),
        formula('min_{R,t} Σ || p_i − (R·q_i + t) ||²', 'R: rotación, t: traslación; se resuelve con SVD en cada iteración.'),
        pasos([
          { title: '1. Preprocesar', text: 'Filtra suelo y reduce densidad para que el ICP sea rápido.' },
          { title: '2. Inicializar', text: 'Dale una estimación inicial con odometría o un detector de features 3D.' },
          { title: '3. Iterar', text: 'Empareja vecinos, estima R,t con SVD, aplica y repite.' },
          { title: '4. Validar', text: 'Comprueba el error final (Fitness en Open3D) y que la transformación sea plausible.' }
        ]),
        codigo('python', `import numpy as np
import open3d as o3d

src = o3d.io.read_point_cloud("scan_a.ply").voxel_down_sample(0.03)
dst = o3d.io.read_point_cloud("scan_b.ply").voxel_down_sample(0.03)
src.estimate_normals(); dst.estimate_normals()

# punto-plano suele converger mejor que punto-punto
res = o3d.pipelines.registration.registration_icp(
    src, dst, max_correspondence_distance=0.10,
    init=np.eye(4),
    estimation_method=o3d.pipelines.registration.TransformationEstimationPointToPlane())
print("fitness:", res.fitness, " RMSE:", res.inlier_rmse)
print("T:", res.transformation)`, 'ICP punto-plano con Open3D.'),
        apunte('Punto a plano', 'Si tienes normales, minimizar la distancia al plano tangente converge más rápido y tolera mejor muestreos distintos que el ICP punto a punto clásico.'),
        aviso('ICP es local: si las dos nubes empiezan muy lejos, se queda en un mínimo falso. Necesitas una buena inicialización (odometría, GPS, marcadores) o un registro global tipo FPFH + RANSAC antes del ICP.')
      ],
      errors: [err('El ICP acaba con un fitness de 0.3 y una rotación absurda', 'Mala inicialización o correspondencias demasiado lejanas', 'Usa un registro global previo y reduce max_correspondence_distance.')],
      practice: { task: 'Registra dos escaneos con ICP punto-plano y comprueba que un objeto conocido queda alineado. Prueba con y sin inicialización.', success: ['Fitness alto', 'Alineación visual correcta', 'Explicas el mínimo local'] },
      quiz: [q('¿Cuál es la principal limitación del ICP?', ['No funciona con colores', 'Es un método local que necesita una buena inicialización', 'Solo funciona en 2D', 'Requiere una cámara RGB'], 1, 'Sin una semilla razonable, converge a una solución incorrecta.')]
    }),
    L({
      id: 'r9-9', title: 'Detección de objetos con YOLO', min: 18, level: 'intermedio',
      objectives: ['Entender la arquitectura de un detector de una etapa', 'Ejecutar YOLO y filtrar detecciones'],
      blocks: [
        p('Un detector de objetos responde a dos preguntas a la vez: qué hay y dónde está. YOLO (You Only Look Once) lo hace en una sola pasada por la red: divide la imagen en una rejilla y predice cajas, confianza y clases directamente.'),
        diagrama('yolo', 'Imagen → backbone CNN → head (cajas + clases) → NMS.'),
        codigo('python', `from ultralytics import YOLO
import cv2

model = YOLO("yolo11n.pt")
results = model("escena.png", conf=0.5, iou=0.45)
for r in results:
    for box in r.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cls = model.names[int(box.cls[0])]
        print(f"{cls}: {box.conf[0]:.2f} en ({x1},{y1})-({x2},{y2})")
    r.save("detecciones.png")`, 'Inferencia con Ultralytics YOLO.'),
        tabla(['Métrica', 'Qué mide', 'Comentario'], [
          ['IoU', 'Solapamiento caja predicha / real', 'Umbral típico 0.5'],
          ['Precision', 'De lo detectado, cuánto era correcto', 'Sube con conf alta'],
          ['Recall', 'De lo real, cuánto detectamos', 'Baja con conf alta'],
          ['mAP', 'Área bajo curva precision-recall', 'Métrica principal']
        ]),
        apunte('NMS', 'La red suele producir varias cajas para el mismo objeto. Non-Maximum Suppression conserva la de mayor confianza y elimina las que se solapan más de cierto IoU. El parámetro iou controla qué tan agresiva es la supresión.'),
        nota('Modelos n (nano) y s (small) corren en Jetson Orin a 30–60 FPS; los x grandes necesitan GPU de escritorio. Empieza por el más pequeño que cumpla tu recall.')
      ],
      errors: [err('Hay muchas cajas duplicadas sobre el mismo objeto', 'NMS con IoU demasiado alto o confianza baja', 'Baja iou a 0.45 y sube conf a 0.5.')],
      practice: { task: 'Ejecuta YOLO en un vídeo de tu cámara, mide FPS y cuenta cuántos objetos detecta por clase durante 10 segundos.', success: ['Mides FPS reales', 'Filtras con conf e IoU', 'Sabes qué clase falla'] },
      quiz: [q('¿Qué hace NMS en un detector?', ['Aumenta la resolución', 'Elimina cajas duplicadas que se solapan mucho', 'Entrena la red', 'Cambia las clases'], 1, 'Conserva la mejor caja por objeto y suprime el resto.')]
    }),
    L({
      id: 'r9-10', title: 'Segmentación', min: 16, level: 'intermedio',
      objectives: ['Diferenciar segmentación semántica e de instancias', 'Aplicar máscaras para manipulación'],
      blocks: [
        p('Mientras la detección da cajas, la segmentación da una máscara píxel a píxel. Es útil cuando necesitas la forma exacta del objeto: calcular su centro de masa, su contorno o los píxeles que pertenecen a una pieza antes de agarrarla.'),
        tabla(['Tipo', 'Qué hace', 'Ejemplo'], [
          ['Semántica', 'Clase por píxel', 'Todo lo que es "suelo" del mismo color'],
          ['De instancias', 'Una máscara por objeto', 'Tres tazas → tres máscaras distintas'],
          ['Panóptica', 'Ambas a la vez', 'Escena completa etiquetada']
        ]),
        codigo('python', `import cv2, numpy as np

gray = cv2.imread("piezas.png", cv2.IMREAD_GRAYSCALE)
_, bw = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
kernel = np.ones((3,3), np.uint8)
bw = cv2.morphologyEx(bw, cv2.MORPH_OPEN, kernel)

n, labels, stats, cents = cv2.connectedComponentsWithStats(bw)
for i in range(1, n):
    area = stats[i, cv2.CC_STAT_AREA]
    if area > 200:
        cx, cy = cents[i]
        print(f"objeto {i}: area={area}, centro=({cx:.1f},{cy:.1f})")`, 'Segmentación clásica por componentes conectadas.'),
        apunte('De píxel a metro', 'Con la cámara calibrada puedes llevar la máscara a 3D: toma los píxeles del objeto, back-proyecta rayos con K⁻¹ y usa la profundidad (estereo o ToF). Así obtienes el centro real para el brazo.'),
        nota('Segment Anything (SAM) permite segmentar con prompts (un punto o una caja) sin reentrenar. Es muy útil para crear datasets de manipulación rápidamente.'),
        aviso('Las máscaras delicadas fallan con reflejos y sombras. Si el objeto es metálico y brillante, cambia el ángulo de la luz antes de culpar al modelo.')
      ],
      errors: [err('Una pieza aparece partida en dos componentes', 'Umbral o ruido que rompe la conectividad', 'Aplica un cierre morfológico con un kernel algo mayor.')],
      practice: { task: 'Segmenta las piezas de una imagen y publica el centro de cada una como un punto 3D usando tu calibración.', success: ['Máscaras limpias', 'Centros correctos', 'Coinciden con la pinza'] },
      quiz: [q('¿Qué diferencia segmentación de instancias de la semántica?', ['La semántica es más rápida', 'La de instancias separa objetos distintos de la misma clase', 'La semántica da cajas', 'No hay diferencia'], 1, 'La segmentación de instancias distingue cada objeto individual.')]
    }),
    L({
      id: 'r9-11', title: 'SLAM visual', min: 20, level: 'avanzado',
      objectives: ['Entender el bucle de localización y mapeo con cámara', 'Distinguir VO, VIO y SLAM visual'],
      blocks: [
        p('SLAM visual construye un mapa del entorno mientras estima dónde está el robot dentro de él. No hay GPS en interiores: la única información son las features que la cámara ve pasar de un frame a otro.'),
        diagrama('slam_visual', 'Features → match → geometría epipolar/PnP → bundle adjustment.'),
        pasos([
          { title: '1. Extraer features', text: 'ORB o SIFT por frame, con descriptores para emparejar.' },
          { title: '2. Emparejar y estimar', text: 'Con la matriz fundamental/esencial recuperas la pose relativa (R,t).' },
          { title: '3. Triangulación', text: 'De dos vistas consecutivas obtienes puntos 3D (landmarks).' },
          { title: '4. Optimizar', text: 'Bundle adjustment minimiza el error de reproyección de todas las poses y puntos.' },
          { title: '5. Loop closure', text: 'Al reconocer un lugar ya visitado, corriges la deriva acumulada.' }
        ]),
        tabla(['Variante', 'Sensores', 'Característica'], [
          ['VO', 'Cámara', 'Solo odometría local, deriva'],
          ['VIO', 'Cámara + IMU', 'Escala métrica y robustness a movimientos rápidos'],
          ['SLAM visual', 'Cámara (+ IMU)', 'Con loop closure y mapa global']
        ]),
        codigo('python', `import cv2, numpy as np

orb = cv2.ORB_create(2000)
bf = cv2.BFMatcher(cv2.NORM_HAMMING)
K = np.loadtxt("K.txt")

prev = cv2.imread("f0.png", cv2.IMREAD_GRAYSCALE)
kp1, d1 = orb.detectAndCompute(prev, None)
for name in ["f1.png", "f2.png", "f3.png"]:
    cur = cv2.imread(name, cv2.IMREAD_GRAYSCALE)
    kp2, d2 = orb.detectAndCompute(cur, None)
    matches = sorted(bf.knnMatch(d1, d2, k=2), key=lambda m: m[0].distance)
    good = [m for m,n in matches if m.distance < 0.75*n.distance]
    if len(good) >= 8:
        p1 = np.float32([kp1[m.queryIdx].pt for m in good])
        p2 = np.float32([kp2[m.trainIdx].pt for m in good])
        E, mask = cv2.findEssentialMat(p1, p2, K, cv2.RANSAC, 0.999, 1.0)
        _, R, t, _ = cv2.recoverPose(E, p1, p2, K)
        print(name, "inliers:", int(mask.sum()), "t:", t.ravel())
    prev, kp1, d1 = cur, kp2, d2`, 'Odometría visual esencial con ORB + RANSAC.'),
        apunte('Escala', 'Una cámara monocular no conoce la escala absoluta: no distingue un robot pequeño cerca de uno grande lejos. La IMU (VIO), el estereo o una medida conocida resuelven la ambigüedad.'),
        aviso('El motion blur y las exposiciones automáticas son enemigos del SLAM visual. Fija la exposición y el balance de blancos del sensor, y usa una cámara con buena velocidad de obturación.')
      ],
      errors: [err('La trayectoria estimada deriva mucho y el mapa se deforma', 'No hay loop closure o la IMU no está calibrada', 'Añade reconocimiento de lugares (BoW) y calibra biases de la IMU.')],
      practice: { task: 'Graba una secuencia caminando en círculo, ejecuta tu odometría visual y comprueba si el final coincide con el inicio.', success: ['La trayectoria es cerrada', 'Entiendes la deriva', 'Sabes qué es loop closure'] },
      quiz: [q('¿Qué problema resuelve el loop closure en SLAM?', ['El ruido del sensor', 'La deriva acumulada al reconocer un lugar ya visitado', 'La falta de textura', 'La calibración de K'], 1, 'Cierra el ciclo y redistribuye el error por todo el mapa.')]
    }),
    L({
      id: 'r9-12', title: 'Fallos típicos de iluminación', min: 14, level: 'intermedio',
      objectives: ['Diagnosticar fallos visuales causados por la luz', 'Diseñar una estrategia de iluminación robusta'],
      blocks: [
        p('La mayoría de los fallos de visión en robots no son del modelo: son de la luz. Un detector que funciona en el laboratorio puede fallar por completo junto a una ventana. Saber diagnosticarlo ahorra semanas de reentrenamiento inútil.'),
        tabla(['Síntoma', 'Causa', 'Solución'], [
          ['Sobreexposición', 'Luz directa o gamma alto', 'Baja exposición, usa HDR o filtro polarizado'],
          ['Sombras duras', 'Fuente puntual', 'Difusor o varias fuentes suaves'],
          ['Reflejos especulares', 'Superficie metálica', 'Cambia el ángulo de la cámara o luz rasante'],
          ['Parpadeo', 'Luces LED a 50/60 Hz', 'Ajusta el tiempo de exposición o usa luz DC'],
          ['Cambio de color', 'Temperatura de luz distinta', 'Balance de blancos fijo']
        ]),
        codigo('python', `import cv2, numpy as np

cap = cv2.VideoCapture(0)
# Fija exposición y balance de blancos para que no "bombeen"
cap.set(cv2.CAP_PROP_AUTO_EXPOSURE, 0.25)  # manual en muchas cámaras
cap.set(cv2.CAP_PROP_EXPOSURE, -4)
cap.set(cv2.CAP_PROP_WB_TEMPERATURE, 4500)

ok, frame = cap.read()
gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
hist = cv2.calcHist([gray], [0], None, [256], [0,256])
print("píxeles saturados:", int(hist[250:].sum()))`, 'Fijar exposición y medir píxeles quemados.'),
        apunte('Prueba del histograma', 'Un histograma amontonado en 255 significa sobreexposición; uno pegado en 0 significa sombra. Si más del 5% de los píxeles están saturados, los modelos entrenados con datos normales se degradan.'),
        lista(['Controla la luz antes de controlar el modelo: una caja con LED difusos resuelve más problemas que un dataset 10× mayor.', 'Entrena con aumentos de brillantez, contraste y tono (cv2.convertScaleAbs) para ganar robustez.', 'Registra la exposición usada en cada dataset para poder reproducirlo.']),
        aviso('La exposición automática cambia la apariencia entre frames y puede romper un tracker visual que supone fotometría constante. Fíjala siempre que puedas.')
      ],
      errors: [err('El detector funciona de día pero falla de noche', 'El modelo nunca vio ese rango de luminancia', 'Añade iluminación activa controlada o reentrena con aumentos de exposición y ruido.')],
      practice: { task: 'Toma 3 fotos del mismo objeto con luz distinta, calcula el histograma de cada una y observa cómo cambia tu umbral óptimo.', success: ['Ves el cambio de histograma', 'Identificas saturación', 'Ajustas iluminación o dataset'] },
      quiz: [q('¿Por qué puede fallar un tracker visual aunque la cámara esté bien calibrada?', ['Porque la exposición automática cambia la apariencia entre frames', 'Porque K está mal', 'Porque falta un filtro PID', 'Porque el sensor es RGB'], 0, 'Las variaciones fotométricas rompen las suposiciones de los métodos de tracking.')]
    })
  ]),

  // -------------------- BLOQUE 10: ROBOT LEARNING --------------------
  M('b10', 'Robot learning', 'De las demostraciones humanas a las políticas que controlan el robot', [
    L({
      id: 'r10-1', title: 'Por qué aprender en vez de programar', min: 14, level: 'inicial',
      objectives: ['Entender qué tareas se benefician del aprendizaje', 'Situación del learning frente al control clásico'],
      blocks: [
        p('Programar un robot funciona maravillosamente si puedes escribir la regla: "si el sensor dice X, mueve el motor Y". Pero hay tareas que sabemos hacer con las manos y no sabemos poner en ecuaciones: abrir un tarro con resbalón, doblar una camiseta, insertar un conector con tolerancias ajustadas.'),
        tabla(['Enfoque', 'Cuándo brilla', 'Límite'], [
          ['Control clásico', 'Tareas precisas y repetitivas con modelo claro', 'Difícil de especificar contacto y textura'],
          ['Imitation learning', 'Tareas que un humano demuestra fácil', 'Depende de la calidad de las demos'],
          ['Reinforcement learning', 'Tareas con recompensa medible y simulación', 'Sim-to-real y seguridad en el robot real']
        ]),
        apunte('Datos del mundo real', 'Un modelo de lenguaje se entrena con todo internet; un robot, no. Los datos de interacción física son caros y lentos de generar. Por eso la teleoperación y la simulación son el cuello de botella, no la arquitectura del modelo.'),
        p('En la práctica los sistemas modernos mezclan: un controlador clásico garantiza estabilidad en bajo nivel y una política aprendida decide la secuencia de acciones de alto nivel. Aprender no sustituye al control: se apoya en él.'),
        lista(['La política es una función π(o) → a: observaciones (imágenes, estado) a acciones (posición o par de cada servo).', 'El objetivo es generalizar: hacer la tarea con objetos, luces y posiciones que no exactamente se vieron en el entrenamiento.', 'Evalúa siempre en el robot real: una tasa de éxito en simulación no significa nada por sí sola.']),
        nota('El aprendizaje no hace magia: si tu brazo tiene 5 grados de libertad y el objeto se mueve 3 cm, la política tiene que haber visto esa variabilidad o no sabrá reaccionar.')
      ],
      errors: [err('La política funciona en el setup de entrenamiento pero falla al mover la mesa', 'Falta de diversidad en las demostraciones', 'Graba datos con posiciones, luces y objetos variados; usa domain randomization.')],
      practice: { task: 'Elige una tarea de tu entorno y escribe por qué sería difícil programarla con reglas y qué demostración la resolvería.', success: ['Identificas contacto o variabilidad', 'Propones una demo', 'Nombras la métrica de éxito'] },
      quiz: [q('¿Cuál es el principal cuello de botella del robot learning hoy?', ['La falta de GPUs', 'La escasez de datos físicos de interacción', 'La falta de librerías', 'El coste de los servos'], 1, 'Los datos reales son lentos y caros de generar; es el cuello de botella.')]
    }),
    L({
      id: 'r10-2', title: 'Imitation learning y behavioral cloning', min: 18, level: 'intermedio',
      objectives: ['Formular el aprendizaje por demostración', 'Entender el covariate shift'],
      blocks: [
        p('Imitation learning aprende una política copiando a un experto. La forma más simple es behavioral cloning (BC): tratar cada par (observación, acción) de las demostraciones como un ejemplo de entrenamiento supervisado y minimizar la diferencia entre la acción predicha y la del experto.'),
        diagrama('imitation', 'Demostraciones → dataset (obs, acción) → política → despliegue.'),
        formula('L(θ) = E_{(o,a)~D} [ || π_θ(o) − a ||² ]', 'Regresión supervisada: la política aprende a imitar la acción del experto.'),
        codigo('python', `import torch
import torch.nn as nn

class BCPolicy(nn.Module):
    def __init__(self, obs_dim, act_dim, hidden=256):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(obs_dim, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden), nn.ReLU(),
            nn.Linear(hidden, act_dim), nn.Tanh())

    def forward(self, obs):
        return self.net(obs)

obs = torch.randn(64, 14)          # 64 muestras, 14 variables de estado
act = torch.randn(64, 6)           # 6 articulaciones
model = BCPolicy(14, 6)
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
for _ in range(100):
    loss = nn.functional.mse_loss(model(obs), act)
    opt.zero_grad(); loss.backward(); opt.step()
print("loss final:", loss.item())`, 'Behavioral cloning mínimo en PyTorch.'),
        apunte('Covariate shift', 'El experto demuestra estados "buenos". Cuando la política comete un pequeño error, llega a estados que nunca vio en el dataset y no sabe cómo volver. El error se acumula y la trayectoria se desvía. Por eso BC puro suele necesitar muchas demos o correcciones (DAgger).'),
        tabla(['Método', 'Idea', 'Coste'], [
          ['BC', 'Supervisado sobre demos', 'Bajo'],
          ['DAgger', 'El experto corrige los estados visitados por la política', 'Alto: requiere experto online'],
          ['Offline RL', 'Aprende de demos con recompensa', 'Medio']
        ]),
        aviso('No normalices las acciones con la media del dataset y luego olvides desnormalizarlas al ejecutar: es el error más común al desplegar una política BC.')
      ],
      errors: [err('La política se desvía tras unos segundos y no vuelve', 'Covariate shift: el dataset no cubre los estados de recuperación', 'Añade demos con correcciones o usa DAgger / políticas con chunking como ACT.')],
      practice: { task: 'Entrena BC sobre un dataset de 10 episodios, evalúa 20 veces y mide la tasa de éxito. Repite con 50 episodios y compara.', success: ['Mides éxito real', 'Ves el efecto del covariate shift', 'Normalizas y desnormalizas bien'] },
      quiz: [q('¿Qué es el covariate shift en behavioral cloning?', ['Cambio de cámara', 'La política visita estados no vistos en el entrenamiento tras un error pequeño', 'Cambio de learning rate', 'Saturación del motor'], 1, 'La distribución de estados en despliegue difiere de la del dataset de demostraciones.')]
    }),
    L({
      id: 'r10-3', title: 'Teleoperación y datasets de demostración', min: 18, level: 'intermedio',
      objectives: ['Diseñar un setup de teleoperación', 'Grabar episodios limpios y reproducibles'],
      blocks: [
        p('Las demostraciones son el combustible. Un buen setup de teleoperación hace que el humano pueda realizar la tarea con naturalidad y que el robot repita exactamente lo que vio, sin saltos ni retardos raros.'),
        diagrama('so101', 'Leader que mueves con la mano, follower que repite, servos con bus y LeRobot grabando.'),
        tabla(['Modalidad', 'Ventaja', 'Inconveniente'], [
          ['Leader–follower', 'Mapeo 1:1 de articulaciones, muy preciso', 'Necesitas dos brazos'],
          ['VR / Joystick 6D', 'Control de pose cartesiana', 'Más difícil de sentir el contacto'],
          ['Kinesthetic teaching', 'Mueves el brazo directamente', 'Lento, solo funciona con brazos compatibles']
        ]),
        codigo('python', `from lerobot.common.robot_devices.robots import Robot
from lerobot.common.robot_devices.control_utils import record_episode

robot = Robot.from_config(
    robot_type="so101",
    leader_port="/dev/tty.usbmodem101",
    follower_port="/dev/tty.usbmodem102",
    cameras={"wrist": {"index": 0}, "top": {"index": 1}},
)
robot.connect()

for ep in range(20):
    record_episode(robot, episode_index=ep, fps=30,
                  repo_id="tu-usuario/tarro-verde")
robot.disconnect()`, 'Grabación de episodios con LeRobot (esquema general).'),
        pasos([
          { title: '1. Fija la escena', text: 'Misma cámara, misma altura y mismo fondo; cambia solo lo que quieres que varíe.' },
          { title: '2. Demuestra despacio', text: 'Movimientos suaves y deliberados; el robot aprende tu velocidad.' },
          { title: '3. Varía con intención', text: 'Cambia posición del objeto, luz y orientación entre episodios.' },
          { title: '4. Revisa el dataset', text: 'Descarta episodios con fallos o teleoperación entrecortada.' }
        ]),
        aviso('Un dataset de 20 demos perfectas pero idénticas generaliza peor que 50 demos con variación. La diversidad controlada importa más que la cantidad ciega.')
      ],
      errors: [err('Los episodios tienen saltos bruscos de posición', 'El leader y el follower no están sincronizados o hay latencia en el bus', 'Baja la frecuencia de grabación, revisa los cables y alinea las posiciones de inicio.')],
      practice: { task: 'Graba 15 episodios de una tarea, variando la posición del objeto, y revisa que los primeros y últimos frames sean coherentes.', success: ['Episodios reproducibles', 'Variedad intencional', 'Sin saltos ni frames corruptos'] },
      quiz: [q('¿Qué hace que un dataset de demostraciones sea útil?', ['Que todos los episodios sean idénticos', 'Que cubra la variación esperada en despliegue', 'Que tenga muchas horas', 'Que use solo una cámara'], 1, 'La cobertura de la distribución de tareas es más importante que el volumen ciego.')]
    }),
    L({
      id: 'r10-4', title: 'ACT: Action Chunking with Transformers', min: 20, level: 'avanzado',
      objectives: ['Entender la predicción de bloques de acciones', 'Saber por qué el chunking reduce el error acumulado'],
      blocks: [
        p('ACT predice no una acción, sino un bloque (chunk) de varias acciones futuras de una vez, usando un Transformer. Al predecir, por ejemplo, 50 pasos seguidos, la política se compromete con una trayectoria coherente y el error no se acumula paso a paso como en BC puro.'),
        diagrama('act', 'Observación → chunk de acciones → Transformer → ejecución con replaneo.'),
        p('La entrada incluye imágenes de varias cámaras y el estado de las articulaciones, tokenizados como una secuencia. Un encoder Visual Transformer procesa las imágenes y el decoder genera el chunk de acciones para los próximos K pasos.'),
        codigo('python', `import torch
import torch.nn as nn

class ACTPolicy(nn.Module):
    def __init__(self, obs_dim, act_dim, chunk=50, d=256, heads=8):
        super().__init__()
        self.chunk = chunk
        self.obs_proj = nn.Linear(obs_dim, d)
        layer = nn.TransformerEncoderLayer(d_model=d, nhead=heads,
                                           batch_first=True)
        self.encoder = nn.TransformerEncoder(layer, num_layers=4)
        self.query = nn.Parameter(torch.zeros(1, chunk, d))
        self.head = nn.Linear(d, act_dim)

    def forward(self, obs):
        z = self.obs_proj(obs).unsqueeze(1)          # (B,1,d)
        z = self.encoder(z).expand(-1, self.chunk, -1)
        return torch.tanh(self.head(z + self.query))  # (B,K,act_dim)

policy = ACTPolicy(obs_dim=14, act_dim=6)
chunk = policy(torch.randn(2, 14))
print("forma del chunk:", chunk.shape)`, 'Esquema de política ACT con salida por bloques.'),
        tabla(['Parámetro', 'Efecto'], [
          ['chunk size K', 'K grande = más coherencia, menos reactividad'],
          ['Replaneo cada N pasos', 'N pequeño = más reactivo, más coste'],
          ['Temporal ensemble', 'Suaviza varios chunks solapados']
        ]),
        apunte('Por qué gana', 'En tareas de contacto, decidir paso a paso produce movimientos temblorosos. Un chunk de 30–100 acciones da suavidad temporal; se ejecutan algunas y se vuelve a predecir, lo que mantiene algo de reactividad.'),
        nota('ACT se introdujo para manipulación bimanual y es una de las políticas por defecto en LeRobot: entrena en GPUs modestas y corre en tiempo real con una Jetson.')
      ],
      errors: [err('El robot ignora cambios inesperados en la escena', 'Chunk demasiado largo y replaneo poco frecuente', 'Reduce K o el intervalo de replaneo, y usa temporal ensemble.')],
      practice: { task: 'Entrena ACT con dos tamaños de chunk (20 y 100) en la misma tarea y compara suavidad y tasa de éxito.', success: ['Entrenan ambas políticas', 'Mides suavidad', 'Explicas el compromiso'] },
      quiz: [q('¿Qué es un "action chunk" en ACT?', ['Una sola acción repetida', 'Un bloque de acciones futuras predicho de una vez', 'Un frame de imagen', 'Un episodio completo'], 1, 'La política predice K acciones consecutivas y las ejecuta antes de replanear.')]
    }),
    L({
      id: 'r10-5', title: 'Diffusion policy', min: 20, level: 'avanzado',
      objectives: ['Entender el denoising iterativo aplicado a acciones', 'Comparar difusión con ACT'],
      blocks: [
        p('Diffusion policy aplica a las acciones la misma idea que los modelos de difusión a las imágenes: empieza con ruido aleatorio y, paso a paso, lo convierte en una secuencia de acciones coherente, condicionada a las observaciones actuales.'),
        diagrama('diffusion', 'De ruido a acción: U-Net predice ruido y se denoíza iterativamente.'),
        diagrama('act', 'Frente a ACT: ambas predicen chunks, pero con mecanismos distintos.'),
        formula('a_{t−1} = α·(a_t − γ·ε_θ(a_t, o, t) + z)', 'ε_θ predice el ruido; se resta iterativamente hasta obtener la acción limpia.'),
        codigo('python', `import torch

def denoise(model, obs, steps=10, act_dim=6, horizon=16):
    a = torch.randn(1, horizon, act_dim)      # ruido inicial
    for t in reversed(range(steps)):
        tt = torch.full((1,), t, dtype=torch.long)
        eps = model(a, obs, tt)               # ruido predicho
        a = 0.9 * (a - 0.2 * eps) + 0.1 * torch.randn_like(a)
    return a.squeeze(0)

# model suele ser un ConditionalUnet1D; obs incluye imágenes + estado
print("acciones resultantes:", denoise(lambda a,o,t: 0.1*a, None).shape)`, 'Esquema de denoising condicionado para un chunk de acciones.'),
        tabla(['', 'ACT', 'Diffusion policy'], [
          ['Salida', 'Chunk directo', 'Chunk por denoising iterativo'],
          ['Multimodalidad', 'Limitada', 'Natural: puede capturar varias soluciones'],
          ['Coste', 'Bajo', 'Mayor (varios pasos de red)'],
          ['Estabilidad', 'Muy buena', 'Muy buena con suficientes pasos']
        ]),
        apunte('Multimodalidad', 'Si un objeto puede agarrarse por arriba o por el lado, una red que predice la media de las dos soluciones puede agarrar justo en el medio y fallar. La difusión puede representar ambas modalidades y elegir una, por eso destaca en tareas con varias soluciones válidas.'),
        aviso('Más pasos de denoising no siempre significa mejor: por encima de 10–20 pasos el coste crece y la ganancia es marginal. Mide latencia antes de subirlos.')
      ],
      errors: [err('La política tarda demasiado por inferencia', 'Demasiados pasos de denoising o red muy grande', 'Reduce steps a 8–10 y destila la política si necesitas 30 Hz.')],
      practice: { task: 'Entrena diffusion policy y ACT en la misma tarea; compara tasa de éxito, suavidad y latencia de inferencia.', success: ['Mides latencias', 'Interpretas multimodalidad', 'Justificas la elección'] },
      quiz: [q('¿Qué ventaja tiene diffusion policy sobre un BC que predice la acción media?', ['Es más rápida siempre', 'Puede representar varias soluciones válidas para la misma observación', 'No necesita demos', 'No usa imágenes'], 1, 'El proceso de denoising modela distribuciones multimodales.')]
    }),
    L({
      id: 'r10-6', title: 'Reinforcement learning: PPO y SAC', min: 20, level: 'avanzado',
      objectives: ['Distinguir RL on-policy y off-policy', 'Elegir entre PPO y SAC'],
      blocks: [
        p('En reinforcement learning la política no copia demostraciones: prueba acciones, recibe una recompensa y ajusta su comportamiento para maximizar el retorno esperado. Es el marco natural cuando puedes simular mucho y medir el éxito automáticamente.'),
        diagrama('rl', 'Agente → acción → entorno → nuevo estado + recompensa → actualización.'),
        formula('J(θ) = E[ Σ γᵗ · r_t ]', 'γ descuenta recompensas futuras: define cuánto importa el largo plazo.'),
        tabla(['', 'PPO', 'SAC'], [
          ['Tipo', 'On-policy', 'Off-policy (con replay buffer)'],
          ['Espacio de acción', 'Continuo y discreto', 'Continuo'],
          ['Eficiencia de muestra', 'Baja', 'Alta'],
          ['Exploración', 'Estocástica, entropía', 'Entropía máxima, más robusta'],
          ['Uso típico', 'Locomoción en Isaac Lab', 'Manipulación y control continuo']
        ]),
        codigo('python', `from stable_baselines3 import SAC, PPO
from stable_baselines3.common.env_util import make_vec_env

env = make_vec_env("Pendulum-v1", n_envs=4)

model = SAC("MlpPolicy", env, learning_starts=1000,
            buffer_size=100_000, verbose=0)
model.learn(total_timesteps=50_000)
model.save("sac_pendulum")

# evaluación
obs = env.reset()
for _ in range(200):
    action, _ = model.predict(obs, deterministic=True)
    obs, reward, done, info = env.step(action)
    if done[0]:
        obs = env.reset()`, 'Entrenamiento y evaluación de SAC con Stable-Baselines3.'),
        apunte('On vs off policy', 'PPO solo aprende de las trayectorias que genera su política actual: estable y fácil de paralelizar, pero desperdicia datos. SAC guarda experiencias en un buffer y las reutiliza: aprende con muchas menos interacciones, ideal cuando el robot real es caro.'),
        aviso('Un agente RL encontrará cualquier atajo que le permita tu recompensa. Si el robot "gana" temblando para engañar al sensor de contacto, el problema es la recompensa, no el algoritmo.')
      ],
      errors: [err('El retorno no sube y la política se queda quieta', 'Recompensa demasiado escasa o descuento γ muy bajo', 'Diseña recompensas densas (distancia al objetivo) y usa γ≈0.99.')],
      practice: { task: 'Entrena PPO y SAC en Pendulum-v1 con el mismo presupuesto de pasos y compara curvas de retorno.', success: ['Ambos convergen', 'Explicas eficiencia de muestra', 'Mides con semilla fija'] },
      quiz: [q('¿Cuál es la diferencia clave entre PPO y SAC?', ['PPO es off-policy y SAC on-policy', 'PPO es on-policy; SAC reutiliza un replay buffer', 'SAC solo funciona en simulación', 'PPO no usa redes neuronales'], 1, 'SAC es off-policy y por eso mucho más eficiente en muestras.')]
    }),
    L({
      id: 'r10-7', title: 'Diseño de recompensas', min: 16, level: 'avanzado',
      objectives: ['Convertir una tarea en una señal de recompensa', 'Detectar recompensas mal especificadas'],
      blocks: [
        p('La recompensa es la definición formal del éxito. En RL, el robot optimizará exactamente lo que escribas, no lo que tú querías decir. Diseñarla bien es la parte más importante —y más subestimada— del trabajo.'),
        formula('r = r_éxito + w1·r_distancia + w2·r_postura − w3·penalización_par − w4·penalización_tiempo', 'Normaliza cada término: si uno domina, los demás dejan de importar.'),
        tabla(['Término', 'Ejemplo', 'Riesgo'], [
          ['Éxito esporádico', '+100 al agarrar', 'Muy escaso: no guía el aprendizaje'],
          ['Distancia', '−||pinza − objeto||', 'Puede atraer a la pinza sin agarrar bien'],
          ['Penalización de esfuerzo', '−0.001·||τ||²', 'Si es alta, el robot no se mueve'],
          ['Penalización de contacto', '−10 por golpe', 'Puede evitar todo contacto útil']
        ]),
        codigo('python', `import numpy as np

def reward(obs, action, done, success):
    # obs: [distancia, orientación, fuerza_contacto], action: par
    distance, orient, force = obs[0], obs[1], obs[2]
    r = -1.0 * distance                 # guía dense hacia el objeto
    r += 0.5 * np.cos(orient)           # alinea la muñeca
    r -= 0.001 * np.sum(action**2)      # ahorra esfuerzo
    r -= 0.1 * max(force - 5.0, 0.0)    # castiga golpes fuertes
    if success:
        r += 100.0
    if done and not success:
        r -= 20.0
    return float(r)`, 'Recompensa compuesta para una tarea de inserción.'),
        apunte('Reward shaping', 'Las recompensas densas (por ejemplo, la distancia negativa) aceleran el aprendizaje, pero pueden cambiar la política óptima. El potential-based shaping garantiza que no cambias el óptimo si usas r′ = r + γΦ(s′) − Φ(s).'),
        aviso('Nunca depures la recompensa solo con la curva de retorno: graba vídeos de la política. El "reward hacking" se ve en el comportamiento mucho antes que en la métrica.')
      ],
      errors: [err('El robot aprende a quedarse quieto', 'La penalización de esfuerzo o de contacto domina la recompensa', 'Baja los pesos de penalización y añade una recompensa densa por acercarse.')],
      practice: { task: 'Diseña una recompensa para abrir una puerta y lista tres formas en que el robot podría hacer trampas con ella.', success: ['Tienes términos densos y esporádicos', 'Identificas reward hacking', 'Normalizas pesos'] },
      quiz: [q('¿Qué es el reward hacking?', ['El robot maximiza la recompensa de una forma no intencionada', 'La red se sobreajusta', 'El optimizador diverge', 'El entorno se reinicia'], 0, 'El agente explota un fallo en la especificación de la recompensa.')]
    }),
    L({
      id: 'r10-8', title: 'Sim-to-real', min: 18, level: 'avanzado',
      objectives: ['Entender la brecha entre simulación y realidad', 'Aplicar dominio aleatorizado y calibración'],
      blocks: [
        p('Entrenar en simulación es rápido, paralelo y seguro: puedes hacer 10.000 episodios en minutos. El problema es que el simulador nunca es exacto. La diferencia entre sim y real —masa, fricción, retardo, iluminación, flexibilidad— se llama sim-to-real gap.'),
        diagrama('sim2real', 'Entrenar en sim → aleatorizar dominio → transferir → ajustar con datos reales.'),
        lista(['Dinámica: inercia, rozamiento, amortiguamiento y backlash de engranajes.', 'Sensores: ruido, latencia, cuantización, exposición de cámara.', 'Visual: texturas, sombras y colores que no existen en el renderer.',
        'Actuadores: saturación de par, tiempo de respuesta y deadzone del PWM.'], true),
        codigo('python', `import numpy as np

def randomize_domain(cfg, rng):
    # se aplica AL INICIO de cada episodio de entrenamiento
    cfg["mass"]      *= rng.uniform(0.7, 1.3)
    cfg["friction"]  *= rng.uniform(0.5, 1.5)
    cfg["latency"]    = rng.uniform(0.0, 0.03)
    cfg["light"]     *= rng.uniform(0.6, 1.4)
    cfg["camera_xyz"] += rng.normal(0, 0.01, size=3)
    return cfg

rng = np.random.default_rng(42)
cfg = {"mass": 1.0, "friction": 0.8, "latency": 0.01,
       "light": 1.0, "camera_xyz": np.zeros(3)}
print(randomize_domain(cfg, rng))`, 'Domain randomization típico en el entrenamiento.'),
        apunte('Robustez por variedad', 'Si la política entrena con masas y luces aleatorias, aprende a ignorar esas variaciones y a reaccionar a lo que de verdad importa. Es contraintuitivo: hacer el entrenamiento más difícil mejora la transferencia.'),
        pasos([
          { title: '1. Calibra lo que puedas', text: 'Mide masa, inercia y retardo reales y ponlos en el simulador.' },
          { title: '2. Aleatoriza el resto', text: 'Rangos amplios pero plausibles alrededor de los valores medidos.' },
          { title: '3. Entrena muchas semillas', text: 'Cada semilla ve un dominio distinto.' },
          { title: '4. Fine-tune con datos reales', text: 'Unos pocos episodios reales corrigen el gap restante.' }
        ]),
        aviso('No aleatorices sin límite: si la masa varía entre 0.1× y 10×, la política se vuelve conservadora y torpe. Los rangos deben cubrir la incertidumbre real, no ser arbitrarios.')
      ],
      errors: [err('La política funciona en Isaac Sim pero el robot real se cae', 'Falta de randomization de latencia y fricción', 'Añade retardo de actuación y rango de fricción más amplio, y reduce la velocidad de ejecución.')],
      practice: { task: 'Entrena una política con y sin domain randomization y evalúa ambas en el robot real (o con parámetros perturbados en sim).', success: ['Comparas tasas de éxito', 'Documentas los rangos', 'Haces fine-tune'] },
      quiz: [q('¿Qué es el sim-to-real gap?', ['La diferencia entre lo que el simulador predice y lo que hace el robot real', 'Un error de compilación', 'La latencia de la cámara', 'La falta de GPU'], 0, 'Es la discrepancia de dinámica y percepción entre entrenamiento y despliegue.')]
    }),
    L({
      id: 'r10-9', title: 'LeRobot: el pipeline completo', min: 18, level: 'intermedio',
      objectives: ['Usar LeRobot para grabar, entrenar y evaluar', 'Entender el formato de dataset'],
      blocks: [
        p('LeRobot es la librería de Hugging Face que unifica todo el ciclo: conectar el robot, grabar demostraciones, entrenar políticas (ACT, Diffusion, PPO, TD3) y evaluarlas. Es el equivalente a Hugging Face Transformers pero para robótica.'),
        diagrama('lerobot', 'Conectar → grabar episodios → entrenar → evaluar tasa de éxito.'),
        codigo('bash', `# grabar demostraciones
lerobot-record --robot.type=so101 \\
  --robot.id=mi_brazo \\
  --dataset.repo_id=usuario/tarea \\
  --dataset.num_episodes=30 \\
  --dataset.fps=30

# entrenar una política ACT
lerobot-train --dataset.repo_id=usuario/tarea \\
  --policy.type=act \\
  --output_dir=outputs/act-tarea \\
  --batch_size=32 --num_workers=4

# evaluar en el robot real
lerobot-eval --policy.path=outputs/act-tarea \\
  --robot.type=so101 --eval.n_episodes=20`, 'Comandos típicos del CLI de LeRobot.'),
        tabla(['Etapa', 'Qué hace', 'Salida'], [
          ['connect', 'Descubre puertos y cámaras', 'Robot listo'],
          ['record', 'Guarda observaciones y acciones', 'Dataset en disco/Hub'],
          ['train', 'Entrena la política', 'Checkpoint'],
          ['eval', 'Ejecuta episodios y mide éxito', 'Métricas y vídeos']
        ]),
        apunte('Formato del dataset', 'Cada episodio se guarda como una tabla con columnas observation.* (imágenes de cada cámara y estado) y action.* (la orden enviada a cada servo). El formato es compatible con PyTorch y con el Hub, así que puedes compartir tu dataset con la comunidad.'),
        nota('LeRobot incluye configuraciones listas para SO-100/101, WidowX y simuladores. Empieza con un brazo barato y el pipeline completo antes de comprar hardware más caro.'),
        enlace('https://huggingface.co/docs/lerobot/index', 'Documentación oficial de LeRobot', 'Instalación, robots soportados y recetas de entrenamiento.')
      ],
      errors: [err('lerobot-record no detecta la cámara', 'Índice de cámara equivocado o permisos USB', 'Lista dispositivos con v4l2-ctl o el panel del sistema y corrige el índice en la configuración.')],
      practice: { task: 'Graba 10 episodios, entrena una política ACT y evalúa 10 episodios reales. Sube el dataset y las métricas a tu repositorio.', success: ['Dataset reproducible', 'Checkpoint guardado', 'Tasa de éxito documentada'] },
      quiz: [q('¿Qué etapas cubre LeRobot?', ['Solo entrenamiento', 'Grabación, entrenamiento y evaluación', 'Solo simulación', 'Solo diseño de hardware'], 1, 'Es un pipeline de extremo a extremo para robot learning.')]
    }),
    L({
      id: 'r10-10', title: 'MuJoCo Playground e Isaac Lab', min: 18, level: 'avanzado',
      objectives: ['Elegir el simulador según la tarea', 'Entrenar políticas en paralelo'],
      blocks: [
        p('El entrenamiento en RL necesita millones de interacciones. Los simuladores modernos ejecutan cientos o miles de copias del robot en paralelo en la GPU, reduciendo horas de entrenamiento a minutos.'),
        tabla(['Simulador', 'Punto fuerte', 'Ideal para'], [
          ['MuJoCo / Playground', 'Dinámica precisa y contacto estable, muy rápido en CPU/GPU', 'Manipulación, locomotion, investigación'],
          ['Isaac Lab (NVIDIA)', 'Paralelismo masivo en GPU y fotorrealismo', 'RL a gran escala, percepción sintética'],
          ['Gazebo / Ignition', 'Integración ROS 2 y sensores realistas', 'Sistemas y navegación'],
          ['Drake', 'Planificación con restricciones y rigurosidad', 'Manipulación y control']
        ]),
        codigo('python', `import jax
import jax.numpy as jnp
from mujoco_playground import registry
from mujoco_playground.config import manipulation_params

# Playground usa JAX: un vmap entrena muchos entornos a la vez
env = registry.load("PandaPickCube")
cfg = manipulation_params.get_default_config()

@jax.jit
def step_vec(states, actions):
    return jax.vmap(env.step)(states, actions)

key = jax.random.PRNGKey(0)
states = jax.vmap(env.reset)(jax.random.split(key, 256))
print("entornos paralelos:", states.obs.shape[0])`, 'Entornos vectorizados con MuJoCo Playground y JAX.'),
        apunte('Por qué la GPU importa', 'Con 2048 entornos en paralelo, cada paso de simulación produce 2048 transiciones. Un episodio de 1000 pasos se convierte en 2 millones de muestras en segundos de reloj. Eso es imposible con un solo robot físico.'),
        lista(['MuJoCo es más ligero y su contacto es muy estable: excelente para primeras pruebas.', 'Isaac Lab require GPU NVIDIA y tiene curva de aprendizaje más pronunciada, pero escala mejor.', 'Valida siempre en el robot real: un buen resultado en simulación no garantiza transferencia.']),
        enlace('https://mujocoplayground.readthedocs.io/', 'MuJoCo Playground', 'Entrenamiento rápido con JAX para robótica.')
      ],
      errors: [err('El entrenamiento en Isaac Lab se queda sin memoria de GPU', 'Demasiados entornos paralelos o texturas grandes', 'Reduce el número de entornos y el tamaño de las cámaras sintéticas.')],
      practice: { task: 'Entrena una política simple en MuJoCo Playground con 128 entornos y mide muestras por segundo. Repite con 512.', success: ['Mides muestras/s', 'Comparas configuraciones', 'Explicas el escalado'] },
      quiz: [q('¿Cuál es la principal ventaja de Isaac Lab sobre un simulador de un solo entorno?', ['Mejor audio', 'Miles de entornos en paralelo en GPU', 'Menos consumo', 'No necesita modelo del robot'], 1, 'El paralelismo masivo acelera el entrenamiento por RL órdenes de magnitud.')]
    }),
    L({
      id: 'r10-11', title: 'Modelos VLA: visión, lenguaje y acción', min: 20, level: 'avanzado',
      objectives: ['Entender cómo un VLM se convierte en controlador', 'Conocer sus limitaciones reales'],
      blocks: [
        p('Un modelo VLA (Vision-Language-Action) toma una imagen y una instrucción en lenguaje natural y produce acciones para el robot. La idea es reutilizar el conocimiento del mundo que ya tiene un modelo multimodal grande y conectarlo con el cuerpo.'),
        diagrama('vla', 'Imagen + texto → backbone VLM → tokens de acción → robot.'),
        diagrama('multimodal', 'Cómo se fusionan imagen y lenguaje en un espacio de tokens común.'),
        p('Arquitecturalmente, se tokenizan imágenes y texto, se procesan con un Transformer y la cabeza genera tokens de acción que se decodifican a movimientos continuos o discretos (por ejemplo, buckets de 256 valores por articulación).'),
        codigo('python', `import torch
from transformers import AutoProcessor, AutoModelForVision2Seq

processor = AutoProcessor.from_pretrained("ejemplo/vla-base")
model = AutoModelForVision2Seq.from_pretrained("ejemplo/vla-base")

image = processor.image_processor(images=image_rgb, return_tensors="pt")
text = processor(text="Abre el cajón azul", return_tensors="pt")
inputs = {**image, **text}

with torch.no_grad():
    action_tokens = model.generate(**inputs, max_new_tokens=8)
# action_tokens → desnormalizar → [dx,dy,dz,drot,gripper]
print("tokens de acción:", action_tokens.shape)`, 'Esquema de inferencia con un modelo VLA.'),
        tabla(['Ventaja', 'Limitación'], [
          ['Sigue instrucciones en lenguaje natural', 'Latencia alta (decenas a cientos de ms)'],
          ['Generaliza a objetos nuevos', 'Coste de inferencia y memoria'],
          ['No requiere programar cada tarea', 'No tiene garantías de estabilidad ni seguridad']
        ]),
        widget('coste-llm'),
        apunte('Dónde encaja', 'Un VLA suele ir en alto nivel: decide qué hacer ("agarrar la taza"), mientras un controlador clásico o una política ACT ejecuta el movimiento preciso. Esperar que un VLA reemplace al control de 1 kHz es un error común.'),
        aviso('Los VLA alucinan acciones como un LLM alucina texto. Necesitas supervisión, límites de velocidad y un monitoreo que pare el robot si la acción propuesta es peligrosa.')
      ],
      errors: [err('El robot tarda medio segundo en reaccionar a cada instrucción', 'Inferencia del VLM en cada paso', 'Ejecuta el VLA a baja frecuencia (1–5 Hz) y deja el control de alto Hz a una política local.')],
      practice: { task: 'Prueba un VLA en dos tareas con instrucciones distintas y mide latencia y tasa de éxito. Compara con una política ACT especializada.', success: ['Mides latencia', 'Compararás éxito vs ACT', 'Propones arquitectura híbrida'] },
      quiz: [q('¿Cuál es el rol más realista de un VLA en un robot hoy?', ['Reemplazar el control de motores a 1 kHz', 'Alto nivel: interpretar instrucciones y decidir la tarea', 'Calibrar cámaras', 'Suministrar energía'], 1, 'Su fuerte es la comprensión; la ejecución fina se delega a controladores o políticas rápidas.')]
    }),
    L({
      id: 'r10-12', title: 'Métricas de éxito y evaluación', min: 16, level: 'intermedio',
      objectives: ['Diseñar un protocolo de evaluación honrado', 'Evitar conclusiones por una sola semilla'],
      blocks: [
        p('En robot learning la métrica reina es la tasa de éxito: de N intentos, cuántos terminan con la tarea completada. Pero un 80% sin contexto no dice casi nada: ¿con cuántos objetos, en cuántas sesiones, con qué criterio de éxito?'),
        tabla(['Métrica', 'Qué mide', 'Cuándo usarla'], [
          ['Tasa de éxito', 'Episodios exitosos / total', 'Métrica principal'],
          ['Tiempo de completación', 'Segundos hasta el éxito', 'Comparar eficiencia'],
          ['Tasa de colisiones', 'Golpes por episodio', 'Seguridad'],
          ['Suavidad / jerk', 'Variación de aceleración', 'Calidad del movimiento'],
          ['Generalización', 'Éxito con objetos nuevos', 'Robustez real']
        ]),
        formula('tasa de éxito = exitos / N        IC 95% ≈ 1.96·√(p·(1−p)/N)', 'Con N=20 y p=0.8, el intervalo es amplio: no overinterpretes diferencias pequeñas.'),
        codigo('python', `import numpy as np

def resumen(exitos, N):
    p = np.mean(exitos)
    se = np.sqrt(p*(1-p)/N)
    return p, (max(0,p-1.96*se), min(1,p+1.96*se))

# 20 episodios, 16 exitosos
p, ci = resumen([1]*16 + [0]*4, 20)
print(f"éxito={p:.0%}, IC95%=[{ci[0]:.0%}, {ci[1]:.0%}]")`, 'Tasa de éxito con intervalo de confianza.'),
        pasos([
          { title: '1. Define el éxito por escrito', text: '¿Agarrar basta o hay que levantar y soltar en un destino?' },
          { title: '2. Fija un protocolo', text: 'Mismo número de intentos, mismas posiciones iniciales y criterios claros.' },
          { title: '3. Varía lo que importa', text: 'Objetos, luz y posiciones nuevas para medir generalización.' },
          { title: '4. Usa varias semillas', text: 'Entrena 3 semillas y reporta media y desviación, no el mejor caso.' }
        ]),
        apunte('Evalúa en el robot real', 'Las métricas en simulación son baratas y optimistas. Un protocolo honrado incluye siempre una evaluación física con vídeos archivados; si algo falla, debes poder volver a verlo.'),
        aviso('No escojas el checkpoint con mejor éxito en el mismo conjunto que usas para reportar: eso es sobreajuste al test. Reserva una semilla o un conjunto de escenarios solo para evaluación final.')
      ],
      errors: [err('Reportas 95% de éxito pero en producción falla mucho', 'Evaluaste solo en las condiciones de entrenamiento', 'Añade escenarios de generalización y reporta intervalos de confianza.')],
      practice: { task: 'Diseña un protocolo de evaluación de 30 episodios para tu tarea, con criterios de éxito y tres escenarios de generalización.', success: ['Criterios objetivos', 'Mides IC', 'Incluyes vídeos'] },
      quiz: [q('¿Por qué hace falta más de una semilla al evaluar una política?', ['Porque el entrenamiento es estocástico y una sola corrida puede ser atípica', 'Porque ahorra tiempo', 'Porque el robot tiene varias cámaras', 'Porque la tasa de éxito siempre es 100%'], 0, 'La variabilidad del entrenamiento exige reportar media y dispersión.')]
    })
  ]),

  // -------------------- BLOQUE 11: PROFESIONAL --------------------
  M('b11', 'Profesional y especializaciones', 'Portafolio, entrevistas, seguridad y cómo elegir un camino', [
    L({
      id: 'r11-1', title: 'El portafolio que aguanta tres preguntas', min: 14,
      objectives: ['Diseñar proyectos que demuestren dominio real', 'Evitar el portafolio de tutoriales copiados'],
      blocks: [
        p('Un portafolio de robótica no se mide por los certificados, sino por los artefactos: robots que se movieron, datos que mediste y fallos que supiste explicar. Tres buenos proyectos bien documentados valen más que veinte repos incompletos.'),
        pasos([
          { title: 'Un vídeo arriba', text: '15–30 segundos mostrando el robot funcionando. Sin música, sin introducción. La gente decide en los primeros cinco segundos.' },
          { title: 'Diagrama y números', text: 'Esquemático de cableado o arquitectura, y las cifras reales que mediste: corriente, latencia, tasa de éxito.' },
          { title: 'Qué se rompió', text: 'Una sección literal llamada "qué se rompió y cómo lo arreglé". Es la parte que no se puede falsificar.' },
          { title: 'Decisiones, no solo resultados', text: 'Por qué ese sensor, por qué esa ganancia, qué alternativas probaste y por qué las descartaste.' }
        ]),
        apunte('La prueba de las tres preguntas', 'Un proyecto está listo cuando puedes responder con tres niveles de profundidad: qué hace, por qué lo diseñaste así y qué pasaría si cambiaran las condiciones. Si te quedas en el primer nivel, aún no es tuyo.'),
        tabla(['Artefacto débil', 'Artefacto fuerte'], [
          ['Foto del robot', 'Vídeo de 20 s + foto del cableado'],
          ['"Funciona bien"', '"Tasa de éxito 16/20, IC95% [0.64, 0.96]"'],
          ['Código del tutorial', 'Código con tus decisiones y cuaderno de depuración'],
          ['Lista de cursos', 'Tres repos con READMEs investigables']
        ]),
        aviso('No pongas en el CV un proyecto que no puedas defender durante veinte minutos. La entrevista técnica de robótica se centra en TU código y TU hardware, no en conceptos generales.')
      ],
      errors: [err('Tengo muchos repos pero nadie me llama', 'Son reproducciones de tutoriales sin decisiones propias ni datos medidos', 'Elige tres, reescribe sus READMEs con números y fallos reales, y retira el resto.')],
      practice: { task: 'Elige tus tres mejores proyectos y reescribe sus READMEs con vídeo, diagrama, números y la sección "qué se rompió y cómo lo arreglé".', success: ['Vídeo arriba', 'Números reales medidos', 'Sección de fallos'] },
      quiz: [q('Según la lección, ¿cuándo está listo un proyecto del portafolio?', ['Cuando acumula muchos certificados', 'Cuando puedes explicar qué hace, por qué lo diseñaste así y qué pasaría si cambian las condiciones', 'Cuando está repartido en veinte repositorios', 'Cuando usa el hardware más caro'], 1, 'La prueba de las tres preguntas exige tres niveles de profundidad: qué hace, por qué y qué pasaría si cambian las condiciones.')]
    }),
    L({
      id: 'r11-2', title: 'Entrevistas técnicas de robótica', min: 13,
      objectives: ['Preparar preguntas técnicas típicas', 'Explicar decisiones a tres niveles'],
      blocks: [
        p('Las entrevistas de robótica mezclan tres cosas: fundamentos (electrónica, control, ROS), tu experiencia concreta y resolución de problemas en vivo. La diferencia con una entrevista de software es que el fallo puede ser físico.'),
        tabla(['Área', 'Preguntas típicas'], [
          ['Electrónica', '¿Por qué necesita un pull-up? ¿Qué pasa si un motor calienta? ¿Cómo mides corriente?'],
          ['Control', '¿Cuándo oscila un PID? ¿Para qué sirve el término D? ¿Qué es el windup?'],
          ['ROS 2', 'Diferencia entre topic, service y action. Qué publica map→odom. Cómo se estructura un launch file.'],
          ['Sistemas', 'Pi + MCU: qué va en cada uno y por qué. Qué pasa si cae la tensión de la batería.']
        ]),
        apunte('Cómo responder', 'Usa la estructura: contexto → decisión → consecuencia → alternativa. "Mi servo resbalaba, así que añadí un encoder, lo que me permitió cerrar el lazo; consideré un sensor óptico pero era más caro y frágil."'),
        lista(['Practica explicando tu código en voz alta sin mirarlo.', 'Ten a mano los números de tus proyectos: los entrevistadores piden cifras.', 'Prepara dos historias de fallos graves y cómo los depuraste.'], true),
        aviso('Si te preguntan por un concepto que no sabes, dilo y explica cómo lo investigarías. En robótica la honestidad vale más que improvisar una respuesta.')
      ],
      practice: { task: 'Simula una entrevista de 20 minutos sobre tu proyecto principal con un amigo o grabándote.', success: ['Respondes tres niveles de profundidad', 'Usas cifras concretas', 'No inventas datos'] },
      quiz: [q('¿Qué estructura recomienda la lección para responder una pregunta técnica en la entrevista?', ['Memorizar la definición del concepto', 'Contexto → decisión → consecuencia → alternativa', 'Dar solo el resultado final', 'Desviar la pregunta hacia otro proyecto'], 1, 'El apunte propone contexto, decisión, consecuencia y alternativa para defender una decisión técnica.')]
    }),
    L({
      id: 'r11-3', title: 'Seguridad, estándares y responsabilidad', min: 12,
      objectives: ['Identificar riesgos físicos', 'Conocer marcos de seguridad básicos'],
      blocks: [
        p('En robótica un bug puede romper un dedo o quemar una casa. La seguridad no es un trámite al final: es una restricción de diseño desde el primer día.'),
        lista(['Límites de velocidad, fuerza y par en cada eje.', 'Parada de emergencia física (E-stop) que corte la alimentación del motor.', 'Zonas de trabajo delimitadas y vigilancia de personas.', 'Interlocks: el robot no arranca si una tapa está abierta.', 'LiPo: cargador balanceador, supervisión y almacenamiento seguro.']),
        apunte('Estándares que encontrarás', 'ISO 10218 (seguridad de robots industriales), ISO/TS 15066 (colaboración humano-robot) e ISO 13849 (seguridad de sistemas de control). No hace falta memorizarlos, pero sí saber que existen y qué tipo de riesgo cubren.'),
        aviso('Un robot colaborativo no es "seguro porque es pequeño". La seguridad se demuestra con mediciones de fuerza y distancia, no con intuiciones.'),
        p('En robot learning añade una capa más: una política entrenada puede comportarse de forma impredecible fuera de distribución. Limita siempre la aceleración y el espacio de trabajo en tiempo real, aunque el modelo diga otra cosa.')
      ],
      errors: [err('El brazo hizo un movimiento brusco durante una demo', 'No había límites de velocidad ni E-stop', 'Añade límites en el controlador y un corte físico antes de volver a probar con personas cerca.')],
      practice: { task: 'Haz una auditoría de seguridad de tu estación: comprueba el E-stop que corta alimentación, configura límites de velocidad y par en cada eje, verifica los interlocks y documenta cada riesgo con su mitigación.', success: ['E-stop físico probado', 'Límites de velocidad y par configurados', 'Lista de riesgos con mitigación'] },
      quiz: [q('¿Qué tipo de riesgo cubre ISO/TS 15066 según la lección?', ['La seguridad de robots industriales en general', 'La colaboración humano-robot', 'El almacenamiento de baterías LiPo', 'La certificación de software'], 1, 'ISO/TS 15066 es el marco para la colaboración humano-robot; ISO 10218 cubre robots industriales e ISO 13849 los sistemas de control.')]
    }),
    L({
      id: 'r11-4', title: 'Demanda, salarios y cómo empezar', min: 11,
      objectives: ['Tener una visión realista del mercado', 'Elegir un primer puesto'],
      blocks: [
        p('La robótica es un campo más pequeño que el software puro, pero con menos oferta de talento. El capital de riesgo en física e IA aumentó con fuerza en 2025–2026 y eso se tradujo en más startups de humanoides, manipulación y conducción autónoma.'),
        tabla(['Perfil', 'Rango orientativo EE. UU.', 'Nota'], [
          ['Entry level', '~$80k–100k', 'Más alto en costas y empresas bien financiadas'],
          ['Mid (3–6 años)', '~$120k–165k', 'Aquí se nota la especialización'],
          ['Senior', '~$160k–230k', 'Frontier physical AI muy por encima'],
          ['Técnico', '~$74k', 'Suele requerir grado asociado']
        ]),
        apunte('El dato que importa', 'En una celda robótica el robot representa en promedio solo el 25% del coste total del proyecto. El otro 75% es ingeniería, seguridad e integración. Ese hueco es lo que vendes: no el brazo, sino hacer que funcione.'),
        lista(['Primer empleo: integración o firmware te dan hardware real desde el día uno.', 'Si vienes de SWE, targets naturales: ROS 2, simulación, tooling, percepción.', 'Freelance: tareas de ROS y teleoperación se cotizan por entregable y bien pagadas.', 'No esperes a "saberlo todo": la especialidad se elige trabajando.'], true),
        nota('Cifras orientativas recogidas de fuentes públicas (BLS, O*NET, Payscale, The Robot Report). Varían mucho por región y empresa; úsalas para orientarte, no como promesa.')
      ],
      practice: { task: 'Escribe tu plan de los próximos 90 días: un bloque de esta academia, un proyecto y una especialidad a explorar.', success: ['Bloque concreto', 'Proyecto con fecha', 'Especialidad elegida provisionalmente'] },
      quiz: [q('Según el texto, ¿qué porcentaje del coste de una celda robótica corresponde al robot?', ['Aproximadamente el 75%', 'Aproximadamente el 50%', 'Aproximadamente el 25%', 'Aproximadamente el 10%'], 2, 'El robot es solo el 25% del coste total; el 75% restante es ingeniería, seguridad e integración.')]
    }),
    L({
      id: 'r11-5', title: 'Especialidad: percepción y visión', min: 11,
      objectives: ['Conocer el día a día de percepción', 'Saber qué profundizar'],
      blocks: [
        h('Por qué existe la percepción'),
        p('Ningún controlador puede corregir un objeto que no sabe dónde está. Esta especialidad existe porque los sensores no entregan el mundo: entregan píxeles con ruido, nubes de puntos desalineadas y oclusiones. Percepción es la única capa que decide qué es real y qué es ruido, y la que convierte una señal en poses y etiquetas dentro del marco de referencia del robot.'),
        p('Quien hace percepción responde a una pregunta: ¿qué hay y dónde está? El trabajo real pasa menos tiempo entrenando modelos y más tiempo con cámaras mal iluminadas, lentes desenfocadas y nubes de puntos desalineadas.'),
        lista(['Cimientos: geometría proyectiva, calibración, transformadas y álgebra lineal.', 'Herramientas: OpenCV, PCL/Open3D, ROS 2 (image_transport, tf2), PyTorch.', 'Tareas: detección 2D/3D, segmentación, odometría visual, SLAM, fusión lidar-cámara.', 'Métrica típica: IoU, mAP, error de reproyección, error de traslación/rotación.']),
        p('Un número para dimensionar el problema: con f = 700 px y un objeto a 2 m, un error de 2 px en el centro de la imagen equivale a ΔZ ≈ Z·Δp/f = 2000·2/700 ≈ 5,7 mm de profundidad. Por eso un RMS de reproyección de 0,3 px es aceptable y 2,5 px no. Una cámara RGB-D tipo RealSense D435 ronda los 350 USD y entrega nubes a 30 fps.'),
        tabla(['Enfoque', 'Qué entrega', 'Fortaleza', 'Límite'], [
          ['Visión clásica (OpenCV)', 'Blobs, bordes y esquinas calibradas', 'Barato, determinista y explicable', 'Falla con luz cambiante y texturas pobres'],
          ['Detector neuronal (YOLO, Mask R-CNN)', 'Cajas y máscaras por clase', 'Robusto en escenas complejas', 'Exige GPU y añade 20–50 ms de latencia'],
          ['RGB-D / estereo', 'Nube de puntos con profundidad', 'Profundidad directa sin mover la cámara', 'El ruido crece con Z² y sufre con sol directo']
        ]),
        apunte('Consejo de especialista', 'La calibración es la mitad del trabajo. Un modelo espectacular con una cámara mal calibrada da peores resultados que un método clásico con buenos intrínsecos. Aprende a medir el error de reproyección.'),
        aviso('El error típico es calibrar una vez y olvidar: un golpe a la cámara o un cambio de enfoque invalida los intrínsecos. Si la reproyección sube de 1 px, recalibra antes de culpar al detector, y no mezcles distorsión sin corregir con estimación de pose.'),
        codigo('python', `import cv2, numpy as np, glob
obj = np.zeros((6*9, 3), np.float32)
obj[:, :2] = np.mgrid[0:9, 0:6].T.reshape(-1, 2)
pts3d, pts2d = [], []
for f in glob.glob("cal/*.png"):
    gray = cv2.imread(f, cv2.IMREAD_GRAYSCALE)
    ok, corners = cv2.findChessboardCorners(gray, (9, 6), None)
    if ok:
        pts3d.append(obj)
        pts2d.append(cv2.cornerSubPix(gray, corners, (11, 11), (-1, -1),
            (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)))
ret, K, dist, rvecs, tvecs = cv2.calibrateCamera(pts3d, pts2d, gray.shape[::-1], None, None)
print("RMS de reproyección:", round(ret, 3), "px")`, 'Calibración de cámara con OpenCV y chequeo del RMS.'),
        enlace('https://docs.ros.org/en/humble/Tutorials/Intermediate/Tf2/Tf2-Main.html', 'ROS 2: tf2', 'Documentación oficial de marcos de referencia; imprescindible para pasar de píxel a metro.')
      ],
      errors: [err('La detección falla en cuanto cambia la luz', 'Umbral fijo calibrado en otra sala o intrínsecos desactualizados', 'Recalibra y comprueba el RMS de reproyección; usa umbral adaptativo u Otsu.')],
      practice: { task: 'Calibra una cámara con unas 20 fotos de un tablero de ajedrez, guarda los intrínsecos y comprueba que el error de reproyección sea menor de 1 píxel.', success: ['RMS de reproyección < 1 px', 'Intrínsecos guardados', 'Explicas qué mide esa métrica'] },
      quiz: [q('¿Cuál de estas es una métrica típica de percepción según la lección?', ['Overshoot', 'Error de reproyección', 'Jerk', 'Tiempo de establecimiento'], 1, 'En percepción se usan IoU, mAP, error de reproyección y error de traslación/rotación; las otras son métricas de control.')]
    }),
    L({
      id: 'r11-6', title: 'Especialidad: control y estimación', min: 11,
      objectives: ['Conocer el día a día de control', 'Saber qué profundizar'],
      blocks: [
        h('Por qué existen control y estimación'),
        p('En un lazo real el estado nunca está completo: el encoder da posición, el IMU aceleración con sesgo y el GPS llega a 10 Hz. Ninguna capa inferior entrega la velocidad y la orientación que el controlador necesita. Esta especialidad existe para reconstruir ese estado a partir de señales parciales y ruidosas; sin estimación, incluso la ley de control mejor diseñada persigue un objetivo equivocado.'),
        p('Control y estimación son caras opuestas de la misma moneda: control decide qué hacer; estimación decide qué está pasando. Sin una buena estimación, el mejor controlador persigue un estado equivocado.'),
        lista(['Cimientos: PID, espacio de estados, Kalman, LQR, MPC, análisis en frecuencia.', 'Herramientas: Python/NumPy, MATLAB/Simulink, ros2_control, Control Toolbox.', 'Tareas: lazos de velocidad y posición, fusión IMU-GPS, balanceo, control de fuerza.', 'Métrica típica: tiempo de establecimiento, overshoot, error estacionario, consumo energético.']),
        p('Un lazo a 1 kHz deja 1 ms por ciclo para medir, estimar y actuar. Si el filtro tarda 300 µs y la lectura llega con 200 µs de retardo, ya gastaste la mitad del presupuesto y el margen de fase se erosiona. Un encoder de 1024 pulsos por vuelta a 3000 rpm entrega 51.200 pulsos/s: derivar esa señal sin filtrar amplifica la cuantización.'),
        tabla(['Método', 'Entradas', 'Ventaja', 'Coste o límite'], [
          ['Filtro complementario', 'IMU + encoder', 'Unas líneas y sin modelo', 'Pesos fijos: no óptimo si cambia la dinámica'],
          ['Kalman (EKF)', 'IMU + encoder + GPS', 'Óptimo con ruido gaussiano y modelo lineal', 'Exige matrices Q y R; 0,1–1 ms por paso'],
          ['Observador de Luenberger', 'Modelo + salidas medidas', 'Simple y determinista', 'Sensible a errores del modelo']
        ]),
        apunte('Por dónde empezar', 'No intentes derivar la dinámica de un humanoide. Empieza por un motor con encoder y un péndulo invertido: son suficientes para entender el 80% de los problemas que aparecen después.'),
        aviso('Derivar la posición del encoder para obtener velocidad es el error clásico: el ruido de cuantización se amplifica y el término D del PID empieza a temblar. Filtra con un paso bajo o usa un observador, y nunca confíes en un IMU sin corregir el sesgo del giroscopio.'),
        codigo('python', `import numpy as np
# Kalman 1D: estimar posicion y velocidad desde una medicion ruidosa
dt = 0.001  # 1 kHz
A = np.array([[1.0, dt], [0.0, 1.0]])
H = np.array([[1.0, 0.0]])
Q = np.diag([1e-6, 1e-4])   # ruido de proceso
R = np.array([[1e-4]])      # ruido del encoder
x = np.zeros((2, 1)); P = np.eye(2)
for z in mediciones:         # z = posicion medida
    x = A @ x
    P = A @ P @ A.T + Q
    y = z - H @ x            # innovacion
    S = H @ P @ H.T + R
    K = P @ H.T @ np.linalg.inv(S)
    x = x + K * y
    P = (np.eye(2) - K @ H) @ P`, 'Paso de Kalman para fusión de encoder e IMU a 1 kHz.'),
        enlace('https://control.ros.org/humble/index.html', 'ros2_control', 'Documentación oficial del framework de control de ROS 2: controladores, interfaces de hardware y tiempo real.')
      ],
      errors: [err('El controlador oscila al añadir estimación de velocidad', 'Velocidad derivada de un encoder ruidoso alimenta el término D', 'Filtra la derivada o sustituye el diferenciador por un observador.')],
      practice: { task: 'Sintoniza un PID sobre un motor con encoder y mide tiempo de establecimiento, overshoot y error estacionario. Después explica qué pasaría si el encoder diera una lectura sesgada.', success: ['Mides al menos tres métricas', 'Identificas el papel de la estimación', 'Explicas la consecuencia del sensor sesgado'] },
      quiz: [q('¿Qué diferencia a control y estimación según la lección?', ['Control mide y estimación actúa', 'Control decide qué hacer; estimación decide qué está pasando', 'Son la misma disciplina con otro nombre', 'La estimación solo usa cámaras'], 1, 'El texto las describe como caras opuestas: el control decide la acción y la estimación infiere el estado.')]
    }),
    L({
      id: 'r11-7', title: 'Especialidad: manipulación y planificación', min: 11,
      objectives: ['Conocer el día a día de manipulación', 'Saber qué profundizar'],
      blocks: [
        h('Por qué existe la manipulación'),
        p('Llegar y agarrar no es solo cinemática: el mundo real tiene contactos, holguras y errores de modelo. Esta especialidad existe porque ni el control ni la percepción deciden qué dedo toca qué superficie ni con cuánta fuerza. Eso exige planificar en el espacio de configuraciones, evitar colisiones y gestionar el contacto con el entorno.'),
        p('Manipulación es el problema de llegar y agarrar sin romper nada. Combina cinemática, planificación con colisiones, control de fuerza y, cada vez más, políticas aprendidas.'),
        lista(['Cimientos: cinemática directa e inversa, Jacobiano, planificación, síntesis de agarre.', 'Herramientas: MoveIt 2, OMPL, Drake, Robotics Toolbox, Isaac Sim.', 'Tareas: recoger y colocar, ensamblaje, teleoperación, diseño de pinzas.', 'Métrica típica: tasa de éxito, tiempo por ciclo, fuerza de agarre, holgura mecánica.']),
        p('Un UR5e nuevo ronda los 35.000–40.000 USD y repite con ±0,1 mm, pero un ciclo real de recoger y colocar baja de unos 8 s a 3,5 s solo con eliminar esperas y suavizar la trayectoria. La diferencia entre 92% y 99% de tasa de éxito separa un prototipo de una celda en producción: en 1000 ciclos son 80 fallos frente a 10.'),
        tabla(['Pinza', 'Fuerza típica', 'Ideal para', 'Límite'], [
          ['Paralela mecánica', '20–100 N', 'Piezas rígidas y repetibles', 'Hay que diseñar el dedo para cada pieza'],
          ['Ventosa neumática', '5–50 N', 'Superficies planas y lisas', 'Falla con porosidad, polvo o succión insuficiente'],
          ['Pinza blanda o adhesiva', '1–20 N', 'Objetos frágiles e irregulares', 'Menos precisión y mayor desgaste']
        ]),
        apunte('La parte subestimada', 'Diseñar el dedo de una pinza puede mejorar más la tasa de éxito que cambiar el modelo. La mecánica y el modelado también son parte de la solución.'),
        aviso('Planificar con el modelo del brazo pero sin incluir la pinza en la geometría de colisión es el fallo típico: el plan es válido para el robot y la pinza choca contra la mesa. Añade siempre el efector a la escena de planificación (planning scene) y verifica la orientación del agarre, no solo la posición.'),
        pasos([
          { title: '1. Arranca el entorno', text: 'ros2 launch moveit2_tutorials demo.launch.py y abre RViz con el complemento de planificación de movimiento.' },
          { title: '2. Publica el obstáculo', text: 'Añade una mesa como objeto de colisión en la escena de planificación y comprueba que aparece resaltada en RViz.' },
          { title: '3. Planifica y ejecuta', text: 'Mueve el objetivo a la pose de agarre, pulsa Plan y luego Execute; repite 10 veces.' },
          { title: '4. Mide', text: 'Cronometra el ciclo y cuenta aciertos; si falla, revisa primero la pinza y los límites articulares.' }
        ]),
        enlace('https://moveit.picknik.ai/main/index.html', 'MoveIt 2', 'Documentación oficial: planificación de movimiento, escena de planificación y control de brazos en ROS 2.')
      ],
      errors: [err('El plan es válido pero la pinza choca', 'El efector no está incluido en la geometría de colisión', 'Añade la pinza a la escena de planificación y valida la orientación del agarre.')],
      practice: { task: 'Configura una escena en MoveIt 2 con un obstáculo, planifica una tarea de recoger y colocar y registra tasa de éxito y tiempo por ciclo durante 10 repeticiones.', success: ['Planificas sin colisiones', 'Mides éxito y tiempo de ciclo', 'Documentas la pinza utilizada'] },
      quiz: [q('¿Cuál es una métrica típica de manipulación según la lección?', ['mAP', 'Tasa de éxito', 'Margen de fase', 'Consumo de GPU'], 1, 'En manipulación se miden tasa de éxito, tiempo por ciclo, fuerza de agarre y holgura mecánica.')]
    }),
    L({
      id: 'r11-8', title: 'Especialidad: robot learning', min: 12,
      objectives: ['Conocer el día a día de robot learning', 'Saber qué profundizar'],
      blocks: [
        h('Por qué existe robot learning'),
        p('Programar a mano una regla para cada objeto y cada iluminación no escala. Esta especialidad existe porque ni el control clásico ni la percepción resuelven la variación infinita de escenas y objetos: una política aprendida generaliza donde un conjunto de reglas se agota, a cambio de exigir datos físicos y una evaluación honesta.'),
        p('Robot learning sustituye código manual por datos: muestras demostraciones o dejas que el agente explore y obtienes una política. Es la capa que está creciendo más rápido y la que más datos físicos necesita.'),
        lista(['Cimientos: aprendizaje por imitación, RL, transformers, difusión, sim-to-real.', 'Herramientas: LeRobot, PyTorch, MuJoCo, Isaac Lab, Hugging Face Hub.', 'Tareas: recolección de demostraciones, entrenamiento de ACT o diffusion policy, evaluación con vídeos.', 'Métrica típica: tasa de éxito con intervalo de confianza y generalización.']),
        p('50 demostraciones de 8 s a 30 fps son 12.000 frames y unos 20 minutos de grabación; con una política tipo ACT se entrenan en horas en una sola GPU. Si evalúas 20 episodios y aciertas 14, la tasa es 70% con IC95% aproximado de [46%, 87%]: un 82% sin intervalo y sin escenario nuevo no dice casi nada.'),
        tabla(['Enfoque', 'Señal de entrenamiento', 'Datos típicos', 'Cuándo conviene'], [
          ['Behavior cloning / ACT', 'Demostraciones de un experto', '50–200 episodios', 'Tareas de destreza con teleoperación'],
          ['Diffusion policy', 'Demostraciones con ruido iterativo', '50–300 episodios', 'Acciones multimodales y secuencias suaves'],
          ['RL en simulación y sim-to-real', 'Recompensa', 'Millones de pasos simulados', 'Cuando grabar es caro y hay buen simulador']
        ]),
        apunte('El cuello de botella', 'No es el modelo: son los datos y la evaluación. Saber diseñar un protocolo de evaluación honesto y grabar demostraciones limpias es lo que diferencia a alguien que entrena políticas de alguien que publica números creíbles.'),
        aviso('Evaluar siempre en las mismas condiciones de grabación es el error más común: la política memoriza la iluminación y la posición inicial. Cambia objeto, luz y cámara en el protocolo de evaluación y graba vídeos de los fallos; sin eso publicarás un número que no sobrevive al día siguiente.'),
        codigo('bash', `python lerobot/scripts/control_robot.py record --robot-config config/robot.py --output data/tarea --num-episodes 10 --fps 30 --warmup-time-s 2
python lerobot/scripts/train.py --config config/act.py --dataset data/tarea --output outputs/act_tarea`, 'Grabar demostraciones y entrenar una política ACT con LeRobot.'),
        enlace('https://huggingface.co/docs/lerobot/index', 'LeRobot', 'Documentación oficial de Hugging Face: grabación de demostraciones, políticas ACT y diffusion.')
      ],
      errors: [err('La política funciona al grabar pero falla en evaluación', 'Protocolo de eval con las mismas condiciones del entrenamiento', 'Cambia objeto, luz y cámara, y reporta tasa con IC sobre 20 episodios.')],
      practice: { task: 'Graba 10 demostraciones limpias de una tarea, entrena una política y evalúa 20 episodios reportando tasa de éxito con intervalo de confianza y un escenario nuevo.', success: ['Demos sin saltos ni frames corruptos', 'Evalúas en el robot real', 'Reportas IC y generalización'] },
      quiz: [q('Según la lección, ¿cuál es el cuello de botella en robot learning?', ['El modelo', 'Los datos y la evaluación', 'La GPU', 'El lenguaje de programación'], 1, 'El apunte insiste: no es el modelo, son los datos y un protocolo de evaluación honesto.')]
    }),
    L({
      id: 'r11-9', title: 'Especialidad: embedded y firmware', min: 11,
      objectives: ['Conocer el día a día de firmware', 'Saber qué profundizar'],
      blocks: [
        h('Por qué existe firmware'),
        p('El código de aplicación asume muestreo regular y órdenes que llegan a tiempo; el hardware no garantiza ninguna de las dos. Ni la planificación ni la percepción pueden fijar cuándo se muestrea un sensor o se actualiza un PWM: solo el firmware convierte ese requisito en capturas de timer, interrupciones y transferencias DMA. Sin esta capa, la frecuencia de control del enunciado nunca llega al motor.'),
        p('Firmware es donde el código toca el metal: PWM, timers, DMA, interrupciones y buses. Es la capa que decide si tu control a 1 kHz es real o solo una idea en un artículo.'),
        lista(['Cimientos: C/C++, arquitectura ARM, RTOS, PWM, ADC, DMA, protocolos.', 'Herramientas: ESP-IDF, STM32Cube, PlatformIO, osciloscopio, analizador lógico.', 'Tareas: drivers de motor y sensor, bootloader, OTA, telemetría, temporización determinista.', 'Métrica típica: jitter, latencia de interrupción, consumo, fiabilidad.']),
        p('Un lazo a 1 kHz deja 1 ms por ciclo: un jitter de 50 µs ya es el 5% del periodo y come margen de fase. Un STM32F4 a 168 MHz mueve el ADC a 1 MSPS mediante DMA sin cargar la CPU, y un PWM de 12 bits a 20 kHz queda por encima del rango audible. Como referencia de coste, una Nucleo-F446 ronda los 15–20 USD y un osciloscopio de banco como el DS1054Z unos 400 USD.'),
        tabla(['Técnica', 'Cómo espera el dato', 'Latencia y CPU', 'Uso típico'], [
          ['Polling', 'El bucle consulta el indicador de estado', 'CPU al 100%, latencia impredecible', 'Depuración y sensores lentos'],
          ['Interrupción (ISR)', 'El periférico avisa', 'Baja latencia, ISR muy corta', 'Encoder y captura de tiempo'],
          ['DMA', 'El periférico escribe directo en memoria', 'Casi cero CPU, ráfaga continua', 'ADC a 1 MSPS, I²S, SPI']
        ]),
        apunte('El consejo', 'Compra un osciloscopio o un analizador lógico barato. Ver una señal I²C o un PWM en vivo te ahorrará semanas de conjeturas.'),
        aviso('Compartir una variable entre una ISR y una tarea sin declararla volatile ni proteger la sección crítica produce lecturas a medias: el compilador optimiza la variable y el valor cambia durante la lectura. Tampoco imprimas por serial dentro de una ISR: bloquea el cierre del lazo y dispara el watchdog.'),
        codigo('cpp', `#include <driver/ledc.h>
// PWM de 20 kHz y 12 bits en GPIO25 con ESP-IDF
ledc_timer_config_t timer = {
    .speed_mode = LEDC_LOW_SPEED_MODE,
    .duty_resolution = LEDC_TIMER_12_BIT,
    .timer_num = LEDC_TIMER_0,
    .freq_hz = 20000,
    .clk_cfg = LEDC_AUTO_CLK
};
ledc_timer_config(&timer);
ledc_channel_config_t ch = {
    .gpio_num = 25,
    .speed_mode = LEDC_LOW_SPEED_MODE,
    .channel = LEDC_CHANNEL_0,
    .timer_sel = LEDC_TIMER_0,
    .duty = 2048            // 50% de 4096
};
ledc_channel_config(&ch);`, 'Configurar un PWM de 20 kHz con ESP-IDF.'),
        enlace('https://docs.espressif.com/projects/esp-idf/en/latest/esp32/', 'ESP-IDF', 'Documentación oficial de Espressif: timers, LEDC/PWM, DMA y FreeRTOS en ESP32.')
      ],
      errors: [err('El PWM se ve bien en código pero el motor vibra', 'Jitter de temporización o frecuencia por debajo del rango audible', 'Mide la señal con el osciloscopio y sube la frecuencia por encima de 20 kHz.')],
      practice: { task: 'Genera un PWM con un timer de tu microcontrolador y mídelo con un osciloscopio o analizador lógico; registra frecuencia, ciclo de trabajo y jitter.', success: ['Señal medida en vivo', 'Jitter cuantificado', 'Explicas la diferencia entre el código y lo observado'] },
      quiz: [q('¿Qué herramienta recomienda la lección para depurar señales I²C o PWM?', ['Un multímetro', 'Un osciloscopio o analizador lógico', 'Un log de ROS 2', 'Un simulador de red'], 1, 'El apunte aconseja comprar un osciloscopio o analizador lógico barato y ver la señal en vivo.')]
    }),
    L({
      id: 'r11-10', title: 'Especialidad: simulación y sistemas', min: 11,
      objectives: ['Conocer el día a día de simulación e integración', 'Saber qué profundizar'],
      blocks: [
        h('Por qué existen simulación e integración'),
        p('Probar un controlador nuevo directamente en el robot rompe hardware y no es reproducible: dos ejecuciones con la misma luz y la misma batería rara vez coinciden. La simulación existe para entrenar y validar sin coste físico; la integración existe para que percepción, control y planificación convivan en un robot real con temporización y redes. Es la capa donde una idea se convierte en sistema.'),
        p('La simulación permite entrenar y validar sin romper hardware; la integración hace que todos los subsistemas convivan en un robot real. Son dos caras de la misma moneda y probablemente tu mejor entrada si vienes de SWE.'),
        lista(['Cimientos: URDF/SDF, ros2_control, Gazebo/MuJoCo/Isaac, tf2, Docker, redes.', 'Herramientas: ROS 2, Gazebo, MoveIt, Nav2, CI, rosbag.', 'Tareas: modelar robots, sim-to-real, pipelines de datos, pruebas, despliegue en flota.', 'Métrica típica: fidelidad de simulación, tiempo de arranque, reproducibilidad.']),
        p('Un rosbag de 3 minutos con 20 topics a 30 Hz ocupa del orden de 100–200 MB; un paso de física de 1 ms en Gazebo son 1000 pasos por segundo simulado. Un URDF con inercias genéricas de 0,001 en vez de los valores medidos cambia por completo la respuesta del brazo. Aleatorizar masa, fricción y retardo al entrenar es la vía estándar para reducir el salto sim-to-real.'),
        tabla(['Herramienta', 'Punto fuerte', 'Coste o límite', 'Ideal para'], [
          ['Gazebo', 'Integración ROS 2, sensores y mundos complejos', 'Más pesado y contactos menos precisos', 'Nav2, celdas y robótica móvil'],
          ['MuJoCo', 'Contacto rápido y estable, buen sim-to-real', 'Menos complementos ROS y licencia propia', 'Manipulación y aprendizaje por refuerzo'],
          ['Isaac Sim', 'Fotorealismo y GPU para síntesis de datos', 'Requiere hardware NVIDIA y curva de aprendizaje', 'Percepción y flotas grandes']
        ]),
        apunte('Por qué es una buena entrada', 'Tu experiencia con sistemas, contenedores, CI y código limpio es directamente transferible. Solo necesitas añadir el vocabulario físico: marcos, inercias, contactos y temporización.'),
        aviso('El error típico es confiar en el URDF por defecto: masas e inercias genéricas hacen que el robot simulado se mueva como uno distinto. Validación mínima: compara cada marco tf2 con el medido en el real y comprueba que el par de gravedad calculado coincide antes de entrenar cualquier política.'),
        pasos([
          { title: '1. Valida el URDF', text: 'check_urdf robot.urdf para detectar errores de sintaxis y eslabones desconectados.' },
          { title: '2. Arranca la simulación', text: 'gz sim -r world.sdf o ros2 launch gazebo_ros gazebo.launch.py, según tu versión.' },
          { title: '3. Inspecciona marcos', text: 'ros2 run tf2_tools view_frames y compara el árbol con el del robot real.' },
          { title: '4. Cierra el ciclo', text: 'Graba un rosbag de 30 s en simulación y en real; compara latencias y trayectorias antes de dar por buena la política.' }
        ]),
        enlace('https://gazebosim.org/docs', 'Gazebo', 'Documentación oficial: mundos, sensores, física e integración con ROS 2.')
      ],
      errors: [err('El brazo simulado no se parece al real', 'Inercias y masas genéricas en el URDF', 'Mide masas e inercias del hardware y compara marcos tf2 y par de gravedad.')],
      practice: { task: 'Modela tu robot en URDF, cárgalo en Gazebo o MuJoCo y comprueba que los marcos tf2 y los parámetros de inercia coinciden con el hardware real.', success: ['URDF carga sin errores', 'Marcos tf2 correctos', 'Comparas simulación con el robot real'] },
      quiz: [q('¿Por qué es una buena entrada en robótica para alguien que viene de SWE?', ['Porque no requiere ningún conocimiento físico', 'Porque la experiencia con contenedores, CI y código limpio es transferible; solo faltan marcos, inercias y contactos', 'Porque evita usar ROS 2', 'Porque no hay que medir nada'], 1, 'El apunte señala que las habilidades de sistemas se transfieren y solo hay que añadir vocabulario físico.')]
    }),
    L({
      id: 'r11-11', title: 'Cómo seguir aprendiendo', min: 10,
      objectives: ['Construir un plan de aprendizaje sostenible', 'Evitar el síndrome del curso infinito'],
      blocks: [
        p('La robótica no se termina. Lo que importa es construir un bucle de aprendizaje que no dependa de la motivación: leer un poco, construir algo, medirlo y escribirlo.'),
        pasos([
          { title: 'Un concepto por semana', text: 'Elige un tema de esta academia y llévalo a un experimento pequeño.' },
          { title: 'Un proyecto por mes', text: 'Algo que se mueva y tenga README con números y fallos.' },
          { title: 'Sigue fuentes primarias', text: 'Documentación oficial, artículos abiertos y repos con código, no resúmenes en redes.' },
          { title: 'Vuelve a lo básico', text: 'Cuando algo no funcione, baja una capa: del modelo al sensor, del sensor al cable.' }
        ]),
        apunte('La regla de oro', 'Si no lo puedes medir, no sabes si funciona. Un multímetro, un log y un cronómetro son tus mejores profesores.'),
        enlace('https://github.com/huggingface/lerobot', 'LeRobot', 'Comunidad activa donde ver código real de robots aprendiendo.'),
        enlace('https://articulatedrobotics.xyz/tutorials/', 'Articulated Robotics', 'El mejor hilo conductor gratuito de ROS 2 aplicado.')
      ],
      practice: { task: 'Diseña tu bucle de aprendizaje del próximo mes: un concepto semanal llevado a un experimento pequeño y un proyecto con README que incluya números y fallos.', success: ['Cuatro conceptos con experimento', 'Proyecto con README', 'Métricas y fallos documentados'] },
      quiz: [q('¿Cuál es la regla de oro de esta lección?', ['Si no lo puedes medir, no sabes si funciona', 'Estudiar solo con cursos', 'Usar siempre el modelo más grande', 'Evitar los cables'], 0, 'La regla de oro: si no lo puedes medir, no sabes si funciona; un multímetro, un log y un cronómetro son tus mejores profesores.')]
    })
  ])
];
