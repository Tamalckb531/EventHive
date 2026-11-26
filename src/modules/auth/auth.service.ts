interface LoginPayload {
    email: string,
    password: string,
}
const LoginServiceFunction = async (payload: LoginPayload) => { }

export const authService = {
    LoginServiceFunction
}