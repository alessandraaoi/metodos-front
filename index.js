console.clear();
console.log('Starting practica-methods');

const { v4 } = require('uuid')

const cors = require ('cors')

const express = require ('express')

const app = express ()

// Middleware para interactuar entre server y client
app.use(cors())

// para recibir información del form // Middleware
app.use (express.urlencoded({extended: false}))
app.use (express.json())

let alumnos = [
    {
        _id: v4(),
        nombre: 'Timmy',
        edad: 19
    }
]


// Leer: Array alumnos
app.get ('/', ( req, res, next ) => {
    try{
      res.status(200).json (alumnos)  
    } catch (error) {
        next (error)
    }
    
})

// Búsqueda por id
app.get ('/alumnos/id/:_id', ( req, res, next ) => {

    try {
    // Recibo datos por Params
    const { _id } = req.params

    // buscamos un alumno cuya propiedad id es igual al parametro _id de la URL
    const buscar = alumnos.find (alumno => alumno._id == _id)

    // devuelve el alumno encontrado en la búsqueda previa
    res.status(200).json(buscar)  
    } catch (error) {
        next(error)
    }
    
})

// Añadir 'alumno'
app.post ('/alumnos', ( req, res, next ) => {

    try {
    // Recibo datos por Body
    const { nombre, edad } = req.body

    console.log(nombre);
 

    // Creamos el nuevo 'alumno'
    const nuevo = { _id: v4(), nombre, edad}

    // Array alumnos = nuevo 'alumno' + el resto de 'alumnos'
    alumnos = [nuevo, ...alumnos]

    // Devuelve: Array alumnos
    res.status(200).json( alumnos ) 
    } catch (error) {
        next(error)
    }
    
})

// Actualizamos SOLO un dato
app.patch ('/alumnos', ( req, res, next ) => {
    try {
      // Recibo datos por Body
    // Necesito id + propiedad que quiero cambiar (en este caso: nombre)
    const { _id, nombre } = req.body

    // 1. Busco la posición del elemento que quiero cambiar
    const posicion = alumnos.findIndex (alumno => alumno._id == _id)
    alumnos[posicion].nombre = nombre
    res.status(200).json (alumnos)  
    } catch (error) {
        next(error)
    }

    
})

// Actualizar TODO el dato
app.put ('/alumnos', (req, res, next) => {

    try {
     // Recibo datos por Body
    // Guardo todas las propiedades en un nuevo Object datos
    const { _id, ...datos} = req.body
    const posicion = alumnos.findIndex( alumno => alumno._id == _id)
    alumnos[posicion] = {...req.body}
    res.status(200).json (alumnos)   
    } catch (error) {
        next(error)

    }

    
}) 

app.delete ('/alumnos/id/:_id', (req, res, next) => {

    try{
      const {_id} = req.params
    const busqueda = alumnos.filter (alumno => alumno._id != _id)
    alumnos = busqueda
    res.status(200).json(alumnos)  
    } catch (error) {
        next(error)
    }
    

})

// Middleware para gestionar errores
app.use(( req , res , next  )=>{
    let error = new Error()
        error.message = 'No encuentro el Endpoint'
        error.status  = 404
        next(error)
})

app.use(( error , req , res , next  )=>{
        let { status , message } = error
              status = status || 500
        
        res.status(status).json(`Error en la API: ${message}`)
})

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
  }) 
  

app.listen ( 3000, (req, res) => 
{console.log('Port OK')}
)

