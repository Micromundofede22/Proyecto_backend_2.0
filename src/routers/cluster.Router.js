// import { Router } from 'express' 
// import cluster from 'cluster' //balanceador de carga nativo de  NodeJs
// import { cpus } from 'os' //los nucleos de mi cpu

// const router= Router()

// router.get("/", ()=>{

//     if (cluster.isPrimary) {
//         console.log(`proceso primario(${process.pid})`)
        
//         for (let index = 0; index < cpus.length ; index++) {
//             cluster.fork()
//         }
//     } else {
//         console.log(`Proceso clonado ${process.pid}`) 
//     }
// })

// export default router