import { ticketModel } from "../models/ticket.models.js";

export default class TicketMongoDAO {
    getAll = async () => await ticketModel.find().lean().exec();
    getAllData= async(data) => await ticketModel.find(data).lean().exec()
    getById = async (id) => await ticketModel.findById(id).lean().exec();
    getByData = async (data) => await ticketModel.findOne(data).lean().exec();
    create = async (data) => await ticketModel.create(data);
};
