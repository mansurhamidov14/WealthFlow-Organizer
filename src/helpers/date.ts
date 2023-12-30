import { MS_IN_DAY } from "@app/constants";
import { Lang } from "@app/i18n/types";

type DateProcessorDay = {
  timestamp: number;
  date: Date;
  dateString: string;
  weekday: number;
}

export class DateProcessor {
  yesterday: DateProcessorDay;
  today: DateProcessorDay;
  tomorrow: DateProcessorDay;
  mondayStartTimestamp: number;
  sundayEndTimestamp: number;

  constructor(
    private translateFn: (
      key: string,
      ns?: string,
      params?: Record<string, number | string>,
      lang?: Lang
    ) => string,
    private locale: string = "en-GB"
  ) {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const todayTimestamp = todayDate.getTime();
    const todayWeekDay = todayDate.getWeekDay();
    
    const yesterdayTimestamp = todayTimestamp - MS_IN_DAY;
    const yesterdayDate = new Date(yesterdayTimestamp);
    
    const tomorrowTimestamp = todayTimestamp + MS_IN_DAY;
    const tomorrowDate = new Date(tomorrowTimestamp);

    this.mondayStartTimestamp = todayTimestamp - (todayWeekDay - 1) * MS_IN_DAY;
    this.sundayEndTimestamp = todayTimestamp + (7 - todayWeekDay + 1) * MS_IN_DAY - 1;

    this.today = {
      date: todayDate,
      timestamp: todayTimestamp,
      dateString: todayDate.toLocaleDateString(locale),
      weekday: todayWeekDay,
    };

    this.yesterday = {
      date: yesterdayDate,
      timestamp: yesterdayTimestamp,
      dateString: yesterdayDate.toLocaleDateString(locale),
      weekday: yesterdayDate.getWeekDay()
    };

    this.tomorrow = {
      date: tomorrowDate,
      timestamp: tomorrowTimestamp,
      dateString: tomorrowDate.toLocaleDateString(locale),
      weekday: tomorrowDate.getWeekDay()
    };
  }

  humanize(date: Date, type: "short" | "long" = "long") {
    const dateString = date.toLocaleDateString(this.locale);

    if (this.dateStringIsToday(dateString)) {
      return this.translateFn("today", "Date");
    }

    if (this.dateStringIsYesterday(dateString)) {
      return this.translateFn("yesterday", "Date");
    }

    if (this.dateStringIsTomorrow(dateString)) {
      return this.translateFn("tomorrow", "Date");
    }

    return this.translateFn(`${type}.date.${date.getMonth()}`, "Date", { date: date.getDate() });
  }

  isToday(date: Date | number) {
    const dateObj = typeof date === "number" ? new Date(date) : date;
    return dateObj.toLocaleDateString(this.locale) === this.today.dateString;
  }

  isYesterday(date: Date | number) {
    const dateObj = typeof date === "number" ? new Date(date) : date;
    return dateObj.toLocaleDateString(this.locale) === this.yesterday.dateString;
  }

  isTomorrow(date: Date | number) {
    const dateObj = typeof date === "number" ? new Date(date) : date;
    return dateObj.toLocaleDateString(this.locale) === this.yesterday.dateString;
  }

  isWeekAgoOrMore(date: Date | number) {
    return this.getDayDifference(date) <= -7
  }

  withinThisWeek(date: Date | number) {
    const timestamp = typeof date === "number" ? date : date.getTime();
    return timestamp >= this.mondayStartTimestamp && timestamp <= this.sundayEndTimestamp;
  }

  isTodayOrAfter(date: Date | number) {
    const timestamp = typeof date === "number" ? date : date.getTime();
    return timestamp >= this.today.timestamp;
  }

  public getDayDifference(date: Date | number) {
    const timestamp = typeof date === "number" ? date : date.getTime();
    return (timestamp - this.today.timestamp) / MS_IN_DAY;
  }

  private dateStringIsToday(dateString: string) {
    return dateString === this.today.dateString;
  }

  private dateStringIsYesterday(dateString: string) {
    return dateString === this.yesterday.dateString;
  }

  private dateStringIsTomorrow(dateString: string) {
    return dateString === this.tomorrow.dateString;
  }
}
