import { messagesModel } from "../models/message.model.js";

export default class MessageMongoDao {
    getAll = async () => await messagesModel.find().lean();
};