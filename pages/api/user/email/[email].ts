import connectMongo from '../../../../utils/connectMongo';
import User from '../../../../models/userModel';
import type { NextApiRequest, NextApiResponse } from 'next'
import { userInfo } from 'os';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { email } = req.query
    try {
        await connectMongo();
        const user = await User.findOne({ email: email });
        res.json({ user });
    } catch (error) {
        res.json({ error });
    }
}