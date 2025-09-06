import {ApiResponse} from "../../../shared/types/response.type";

class SignUpResponseData {
    id: string;
    email: string;
}

export class SignUpResponse extends ApiResponse(SignUpResponseData) {}
