import AppRouter from "./appRouter.js";
import { generateUser } from "../utils.js";

export default class MockRouter extends AppRouter{
    init(){
        this.get("/", async(req,res)=>{
            for (let index = 0; index < 100; index++) {
                users.push(generateUser())
            }
            res.send({ status: 'success', payload: users })
        })
    }
}