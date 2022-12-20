import connectMongo from '../../../utils/connectMongo';
import User from '../../../models/userModel';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectMongo();
        const user = await User.create(req.body);
        res.json({ user });
    } catch (error) {
        res.json({ error });
    }
}