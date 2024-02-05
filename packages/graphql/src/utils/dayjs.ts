import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TAI64 } from "tai64";
dayjs.extend(relativeTime);

export const tai64toDate = (tai64Timestamp: string) => {
	const timestamp = TAI64.fromString(tai64Timestamp, 10).toUnix();
	return dayjs(timestamp * 1000);
};

export const dateToTai64 = (date: Date) => {
	return TAI64.fromUnix(Math.floor(date.getTime() / 1000)).toString(10);
};

export { dayjs };
