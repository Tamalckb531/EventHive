interface LoginPayload {
    email: string,
    password: string,
}
const isUserExists = async (email: string) => { }

export const authRepository = {
    isUserExists
}