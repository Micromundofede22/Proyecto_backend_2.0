import { Router } from "express";

export default class AppRouter {
    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter() {
        return this.router // este método me trae el Router() e inicializa todo
    }

    init() { } // se sobreescribe e inicializa las clases heredadas en las extensiones de clases

    get(path, ...callbacks) { //...spread ya que va el controller,pueden ir middleware, por eso se pone el spred, recibiendo un array
        this.router.get(
            path,                         // rutas 
            this.generateCustomResponses, //respuestas del servidor
            this.applyCallbacks(callbacks)) //aplicacion de los middlewares y controllers
    }

    post(path, ...callbacks) {
        this.router.post(
            path,
            this.generateCustomResponses,
            this.applyCallbacks(callbacks))
    }

    put(path, ...callbacks) {
        this.router.put(
            path,
            this.generateCustomResponses,
            this.applyCallbacks(callbacks))
    }


    delete(path, ...callbacks) {
        this.router.delete(
            path,
            this.generateCustomResponses,
            this.applyCallbacks(callbacks))
    }

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => { //mapea todas las funciones. params es req, res, next, err
            try {
                // apply, ejecutara la funcion callback apuntando directamente a una
                // instancia de la clase, por ello, colocamos this para que se utilice
                // solo el contexto de este router, los parametros son internos de cada
                // callback, sabemos que los params de un callback corresponden a req,res,next
                await callback.apply(this, params)
            } catch (err) {
                console.log(err)
                params[1].status(500).json({ error: err }) //params[1] es (res). params[0] es req
            }
        })
    }

    //genera las respuestas del servidor
    generateCustomResponses = (req, res, next) => {
        //respuestas predeterminadas en su estructura, luego solo le paso el contenido
        res.sendSuccess = payload =>
            res.status(200).json({ status: 'success', payload: payload })

        res.createdSuccess = (payload) =>
            res.status(201).json({ status: "success", payload: payload });

        res.sendError = error =>
            res.status(400).json({ status: 'error', error: error })

        res.unauthorized = (error) =>
            res.status(401).json({ status: "error", error: error });

        res.sendRequestError = (error) =>
            res.status(404).json({ status: "error", error: error });

        res.sendServerError = (error) =>
            res.status(500).json({ status: "error", error: error });
        // res.sendUserError = (error) =>
        //   res.status(400).json({ status: "error", error });

        next()
    }




}