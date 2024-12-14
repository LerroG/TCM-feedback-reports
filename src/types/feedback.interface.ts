// /GetFeedbacks
export interface IFeedbackResponse {
	Code: number
	Msg: string
	Data: IFeedbackItem[]
}

export interface IFeedbackItem {
	Answer: string
	Date: string
	DeviceName: string
	Info: string
	Lang: string
	Question: string
	Time: string
}

// /GetFeedbackStat
export interface IFeedbackStatResponse {
	Code: number
	Msg: string
	Data: IFeedbackStatItem[]
}

export interface IFeedbackStatItem {
	Question: string
	TotalAnswersCount: number
	AnswerData: IFeedbackStatAnswerItem[]
}

export interface IFeedbackStatAnswerItem {
	Answer: string
	Count: number
}
