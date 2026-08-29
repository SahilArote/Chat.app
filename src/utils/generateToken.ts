import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../config';

const generateToken = (userId: Types.ObjectId | string): string => {
    const secret: Secret = config.jwt.secret;
    const signOptions: SignOptions = {
        expiresIn: config.jwt.expiresIn as any
    };
    return jwt.sign({ userId: userId.toString() }, secret, signOptions);
};

export default generateToken;
