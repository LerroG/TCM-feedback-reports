export interface IAuthForm {
	Username: string
	Password: string
}

export interface IAuthResponse {
	Code: number
	Msg: string
	Token?: string
}
