export const Weather = ({ temperature, unit, description }: {
	temperature: String, unit: String, description: String}) => {
	return (
		<div className="bg-red-500 p-4 rounded-lg text-center w-auto mx-auto my-4">
			<p className="text-lg font-semibold">Temperature: {temperature}°{unit}</p>
			<p className="text-md text-gray-700">Description: {description}</p>
		</div>
	);
};

export default Weather;
