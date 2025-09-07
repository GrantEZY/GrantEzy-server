import {createParamDecorator, ExecutionContext} from "@nestjs/common";

const getCurrentUser = (context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user; // eslint-disable-line @typescript-eslint/no-unsafe-return
};
export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        return getCurrentUser(context); // eslint-disable-line @typescript-eslint/no-unsafe-return
    }
);
