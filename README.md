# Taller - Organización del código y despliegue en EC2

API HTTP en Node.js con tres rutas: `/salud`, `/equipo` y `/notas`. El proyecto incluye la versión original (`antes.js`) y la versión refactorizada (`server.js`), además del script `userdata-ec2.sh` para desplegar en AWS EC2.

## 1. Correcciones de refactorización

1. **Nombres claros y sin números mágicos**
   - Se reemplazaron variables crípticas como `s`, `d`, `t` y `p` por nombres descriptivos: `servidor`, `notasDelCurso`, `sumaTotal` y `promedioCalculado`.
   - Se extrajo el valor `3.0` a la constante `NOTA_MINIMA_APROBACION`.

2. **DRY (sin lógica repetida)**
   - Se creó la función reutilizable `responderJSON(res, codigoEstado, datos)` para centralizar la cabecera `Content-Type: application/json; charset=utf-8` y el envío de la respuesta JSON.

3. **Separación de responsabilidades / funciones enfocadas**
   - `calcularPromedio(notas)`: calcula el promedio del arreglo de notas.
   - `estaAprobado(promedio)`: determina si el promedio cumple la nota mínima.
   - `manejarPeticion(req, res)`: enruta las peticiones y delega la lógica a las funciones anteriores.

4. **Puerto configurable**
   - `server.js` usa `const PUERTO = process.env.PORT || 80;`, lo que permite ejecutarlo en local con `PORT=3000` y en EC2 usar el puerto `80`.

## 2. Probar en local

Requisito: Node.js instalado.

### Versión original (`antes.js`)

```powershell
cd "C:\Users\UNIGUAJIRA FONSECA\OneDrive\Documentos\taller-ec2-api"
node antes.js
```

En otra terminal de PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/salud
Invoke-RestMethod http://localhost:3000/equipo
Invoke-RestMethod http://localhost:3000/notas
Invoke-RestMethod http://localhost:3000/ruta-inexistente
```

### Versión refactorizada (`server.js`)

```powershell
cd "C:\Users\UNIGUAJIRA FONSECA\OneDrive\Documentos\taller-ec2-api"
$env:PORT=3000; node server.js
```

En otra terminal de PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/salud
Invoke-RestMethod http://localhost:3000/equipo
Invoke-RestMethod http://localhost:3000/notas
Invoke-RestMethod http://localhost:3000/ruta-inexistente
```

Respuesta esperada de `/notas`:

```json
{
  "promedio": 3.625,
  "aprobado": true
}
```

## 3. Despliegue en AWS EC2

1. En AWS EC2, crea una instancia con:
   - **AMI:** Amazon Linux 2023.
   - **Tipo:** `t3.micro`.
   - **Key pair:** sin key pair (Proceed without a key pair).
   - **Security Group:** crear o seleccionar uno con regla de entrada **HTTP (puerto 80)** desde `0.0.0.0/0`. **No** abrir SSH.
2. En **Advanced details > User data**, pega el contenido completo de [`userdata-ec2.sh`](./userdata-ec2.sh).
3. Lanza la instancia y espera a que termine la inicialización.
4. Obtén la IP pública de la instancia y prueba:
   - `http://<IP_PUBLICA>/salud`
   - `http://<IP_PUBLICA>/equipo`
   - `http://<IP_PUBLICA>/notas`
5. Al finalizar la verificación, elimina la instancia con **Instance state > Terminate instance** para evitar costos.
