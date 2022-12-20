import connectMongo from '../../../../utils/connectMongo';
import User from '../../../../models/userModel';
import type { NextApiRequest, NextApiResponse } from 'next'
import { userInfo } from 'os';

type UserInfo = {
    name: String | undefined;
    email: String | undefined;
    age: String | undefined;
    address: String | undefined;
    mobile: String | undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { email } = req.query
    try {

        await connectMongo();

        const user = await User.findOne({ email: email });

        res.json({ user });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}