import connectMongo from '../../../utils/connectMongo';
import User from '../../../models/userModel';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function addTest(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectMongo();
        const user = await User.create(req.body);
        res.json({ user });
        console.log(req.body);
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}