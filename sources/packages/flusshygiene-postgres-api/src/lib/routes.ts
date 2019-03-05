import { Request, Response, Router} from 'express';

const router = Router();
interface IDefaultResponsePayload {
  success: boolean;
  message?: string;
};

type postResponse = (request: Request, response: Response) => void;
type getResponse = (request: Request, response: Response) => void;

const defaultPostResponse: postResponse = (_request, response) =>{
  response.status(201).json(defaultResponsePayload);
}

const defaultGetResponse: getResponse = (request, response) =>{
  response.status(200).json(request.body);
}

const defaultResponsePayload: IDefaultResponsePayload = {success: true};
router.get('/read/:id', defaultGetResponse);

router.post('/write', defaultPostResponse);

router.post('/patch/:id', defaultPostResponse);

router.post('/remove/:id', defaultPostResponse);

router.post('/find', defaultPostResponse);

// subClient.subscribe('read');
// subClient.subscribe('write');
export default router;
