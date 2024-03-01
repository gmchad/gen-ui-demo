import { OpenAI } from "openai";
import { runOpenAICompletion } from "@/lib/utils/index"
import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import { z } from "zod";
import { getWeather } from "@/lib/utils/index";
import { Weather } from "@/components/weather";
import { IconAI } from "@/components/ui/icons";
 
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});
 
async function submitUserMessage(content: string) {
	"use server";
 
	const aiState = getMutableAIState();
 
	// Update AI state with new message
	aiState.update([
		...aiState.get(),
		{
			role: "user",
			content,
		},
	]);
 
	const uiStream = createStreamableUI(<div>Loading...</div>);
 
	const completion = runOpenAICompletion(openai, {
		model: "gpt-3.5-turbo",
		stream: true,
		messages: [
			{
				role: "system",
				content: `You are a friendly weather assistant!`,
			},
			...aiState.get().map((message: any) => ({
				role: message.role,
				content: message.content,
			})),
		],
		functions: [
			{
				name: 'get_current_weather',
				description: 'Get the current weather in a given location',
				parameters: z.object({
						location: z
							.string()
							.describe('The city and state, e.g. San Francisco, CA'),
						unit: z
							.string()
							.describe('The unit of the temperature, e.g. C or F'),
					})
			},
		] as const,
	});
 
	completion.onTextContent((content: string, isFinal: boolean) => {
		uiStream.update(
			<div className="group relative flex items-start">
				<div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
					<IconAI />
				</div>
				<div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
					{content}
				</div>
			</div>
		);
 
		if (isFinal) {
			uiStream.done();
			aiState.done([...aiState.get(), { role: "assistant", content }]);
		}
	});
 
	completion.onFunctionCall("get_current_weather", async ({ location, unit }) => {
		const { temperature, description } = await getWeather(location, unit);
 
		uiStream.done(
			<Weather
				temperature={temperature}
				unit={unit}
				description={description}
			/>
		);
 
		aiState.done([
			...aiState.get(),
			{
				role: "system",
				content: `The weather is ${temperature}${unit}, ${description}.`,
			},
		]);
	});
 
	return {
		id: Date.now(),
		display: uiStream.value,
	};
}

const initialAIState: {
	role: 'user' | 'assistant' | 'system' | 'function';
	content: string;
	id?: string;
	name?: string;
}[] = [];

const initialUIState: {
	id: number;
	display: React.ReactNode;
}[] = [];

 
export const AI = createAI({
	actions: {
		submitUserMessage
	},
	initialUIState,
	initialAIState
});