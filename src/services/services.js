import { ProductDAOFactory } from "../dao/product.factory.js"; //DAO dinámico
import CartMongoDAO from "../dao/cart.mongo.DAO.js";
import ProductRepository from "../repositories/product.repositorie.js";
import CartRepository from "../repositories/cart.repositorie.js";
import TicketRepositorie from "../repositories/ticket.repositorie.js";
import TicketMongoDAO from "../dao/ticket.mongo.DAO.js";
import UserRepositorie from "../repositories/users.repositorie.js";
import UserMongoDAO from "../dao/users.mongo.DAO.js";
import MessageRepositorie from "../repositories/message.repositorie.js";
import MessageMongoDao from "../dao/message.mongo.DAO.js";
import userPasswordRepositorie from "../repositories/userPassword.repositorie.js";
import userPasswordMongoDAO from "../dao/userPassword.mongo.js";


export const ProductService= new ProductRepository(new ProductDAOFactory()); //DAO dinamico (mongo o file)

export const CartService= new CartRepository(new CartMongoDAO());

export const TicketService= new TicketRepositorie(new TicketMongoDAO());

export const UserService= new UserRepositorie(new UserMongoDAO()); 

export const MessageService= new MessageRepositorie(new MessageMongoDao());

export const UserPasswordService= new userPasswordRepositorie(new userPasswordMongoDAO());