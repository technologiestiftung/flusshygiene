import { Request, Response} from 'express';
import Router from 'express-promise-router';
import {getRepository} from "typeorm";
import {User} from "../orm/entity/User";

const router = Router();


interface IDefaultResponsePayload {
  success: boolean;
  message?: string;
};

type postResponse = (request: Request, response: Response) => void;
type getResponse = (request: Request, response: Response) => void;

const defaultPostResponse: postResponse = async (_request, response) =>{
  response.status(201).json(defaultResponsePayload);
}

const defaultGetResponse: getResponse = async (request, response) =>{
  response.status(200).json(request.body);
}

const getUsers: getResponse = async (_request, response)=>{
  let users: User[];

  try{
    users = await getRepository(User, 'getuser').find();
    response.json(users);
  }catch(e){
    const res: IDefaultResponsePayload = {
      success: false,
      message: e.message
    };
    response.json(res);
  }
}
const defaultResponsePayload: IDefaultResponsePayload = {success: true};

router.get('/read/:id', defaultGetResponse);

router.post('/write', defaultPostResponse);

router.post('/patch/:id', defaultPostResponse);

router.post('/remove/:id', defaultPostResponse);

router.post('/find', defaultPostResponse);

router.post('/find/users', getUsers);

// subClient.subscribe('read');
// subClient.subscribe('write');
export default router;
