import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectModel } from "@nestjs/mongoose";
import {Strategy, ExtractJwt} from "passport-jwt";
import { Model } from "mongoose";
import { IUser } from "../_interfaces/IUser";
import { IPayload } from "../_interfaces/IPayload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectModel ('User') private userModel: Model<IUser>){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload : IPayload) {
        const {pseudo} = payload;
        const user = await this.userModel.findOne({pseudo});
        if(!user) {
            throw new UnauthorizedException('Login first to access this endpoint')
        }
        return user;
    }

}