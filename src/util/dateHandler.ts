const currentDate = new Date();

const formatOptions = {
	weekday: "long",
	hour: "2-digit",
	minute: "2-digit",
	year: "numeric",
	month: "long",
	day: "numeric",
} as const;

const dateFormatter = (date: Date) => date.toLocaleDateString("en-GB", formatOptions);

const expirationDateHandler = (expirationTimeInSeconds: number) => {
	return dateFormatter(new Date(currentDate.getTime() + (expirationTimeInSeconds / 60) * 60000));
};

export { expirationDateHandler, dateFormatter };
